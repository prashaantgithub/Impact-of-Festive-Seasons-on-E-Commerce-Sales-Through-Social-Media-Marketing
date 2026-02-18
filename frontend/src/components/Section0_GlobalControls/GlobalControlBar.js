import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { RefreshCw, Filter, Calendar, Database } from 'lucide-react';

const GlobalControlBar = () => {
  const { festivals, filters, updateFilters, triggerSeed, isSeeding } = useDashboard();

  const handleFestivalChange = (e) => {
    updateFilters({ selectedFestivalId: e.target.value });
  };

  const handleDateChange = (e) => {
    updateFilters({ [e.target.name]: e.target.value, selectedFestivalId: 'all' });
  };

  const handleReset = () => {
    updateFilters({
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      selectedFestivalId: 'all',
      platform: 'all'
    });
  };

  return (
    <div className="control-bar">
      <div className="control-group">
        <label>
          <Filter size={12} style={{ marginRight: '4px' }} />
          Festival Focus
        </label>
        <select 
          value={filters.selectedFestivalId} 
          onChange={handleFestivalChange}
        >
          <option value="all">Full Year Overview</option>
          {festivals.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>
          <Calendar size={12} style={{ marginRight: '4px' }} />
          Date Range
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input 
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleDateChange} 
          />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input 
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleDateChange} 
          />
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
        <button 
          className="btn btn-outline" 
          onClick={handleReset}
          title="Reset to default view"
        >
          <RefreshCw size={16} style={{ marginRight: '8px', display: 'inline' }} />
          Reset
        </button>

        <button 
          className="btn btn-primary" 
          onClick={triggerSeed} 
          disabled={isSeeding}
          title="Re-generate simulation data"
        >
          <Database size={16} style={{ marginRight: '8px', display: 'inline' }} />
          {isSeeding ? 'Seeding...' : 'Initialize Data'}
        </button>
      </div>
    </div>
  );
};

export default GlobalControlBar;