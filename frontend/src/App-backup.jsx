import React, { useState } from 'react';
import { Container, Ship, Cpu, GitBranch } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BuildManager from './components/BuildManager';
import AIPatchInterface from './components/AIPatchInterface';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Container },
    { id: 'builds', label: 'Build Manager', icon: GitBranch },
    { id: 'ai', label: 'AI Patches', icon: Cpu },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'builds':
        return <BuildManager />;
      case 'ai':
        return <AIPatchInterface />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>
            <Ship size={32} />
            Self-Healing Docker Builds
          </h1>
        </div>
      </header>

      <div className="container main-content">
        <div className="tabs">
          <div className="tab-list">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default App;