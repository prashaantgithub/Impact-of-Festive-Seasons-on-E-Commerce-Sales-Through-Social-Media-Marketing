# Impact of Festive Seasons on E-Commerce Sales Through Social Media Marketing

A full-stack analytics dashboard designed to analyze and quantify how social media engagement influences e-commerce sales during festive seasons. The system models digital buzz as a leading indicator of revenue spikes and provides analytical tools to measure social amplification impact.

## Abstract
Festive sales events create high-intensity transaction periods in e-commerce platforms. While revenue spikes are visible, isolating the true contribution of social media engagement remains complex due to overlapping seasonal demand and discount-driven traffic. This project introduces a time-indexed analytics framework that integrates sales data, platform-wise engagement metrics, and festival calendars into a unified decision-support system. It implements lag analysis and counterfactual modeling to quantify the amplification effect of social media on festive revenue cycles.

## Key Objectives
- Develop a unified time-series data pipeline integrating sales and social metrics
- Compute a Social Buzz Index (SBI) to standardize engagement intensity
- Identify temporal lag between social engagement peaks and revenue peaks
- Implement counterfactual baseline estimation for true ROI isolation
- Deliver an interactive dashboard for decision support

## Technology Stack
### Backend
- Python 3
- Flask
- SQLAlchemy
- Pandas
- NumPy
- SQLite
### Frontend
- React.js
- Recharts
- Axios

## System Architecture
- Presentation Layer: React.js, Recharts, Context API
- Logic Layer: Flask backend, Analytics Engine, REST APIs
- Data Layer: SQLite, SQLAlchemy ORM, Precomputed derived metrics

## Core Analytical Modules
### Social Buzz Index (SBI)
- Weighted composite engagement metric derived from likes, shares, comments, clicks, and impressions
- Normalizes engagement intensity for comparison with revenue data
### Lag and Lead Analysis
- Implements time-shift modeling
- Identifies 3–5 day lead time between social buzz peaks and sales peaks
### Counterfactual Baseline Estimation
- Estimates baseline sales without social amplification
- Computes Net Amplification Value and Uplift Percentage

## Features
- Executive KPI summary
- Dual-axis revenue vs social buzz visualization
- Platform-wise engagement breakdown
- Cross-factor comparison analysis
- Adjustable lag slider
- Counterfactual visualization engine
- Optimized sub-350ms response time
