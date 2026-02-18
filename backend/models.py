from database import db

class Festival(db.Model):
    __tablename__ = 'festivals'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat()
        }

class DailySales(db.Model):
    __tablename__ = 'daily_sales'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False)
    total_revenue = db.Column(db.Float, default=0.0)
    total_orders = db.Column(db.Integer, default=0)
    new_customer_revenue = db.Column(db.Float, default=0.0)
    repeat_customer_revenue = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'date': self.date.isoformat(),
            'total_revenue': self.total_revenue,
            'total_orders': self.total_orders,
            'new_customer_revenue': self.new_customer_revenue,
            'repeat_customer_revenue': self.repeat_customer_revenue
        }

class SocialMetric(db.Model):
    __tablename__ = 'social_metrics'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    impressions = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    shares = db.Column(db.Integer, default=0)
    comments = db.Column(db.Integer, default=0)
    sentiment_score = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'date': self.date.isoformat(),
            'platform': self.platform,
            'impressions': self.impressions,
            'clicks': self.clicks,
            'likes': self.likes,
            'shares': self.shares,
            'comments': self.comments,
            'sentiment_score': self.sentiment_score
        }

class DerivedMetric(db.Model):
    __tablename__ = 'derived_metrics'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False)
    total_engagement = db.Column(db.Integer, default=0)
    engagement_rate = db.Column(db.Float, default=0.0)
    social_buzz_index = db.Column(db.Float, default=0.0)
    baseline_sales_estimated = db.Column(db.Float, default=0.0)
    sales_uplift_pct = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'date': self.date.isoformat(),
            'total_engagement': self.total_engagement,
            'engagement_rate': self.engagement_rate,
            'social_buzz_index': self.social_buzz_index,
            'baseline_sales_estimated': self.baseline_sales_estimated,
            'sales_uplift_pct': self.sales_uplift_pct
        }