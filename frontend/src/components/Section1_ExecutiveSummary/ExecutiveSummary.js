import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { dataService } from '../../api/dataService';
import { formatCurrency, formatNumber, formatPercent, formatCompactNumber } from '../../utils/formatters';
import { TrendingUp, Users, ShoppingCart, Share2, Target } from 'lucide-react';

const ExecutiveSummary = () => {
  const { filters } = useDashboard();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const result = await dataService.getSummary({
          start_date: filters.startDate,
          end_date: filters.endDate
        });
        setData(result);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [filters.startDate, filters.endDate]);

  if (loading || !data) {
    return (
      <div className="grid-section">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card kpi-card" style={{ height: '120px', animate: 'pulse' }}>
            <div style={{ background: '#f1f5f9', height: '100%', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid-section">
      <div className="card kpi-card">
        <div className="kpi-label">
          <ShoppingCart size={14} style={{ marginRight: '6px', display: 'inline', color: 'var(--primary)' }} />
          Total Revenue
        </div>
        <div className="kpi-value">{formatCurrency(data.total_revenue)}</div>
        <div className="kpi-trend trend-up">
          <TrendingUp size={12} style={{ marginRight: '4px', display: 'inline' }} />
          {formatNumber(data.total_orders)} Orders
        </div>
      </div>

      <div className="card kpi-card">
        <div className="kpi-label">
          <Target size={14} style={{ marginRight: '6px', display: 'inline', color: 'var(--warning)' }} />
          Avg. Sales Uplift
        </div>
        <div className="kpi-value">{formatPercent(data.avg_uplift_pct)}</div>
        <div className="kpi-trend" style={{ color: 'var(--text-muted)' }}>
          vs. Non-Festive Baseline
        </div>
      </div>

      <div className="card kpi-card">
        <div className="kpi-label">
          <Share2 size={14} style={{ marginRight: '6px', display: 'inline', color: 'var(--success)' }} />
          Social Engagement
        </div>
        <div className="kpi-value">{formatCompactNumber(data.total_engagement)}</div>
        <div className="kpi-trend trend-up">
          Total Interactions
        </div>
      </div>

      <div className="card kpi-card">
        <div className="kpi-label">
          <Users size={14} style={{ marginRight: '6px', display: 'inline', color: 'var(--primary-dark)' }} />
          Customer Acquisition
        </div>
        <div className="kpi-value">{formatPercent(data.new_vs_repeat_ratio * 100)}</div>
        <div className="kpi-trend" style={{ color: 'var(--text-muted)' }}>
          New Customer Share
        </div>
      </div>

      <div className="card kpi-card">
        <div className="kpi-label">
          <TrendingUp size={14} style={{ marginRight: '6px', display: 'inline', color: 'var(--danger)' }} />
          ROI Efficiency
        </div>
        <div className="kpi-value">
          {(data.total_revenue / (data.total_engagement || 1)).toFixed(2)}
        </div>
        <div className="kpi-trend" style={{ color: 'var(--text-muted)' }}>
          Rev per Engagement
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;