from flask import Blueprint, jsonify, request
from models import Festival, DailySales, SocialMetric, DerivedMetric
from database import db
from analytics_engine import AnalyticsEngine
from seed_generator import seed_all_data
from sqlalchemy import func

api_bp = Blueprint('api', __name__)

@api_bp.route('/seed', methods=['POST'])
def run_seed():
    try:
        seed_all_data()
        return jsonify({"message": "Database seeded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/festivals', methods=['GET'])
def get_festivals():
    festivals = Festival.query.all()
    return jsonify([f.to_dict() for f in festivals])

@api_bp.route('/summary', methods=['GET'])
def get_summary():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query_sales = db.session.query(
        func.sum(DailySales.total_revenue).label('total_rev'),
        func.sum(DailySales.total_orders).label('total_ord'),
        func.sum(DailySales.new_customer_revenue).label('new_rev'),
        func.sum(DailySales.repeat_customer_revenue).label('rep_rev')
    )
    
    query_derived = db.session.query(
        func.avg(DerivedMetric.sales_uplift_pct).label('avg_uplift'),
        func.sum(DerivedMetric.total_engagement).label('total_eng')
    )

    if start_date and end_date:
        query_sales = query_sales.filter(DailySales.date.between(start_date, end_date))
        query_derived = query_derived.filter(DerivedMetric.date.between(start_date, end_date))

    sales_res = query_sales.one()
    derived_res = query_derived.one()

    return jsonify({
        "total_revenue": sales_res.total_rev or 0,
        "total_orders": sales_res.total_ord or 0,
        "new_vs_repeat_ratio": (sales_res.new_rev / sales_res.total_rev) if sales_res.total_rev and sales_res.total_rev > 0 else 0,
        "avg_uplift_pct": derived_res.avg_uplift or 0,
        "total_engagement": derived_res.total_eng or 0
    })

@api_bp.route('/timeline', methods=['GET'])
def get_timeline():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    data = AnalyticsEngine.get_timeline_data(start_date, end_date)
    return jsonify(data)

@api_bp.route('/social-breakdown', methods=['GET'])
def get_social_breakdown():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    data = AnalyticsEngine.get_social_breakdown(start_date, end_date)
    return jsonify(data)

@api_bp.route('/lag-analysis', methods=['GET'])
def get_lag_analysis():
    lag = int(request.args.get('lag', 3))
    data = AnalyticsEngine.get_lag_analysis_data(lag)
    return jsonify(data)

@api_bp.route('/counterfactual', methods=['GET'])
def get_counterfactual():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Date range required"}), 400
    data = AnalyticsEngine.get_counterfactual_data(start_date, end_date)
    return jsonify(data)