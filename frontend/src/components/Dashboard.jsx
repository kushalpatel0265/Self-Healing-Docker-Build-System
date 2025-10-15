import React, { useState, useEffect } from 'react';
import { RefreshCw, Activity, CheckCircle, XCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { useBuildList } from '../hooks/useRealTime';

function Dashboard() {
  const { builds, loading, error, refreshBuilds } = useBuildList(true);
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    success: 0,
    failed: 0
  });

  useEffect(() => {    
    const newStats = builds.reduce((acc, build) => {
      acc.total++;
      
      // Map actual build statuses to dashboard categories
      switch (build.status) {
        case 'passed':
        case 'deployed':
        case 'fixed':
          acc.success++;
          break;
        case 'failed':
          acc.failed++;
          break;
        case 'building':
        case 'rebuilding':
        case 'fixing':
        case 'pending':
          acc.running++;
          break;
        default:
          acc.running++;
      }
      
      return acc;
    }, { total: 0, running: 0, success: 0, failed: 0 });
    
    setStats(newStats);
  }, [builds]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'running':
        return <Activity size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Build Dashboard
              {builds.some(b => ['pending', 'running'].includes(b.status)) ? (
                <Wifi size={16} style={{ color: '#16a34a' }} />
              ) : (
                <WifiOff size={16} style={{ color: '#64748b' }} />
              )}
            </h2>
            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                Error: {error}
              </p>
            )}
          </div>
          <button 
            className="button button-secondary" 
            onClick={refreshBuilds}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <RefreshCw size={16} />
            )}
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#f8fafc' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.total}</h3>
            <p style={{ color: '#64748b' }}>Total Builds</p>
          </div>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#dbeafe' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.running}</h3>
            <p style={{ color: '#64748b' }}>Running</p>
          </div>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#dcfce7' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>{stats.success}</h3>
            <p style={{ color: '#64748b' }}>Successful</p>
          </div>
          <div className="card" style={{ textAlign: 'center', backgroundColor: '#fee2e2' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{stats.failed}</h3>
            <p style={{ color: '#64748b' }}>Failed</p>
          </div>
        </div>

        {/* Recent Builds */}
        <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Recent Builds</h3>
        <div className="grid">
          {builds.length === 0 ? (
            <div className="loading">
              <span>No builds found</span>
            </div>
          ) : (
            builds.map(build => (
              <div key={build.id} className="build-item">
                <div className="build-meta">
                  <div>
                    <h3>Build #{build.id}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                      {build.repo_url} ({build.branch})
                    </p>
                  </div>
                  <span className={`status-badge status-${build.status}`}>
                    {getStatusIcon(build.status)}
                    {build.status}
                  </span>
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Image:</strong> {build.image_name}
                </div>
                
                <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                  Started: {formatDate(build.created_at)}
                </div>

                {build.last_error && (
                  <div className="error-message">
                    <strong>Error:</strong> {build.last_error}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;