import numpy as np
import pandas as pd
from datetime import date, timedelta
import random
from database import db
from models import Festival, DailySales, SocialMetric, DerivedMetric

# Configuration
START_DATE = date(2023, 1, 1)
END_DATE = date(2023, 12, 31)
PLATFORMS = ['Instagram', 'Facebook', 'Twitter']

# Festival Calendar (Static Seed)
FESTIVALS_DATA = [
    {"name": "Republic Day Sale", "start_date": date(2023, 1, 20), "end_date": date(2023, 1, 26)},
    {"name": "Summer Splash", "start_date": date(2023, 5, 10), "end_date": date(2023, 5, 15)},
    {"name": "Freedom Sale", "start_date": date(2023, 8, 10), "end_date": date(2023, 8, 15)},
    {"name": "Diwali Dhamaka", "start_date": date(2023, 11, 1), "end_date": date(2023, 11, 10)},
    {"name": "Christmas Carnival", "start_date": date(2023, 12, 20), "end_date": date(2023, 12, 25)},
]

def generate_base_curve(days):
    """Creates a gentle seasonality curve for the year"""
    x = np.linspace(0, 4 * np.pi, days)
    seasonality = np.sin(x) * 5000 + 20000  # Base around 20k, fluctuates +/- 5k
    return seasonality

def get_festival_multiplier(current_date):
    """Returns a multiplier if the date is within or near a festival"""
    multiplier = 1.0
    is_festival = False
    
    for fest in FESTIVALS_DATA:
        # Pre-buzz (Social leads sales)
        days_before = (fest['start_date'] - current_date).days
        if 0 < days_before <= 7:
            return 1.1, False # Slight sales lift, high social lift intended later
        
        # During festival (High Sales)
        if fest['start_date'] <= current_date <= fest['end_date']:
            return random.uniform(2.5, 4.0), True # Massive spike
            
        # Post-festival (Cool down)
        days_after = (current_date - fest['end_date']).days
        if 0 < days_after <= 3:
            return 0.8, False # Dip below average
            
    return multiplier, is_festival

def seed_all_data():
    print("--- Starting Data Seeding Pipeline ---")
    
    # 1. Clear existing data
    db.session.query(DerivedMetric).delete()
    db.session.query(SocialMetric).delete()
    db.session.query(DailySales).delete()
    db.session.query(Festival).delete()
    db.session.commit()
    print("Cleaned existing database.")

    # 2. Seed Festivals
    for f in FESTIVALS_DATA:
        new_fest = Festival(name=f['name'], start_date=f['start_date'], end_date=f['end_date'])
        db.session.add(new_fest)
    db.session.commit()
    print("Seeded Festivals.")

    # 3. Generate Time Series Data
    total_days = (END_DATE - START_DATE).days + 1
    base_trend = generate_base_curve(total_days)
    
    sales_buffer = []
    social_buffer = []
    derived_buffer = []

    current = START_DATE
    idx = 0
    
    while current <= END_DATE:
        sales_mult, is_fest = get_festival_multiplier(current)
        
        # --- SALES GENERATION ---
        base_val = base_trend[idx]
        noise = random.uniform(-2000, 2000)
        
        # Sales spike logic
        daily_revenue = (base_val + noise) * sales_mult
        daily_revenue = max(daily_revenue, 5000) # Floor
        
        orders = int(daily_revenue / random.uniform(40, 60)) # Avg order value ~50
        
        # New vs Repeat split (Festivals bring more New customers)
        new_cust_ratio = 0.6 if is_fest else 0.3
        new_rev = daily_revenue * new_cust_ratio
        rep_rev = daily_revenue * (1 - new_cust_ratio)
        
        sales_entry = DailySales(
            date=current,
            total_revenue=round(daily_revenue, 2),
            total_orders=orders,
            new_customer_revenue=round(new_rev, 2),
            repeat_customer_revenue=round(rep_rev, 2)
        )
        sales_buffer.append(sales_entry)

        # --- SOCIAL METRICS GENERATION (The Leading Indicator) ---
        # Social buzz peaks 3-5 days BEFORE sales peak
        
        # Look ahead logic simulation by shifting the multiplier effect
        # We need social activity to be high if a festival is approaching in 5 days
        social_mult = 1.0
        
        for fest in FESTIVALS_DATA:
            days_until = (fest['start_date'] - current).days
            if 0 <= days_until <= 10:
                # Ramp up social significantly before festival
                social_mult = 3.0 + (10 - days_until)/5.0 
            elif fest['start_date'] <= current <= fest['end_date']:
                # Sustain high but slightly lower than peak hype
                social_mult = 2.5
        
        day_total_engagement = 0
        
        for platform in PLATFORMS:
            # Platform weights
            p_weight = 1.0 if platform == 'Instagram' else (0.7 if platform == 'Facebook' else 0.5)
            
            impressions = int(random.uniform(5000, 10000) * social_mult * p_weight)
            clicks = int(impressions * random.uniform(0.02, 0.05)) # CTR
            likes = int(impressions * random.uniform(0.05, 0.10))
            shares = int(likes * 0.1)
            comments = int(likes * 0.05)
            
            # Sentiment (Festivals usually happy, unless stock out)
            sentiment = random.uniform(0.6, 0.9) if social_mult > 1.5 else random.uniform(0.3, 0.7)
            
            s_entry = SocialMetric(
                date=current,
                platform=platform,
                impressions=impressions,
                clicks=clicks,
                likes=likes,
                shares=shares,
                comments=comments,
                sentiment_score=round(sentiment, 2)
            )
            social_buffer.append(s_entry)
            
            day_total_engagement += (likes + shares + comments + clicks)

        # --- DERIVED METRICS GENERATION (Pipeline 3) ---
        # Baseline = what sales would be without the multiplier
        baseline_sales = base_val + noise
        uplift = 0
        if baseline_sales > 0:
            uplift = ((daily_revenue - baseline_sales) / baseline_sales) * 100
            
        # Social Buzz Index (Normalized composite score)
        buzz_index = (day_total_engagement / 5000) * 10  # Arbitrary scaling for UI
        
        # Engagement Rate calculation
        total_daily_impressions = sum([s.impressions for s in social_buffer[-3:]]) # last 3 entries are today's 3 platforms
        engagement_rate = (day_total_engagement / total_daily_impressions * 100) if total_daily_impressions > 0 else 0
        
        d_entry = DerivedMetric(
            date=current,
            total_engagement=day_total_engagement,
            engagement_rate=round(engagement_rate, 2),
            social_buzz_index=round(buzz_index, 2),
            baseline_sales_estimated=round(baseline_sales, 2),
            sales_uplift_pct=round(uplift, 2)
        )
        derived_buffer.append(d_entry)

        current += timedelta(days=1)
        idx += 1

    # Bulk Insert
    db.session.add_all(sales_buffer)
    db.session.add_all(social_buffer)
    db.session.add_all(derived_buffer)
    db.session.commit()
    print("--- Data Seeding Complete ---")