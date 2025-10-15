import React, { useState } from 'react';
import { Play, Package, Eye } from 'lucide-react';
import { buildsAPI } from '../services/api';

function BuildManager() {
  const [activeSection, setActiveSection] = useState('start');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Start Build Form State
  const [buildForm, setBuildForm] = useState({
    repo_url: '',
    branch: 'main',
    dockerfile_path: 'Dockerfile',
    image_name: '',
    use_github_actions: false
  });



  // Build Status Check State
  const [buildId, setBuildId] = useState('');
  const [buildStatus, setBuildStatus] = useState(null);

  const handleStartBuild = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await buildsAPI.startBuild(buildForm);
      setMessage({ 
        type: 'success', 
        content: `Build started successfully! Build ID: ${response.data.id}` 
      });
      // Reset form
      setBuildForm({
        repo_url: '',
        branch: 'main',
        dockerfile_path: 'Dockerfile',
        image_name: '',
        use_github_actions: false
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: `Failed to start build: ${error.response?.data?.detail || error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };



  const checkBuildStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });
    setBuildStatus(null);

    try {
      const response = await buildsAPI.getBuild(buildId);
      setBuildStatus(response.data);
      setMessage({ type: 'success', content: 'Build status retrieved successfully' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: `Failed to get build status: ${error.response?.data?.detail || error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFix = async (buildIdToFix) => {
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await buildsAPI.autoFix(buildIdToFix);
      setMessage({ 
        type: 'success', 
        content: `Auto-fix process started for build ${buildIdToFix}. The system will analyze errors, generate patches, and create a PR if successful.` 
      });
      // Update the build status to show "fixing"
      if (buildStatus && buildStatus.id === buildIdToFix) {
        setBuildStatus({ ...buildStatus, status: 'fixing' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: `Failed to start auto-fix: ${error.response?.data?.detail || error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'start', label: 'Start Build', icon: Play },
    { id: 'status', label: 'Check Status', icon: Eye },
  ];

  return (
    <div>
      <div className="card">
        <h2>Build Manager</h2>
        
        {/* Section Navigation */}
        <div className="tabs" style={{ marginBottom: '1.5rem' }}>
          <div className="tab-list">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  className={`tab-button ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <IconComponent size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Display */}
        {message.content && (
          <div className={message.type === 'error' ? 'error-message' : 'card'} 
               style={{ 
                 backgroundColor: message.type === 'success' ? '#dcfce7' : undefined,
                 color: message.type === 'success' ? '#16a34a' : undefined,
                 marginBottom: '1rem'
               }}>
            {message.content}
          </div>
        )}

        {/* Start Build Section */}
        {activeSection === 'start' && (
          <form onSubmit={handleStartBuild}>
            <div className="form-group">
              <label className="form-label">Repository URL *</label>
              <input
                type="url"
                className="form-input"
                value={buildForm.repo_url}
                onChange={(e) => setBuildForm({...buildForm, repo_url: e.target.value})}
                placeholder="https://github.com/username/repository"
                required
              />
            </div>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  className="form-input"
                  value={buildForm.branch}
                  onChange={(e) => setBuildForm({...buildForm, branch: e.target.value})}
                  placeholder="main"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Dockerfile Path</label>
                <input
                  type="text"
                  className="form-input"
                  value={buildForm.dockerfile_path}
                  onChange={(e) => setBuildForm({...buildForm, dockerfile_path: e.target.value})}
                  placeholder="Dockerfile"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Image Name (optional)</label>
              <input
                type="text"
                className="form-input"
                value={buildForm.image_name}
                onChange={(e) => setBuildForm({...buildForm, image_name: e.target.value})}
                placeholder="my-app:latest"
              />
            </div>
            
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={buildForm.use_github_actions}
                  onChange={(e) => setBuildForm({...buildForm, use_github_actions: e.target.checked})}
                />
                Use GitHub Actions
              </label>
            </div>
            
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? <div className="spinner" /> : <Play size={16} />}
              Start Build
            </button>
          </form>
        )}

        {/* Check Status Section */}
        {activeSection === 'status' && (
          <div>
            <form onSubmit={checkBuildStatus} style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Build ID</label>
                <input
                  type="number"
                  className="form-input"
                  value={buildId}
                  onChange={(e) => setBuildId(e.target.value)}
                  placeholder="Enter build ID"
                  required
                />
              </div>
              
              <button type="submit" className="button button-primary" disabled={loading}>
                {loading ? <div className="spinner" /> : <Eye size={16} />}
                Check Status
              </button>
            </form>

            {buildStatus && (
              <div className="card" style={{ backgroundColor: '#f8fafc' }}>
                <h3>Build Status</h3>
                <div style={{ marginTop: '1rem' }}>
                  <p><strong>ID:</strong> {buildStatus.id}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge status-${buildStatus.status}`} style={{ marginLeft: '0.5rem' }}>
                      {buildStatus.status}
                    </span>
                  </p>
                  {buildStatus.last_error && (
                    <div className="error-message" style={{ marginTop: '0.5rem' }}>
                      <strong>Last Error:</strong> {buildStatus.last_error}
                    </div>
                  )}
                  {buildStatus.pr_number && (
                    <p><strong>PR Number:</strong> {buildStatus.pr_number}</p>
                  )}
                  
                  {/* Auto-Fix Button for Failed Builds */}
                  {buildStatus.status === 'failed' && (
                    <div style={{ marginTop: '1rem' }}>
                      <button 
                        onClick={() => handleAutoFix(buildStatus.id)}
                        className="button button-secondary"
                        disabled={loading}
                        style={{ 
                          backgroundColor: '#f59e0b', 
                          color: 'white',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {loading ? <div className="spinner" /> : <Package size={16} />}
                        🤖 Auto-Fix Build
                      </button>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280', 
                        marginTop: '0.5rem' 
                      }}>
                        AI will analyze errors, generate patches, and create a pull request if successful.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}

export default BuildManager;