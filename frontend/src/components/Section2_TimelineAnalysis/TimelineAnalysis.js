import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceArea 
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { dataService } from '../../api/dataService';
import { formatDate, formatCurrency, formatNumber } from '../../utils/formatters';

const TimelineAnalysis = () => {
  const { filters, festivals } = useDashboard();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const result = await dataService.getTimeline({
          start_date: filters.startDate,
          end_date: filters.endDate
        });
        setData(result);
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [filters.startDate, filters.endDate]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-custom">
          <p style={{ fontWeight: 700, marginBottom: '5px' }}>{formatDate(label)}</p>
          <p style={{ color: '#2563eb' }}>Sales: {formatCurrency(payload[0].value)}</p>
          <p style={{ color: '#10b981' }}>Social Buzz Index: {payload[1].value}</p>
          {payload[0].payload.uplift > 0 && (
            <p style={{ color: '#f59e0b', fontSize: '11px', marginTop: '4px' }}>
              Uplift: +{payload[0].payload.uplift.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const showDots = data.length < 45;

  return (
    <div className="card" style={{ gridColumn: 'span 2' }}>
      <div className="section-header">
        <h2>Festive Timeline Analysis</h2>
        <p>Correlation between Social Media Buzz and Daily Revenue spikes</p>
      </div>

      <div className="chart-container" style={{ height: '400px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBuzz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => `₹${formatNumber(value/1000)}k`}
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
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{ paddingBottom: '10px' }}/>
              
              {festivals.map((fest) => (
                <ReferenceArea
                  key={fest.id}
                  x1={fest.start_date}
                  x2={fest.end_date}
                  yAxisId="left"
                  strokeOpacity={0.3}
                  fill="#f8fafc"
                />
              ))}

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                name="Revenue"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSales)"
                dot={showDots ? { r: 2, fill: '#2563eb', strokeWidth: 0 } : false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                animationDuration={1000}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="social_buzz"
                name="Social Buzz Index"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBuzz)"
                dot={showDots ? { r: 2, fill: '#10b981', strokeWidth: 0 } : false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TimelineAnalysis;