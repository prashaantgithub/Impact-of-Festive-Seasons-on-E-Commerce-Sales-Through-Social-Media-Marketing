import React, { useState, useEffect } from 'react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { dataService } from '../../api/dataService';
import { formatDate, formatCompactNumber } from '../../utils/formatters';
import { Scale } from 'lucide-react';

const ComparisonZone = () => {
  const { filters } = useDashboard();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    factorA: 'sales',
    factorB: 'social_buzz'
  });

  useEffect(() => {
    const fetchComparisonData = async () => {
      setLoading(true);
      try {
        const result = await dataService.getTimeline({
          start_date: filters.startDate,
          end_date: filters.endDate
        });
        setData(result);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [filters.startDate, filters.endDate]);

  const handleMetricChange = (e) => {
    setMetrics({ ...metrics, [e.target.name]: e.target.value });
  };

  const getMetricLabel = (m) => {
    const labels = {
      sales: 'Daily Revenue',
      social_buzz: 'Social Buzz Index',
      uplift: 'Sales Uplift %'
    };
    return labels[m] || m;
  };

  const isZoomed = data.length < 20;
  const showDots = data.length < 45;

  return (
    <div className="card">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>
            <Scale size={18} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'text-bottom' }} />
            Interactive Comparison Zone
          </h2>
          <p>Cross-examine different impact factors during the selected timeframe</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="control-group">
            <label>Factor A (Bar)</label>
            <select name="factorA" value={metrics.factorA} onChange={handleMetricChange}>
              <option value="sales">Revenue</option>
              <option value="social_buzz">Social Buzz</option>
              <option value="uplift">Uplift %</option>
            </select>
          </div>
          <div className="control-group">
            <label>Factor B (Line)</label>
            <select name="factorB" value={metrics.factorB} onChange={handleMetricChange}>
              <option value="social_buzz">Social Buzz</option>
              <option value="sales">Revenue</option>
              <option value="uplift">Uplift %</option>
            </select>
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ height: '400px', marginTop: '2rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={(val) => formatCompactNumber(val)}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelFormatter={(value) => `Date: ${formatDate(value)}`}
              />
              <Legend 
                verticalAlign="top" 
                align="center" 
                wrapperStyle={{ paddingBottom: '20px' }}
              />
              
              <Bar 
                yAxisId="left"
                dataKey={metrics.factorA} 
                name={getMetricLabel(metrics.factorA)} 
                fill="#94a3b8" 
                radius={[4, 4, 0, 0]}
                barSize={isZoomed ? 40 : undefined}
                opacity={0.7}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey={metrics.factorB} 
                name={getMetricLabel(metrics.factorB)} 
                stroke="#2563eb" 
                strokeWidth={2.5}
                dot={showDots ? { r: 3, fill: '#2563eb', strokeWidth: 0 } : false}
                activeDot={{ r: 5, strokeWidth: 0 }}
                animationDuration={1000}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px dashed #cbd5e1' }}>
        <p style={{ fontSize: '0.875rem', color: '#475569' }}>
          <strong>Analytical Insight:</strong> The chart compares <strong>{getMetricLabel(metrics.factorA)}</strong> against <strong>{getMetricLabel(metrics.factorB)}</strong>. 
          Observe how peaks in Factor B often precede or coincide with surges in Factor A, particularly during festival windows.
        </p>
      </div>
    </div>
  );
};

export default ComparisonZone;