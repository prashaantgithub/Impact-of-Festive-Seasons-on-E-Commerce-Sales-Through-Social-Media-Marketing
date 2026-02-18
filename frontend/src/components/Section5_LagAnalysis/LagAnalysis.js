import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend
} from 'recharts';
import { dataService } from '../../api/dataService';
import { formatDate, formatCompactNumber } from '../../utils/formatters';
import { History } from 'lucide-react';

const LagAnalysis = () => {
  const [data, setData] = useState([]);
  const [lag, setLag] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLagData = async () => {
      setLoading(true);
      try {
        const result = await dataService.getLagAnalysis(lag);
        setData(result);
      } catch (error) {
        console.error("Error fetching lag analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLagData();
  }, [lag]);

  return (
    <div className="card">
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>
              <History size={18} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'text-bottom' }} />
              Lag & Lead Analysis
            </h2>
            <p>How many days before sales do social campaigns peak?</p>
          </div>
          <div className="control-group">
            <label>Campaign Lead Lag: {lag} Days</label>
            <input 
              type="range" 
              min="1" 
              max="7" 
              value={lag} 
              onChange={(e) => setLag(parseInt(e.target.value))}
              style={{ width: '100px' }}
            />
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ height: '300px' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 10 }}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={(val) => `₹${formatCompactNumber(val)}`}
                tick={{ fontSize: 10 }}
                axisLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 10 }}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelFormatter={formatDate}
              />
              <Legend verticalAlign="top" height={36}/>
              
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="total_revenue" 
                name="Actual Sales" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="shifted_buzz" 
                name={`Social Buzz (Shifted ${lag}d)`} 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        * Higher correlation at a specific lag indicates the typical customer decision journey duration from social engagement to purchase.
      </div>
    </div>
  );
};

export default LagAnalysis;