import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { dataService } from '../../api/dataService';
import { formatDate, formatCurrency, formatPercent } from '../../utils/formatters';
import { ZapOff, Info } from 'lucide-react';

const CounterfactualView = () => {
  const { filters } = useDashboard();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounterfactual = async () => {
      setLoading(true);
      try {
        const result = await dataService.getCounterfactual({
          start_date: filters.startDate,
          end_date: filters.endDate
        });
        setData(result);
      } catch (error) {
        console.error("Error fetching counterfactual data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounterfactual();
  }, [filters.startDate, filters.endDate]);

  if (loading || !data) {
    return (
      <div className="card">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>
              <ZapOff size={18} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'text-bottom' }} />
              Counterfactual Analysis
            </h2>
            <p>Simulated "What-If" scenario: Sales without Social Amplification</p>
          </div>
          <div className="badge badge-blue">
            <Info size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            AI Estimated Baseline
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#fff7ed', borderRadius: '0.5rem', border: '1px solid #ffedd5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9a3412', textTransform: 'uppercase' }}>
              Social Amplification Value
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c2410c' }}>
              {formatCurrency(data.summary.net_impact_value)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#ea580c', fontWeight: 600 }}>
              +{formatPercent(data.summary.net_impact_pct)} Uplift
            </div>
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            The <strong>Baseline Sales</strong> represents the estimated revenue based on historical non-festive trends. 
            The gap between Actual and Baseline is the <strong>Social Amplification</strong> triggered by festive buzz.
          </div>
        </div>

        <div className="chart-container" style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chart_data}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 10 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                axisLine={false}
                hide
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelFormatter={formatDate}
              />
              <Legend verticalAlign="top" align="right" />
              
              <Area
                type="monotone"
                dataKey="actual_sales"
                name="Actual Revenue"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorActual)"
              />
              <Area
                type="monotone"
                dataKey="baseline_sales"
                name="Baseline (No Social)"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CounterfactualView;