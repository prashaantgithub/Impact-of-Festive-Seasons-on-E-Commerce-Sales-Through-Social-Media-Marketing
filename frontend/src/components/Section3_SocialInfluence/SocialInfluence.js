import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { dataService } from '../../api/dataService';
import { formatCompactNumber } from '../../utils/formatters';

const SocialInfluence = () => {
  const { filters } = useDashboard();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  useEffect(() => {
    const fetchSocialBreakdown = async () => {
      setLoading(true);
      try {
        const result = await dataService.getSocialBreakdown({
          start_date: filters.startDate,
          end_date: filters.endDate
        });
        setData(result);
      } catch (error) {
        console.error("Error fetching social breakdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialBreakdown();
  }, [filters.startDate, filters.endDate]);

  if (loading) {
    return (
      <div className="card">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="section-header">
        <h2>Social Media Influence</h2>
        <p>Performance distribution across platforms</p>
      </div>

      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
        <div className="chart-container" style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="likes"
                nameKey="platform"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatCompactNumber(value), 'Likes']}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container" style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="platform" 
                type="category" 
                tick={{ fontSize: 12, fontWeight: 600 }}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatCompactNumber(value), 'Impressions']}
              />
              <Bar dataKey="impressions" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SocialInfluence;