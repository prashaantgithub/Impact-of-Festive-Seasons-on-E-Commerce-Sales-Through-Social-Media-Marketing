import pandas as pd
from database import db
from models import DailySales, SocialMetric, DerivedMetric

class AnalyticsEngine:
    
    @staticmethod
    def get_timeline_data(start_date=None, end_date=None):
        query = db.session.query(
            DailySales.date,
            DailySales.total_revenue,
            DerivedMetric.social_buzz_index,
            DerivedMetric.sales_uplift_pct
        ).join(DerivedMetric, DailySales.date == DerivedMetric.date)
        
        if start_date and end_date:
            query = query.filter(DailySales.date.between(start_date, end_date))
            
        results = query.all()
        
        data = []
        for r in results:
            data.append({
                "date": r.date.isoformat(),
                "sales": r.total_revenue,
                "social_buzz": r.social_buzz_index,
                "uplift": r.sales_uplift_pct
            })
        return data

    @staticmethod
    def get_social_breakdown(start_date=None, end_date=None):
        query = db.session.query(SocialMetric)
        
        if start_date and end_date:
            query = query.filter(SocialMetric.date.between(start_date, end_date))
            
        df = pd.read_sql(query.statement, db.engine)
        
        if df.empty:
            return []

        grouped = df.groupby('platform').agg({
            'impressions': 'sum',
            'clicks': 'sum',
            'likes': 'sum',
            'sentiment_score': 'mean'
        }).reset_index()
        
        return grouped.to_dict(orient='records')

    @staticmethod
    def get_lag_analysis_data(lag_days=3):
        sales_query = db.session.query(DailySales.date, DailySales.total_revenue).statement
        social_query = db.session.query(DerivedMetric.date, DerivedMetric.social_buzz_index).statement
        
        sales_df = pd.read_sql(sales_query, db.engine)
        social_df = pd.read_sql(social_query, db.engine)
        
        merged = pd.merge(sales_df, social_df, on='date')
        merged['date'] = pd.to_datetime(merged['date'])
        merged = merged.sort_values('date')
        
        merged['shifted_buzz'] = merged['social_buzz_index'].shift(lag_days)
        merged = merged.dropna()
        
        merged['date'] = merged['date'].dt.strftime('%Y-%m-%d')
        
        return merged[['date', 'total_revenue', 'shifted_buzz']].to_dict(orient='records')

    @staticmethod
    def get_counterfactual_data(start_date, end_date):
        query = db.session.query(
            DailySales.date,
            DailySales.total_revenue,
            DerivedMetric.baseline_sales_estimated
        ).join(DerivedMetric, DailySales.date == DerivedMetric.date).filter(
            DailySales.date.between(start_date, end_date)
        )
        
        results = query.all()
        data = []
        
        total_actual = 0
        total_baseline = 0
        
        for r in results:
            total_actual += r.total_revenue
            total_baseline += r.baseline_sales_estimated
            data.append({
                "date": r.date.isoformat(),
                "actual_sales": r.total_revenue,
                "baseline_sales": r.baseline_sales_estimated,
                "difference": r.total_revenue - r.baseline_sales_estimated
            })
            
        summary = {
            "total_actual": total_actual,
            "total_baseline": total_baseline,
            "net_impact_value": total_actual - total_baseline,
            "net_impact_pct": ((total_actual - total_baseline) / total_baseline * 100) if total_baseline > 0 else 0
        }
        
        return {"chart_data": data, "summary": summary}