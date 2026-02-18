import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import GlobalControlBar from './components/Section0_GlobalControls/GlobalControlBar';
import ExecutiveSummary from './components/Section1_ExecutiveSummary/ExecutiveSummary';
import TimelineAnalysis from './components/Section2_TimelineAnalysis/TimelineAnalysis';
import SocialInfluence from './components/Section3_SocialInfluence/SocialInfluence';
import ComparisonZone from './components/Section4_ComparisonZone/ComparisonZone';
import LagAnalysis from './components/Section5_LagAnalysis/LagAnalysis';
import CounterfactualView from './components/Section6_Counterfactual/CounterfactualView';
import './App.css';

const DashboardContent = () => {
  const { isSeeding } = useDashboard();

  if (isSeeding) {
    return (
      <div className="loader-overlay">
        <div className="spinner"></div>
        <p>Generating Historical Festive Data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Festive Impact Analytics</h1>
          <p>Analyzing Social Media Interference in E-Commerce Sales Cycles</p>
        </div>
      </header>

      <GlobalControlBar />

      <section id="executive-summary">
        <ExecutiveSummary />
      </section>

      <div className="grid-section">
        <section id="timeline-analysis">
          <TimelineAnalysis />
        </section>
        <section id="social-influence">
          <SocialInfluence />
        </section>
      </div>

      <section id="comparison-zone" style={{ marginBottom: '2rem' }}>
        <ComparisonZone />
      </section>

      <div className="grid-section">
        <section id="lag-analysis">
          <LagAnalysis />
        </section>
        <section id="counterfactual-view">
          <CounterfactualView />
        </section>
      </div>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', paddingBottom: '2rem' }}>
        <p>&copy; 2024 Decision-Support Analytics Dashboard - Social Media & Web Analytics CIA 3</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;

