import React, { useState } from 'react';
import { Cpu, Send, FileText, Code, Copy, CheckCircle } from 'lucide-react';
import { aiAPI } from '../services/api';

function AIPatchInterface() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [errorForm, setErrorForm] = useState({
    type: '',
    message: '',
    at_line: ''
  });
  const [patchProposal, setPatchProposal] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });
    setPatchProposal(null);

    try {
      const payload = {
        type: errorForm.type,
        message: errorForm.message,
        at_line: errorForm.at_line ? parseInt(errorForm.at_line) : null
      };

      const response = await aiAPI.proposePatch(payload);
      setPatchProposal(response.data);
      setMessage({ 
        type: 'success', 
        content: 'AI patch proposal generated successfully!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: `Failed to generate patch: ${error.response?.data?.detail || error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getOperationIcon = (op) => {
    switch (op) {
      case 'replace_in_file':
        return <Code size={16} />;
      case 'append_to_file':
        return <FileText size={16} />;
      case 'create_or_update_file':
        return <FileText size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getOperationDescription = (op) => {
    switch (op) {
      case 'replace_in_file':
        return 'Replace content in file';
      case 'append_to_file':
        return 'Append content to file';
      case 'create_or_update_file':
        return 'Create or update file';
      default:
        return 'File operation';
    }
  };

  return (
    <div>
      <div className="card">
        <h2>
          <Cpu size={24} />
          AI Patch Proposal
        </h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Describe a build error to get AI-generated patch suggestions for automatic fixes.
        </p>

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

        {/* Error Input Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Error Type *</label>
            <input
              type="text"
              className="form-input"
              value={errorForm.type}
              onChange={(e) => setErrorForm({...errorForm, type: e.target.value})}
              placeholder="e.g., build_error, dependency_error, syntax_error"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Error Message *</label>
            <textarea
              className="form-input form-textarea"
              value={errorForm.message}
              onChange={(e) => setErrorForm({...errorForm, message: e.target.value})}
              placeholder="Paste the full error message here..."
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Line Number (optional)</label>
            <input
              type="number"
              className="form-input"
              value={errorForm.at_line}
              onChange={(e) => setErrorForm({...errorForm, at_line: e.target.value})}
              placeholder="Line number where error occurred"
              min="1"
            />
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? <div className="spinner" /> : <Send size={16} />}
            Generate Patch Proposal
          </button>
        </form>

        {/* Patch Proposal Display */}
        {patchProposal && (
          <div className="card" style={{ backgroundColor: '#f8fafc' }}>
            <h3 style={{ marginBottom: '1rem' }}>
              <Cpu size={20} />
              Patch Proposal
            </h3>
            
            <div className="card" style={{ backgroundColor: '#dbeafe', marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Summary</h4>
              <p style={{ color: '#1e40af' }}>{patchProposal.summary}</p>
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Proposed Operations ({patchProposal.ops.length})</h4>
            
            <div className="grid">
              {patchProposal.ops.map((op, index) => (
                <div key={index} className="card" style={{ backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getOperationIcon(op.op)}
                      <strong>{getOperationDescription(op.op)}</strong>
                    </div>
                    <span className="status-badge" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                      {op.op}
                    </span>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">File Path:</label>
                    <div className="code-block" style={{ marginBottom: '0.5rem' }}>
                      {op.path}
                    </div>
                  </div>

                  {op.find && (
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="form-label">Find Text:</label>
                        <button
                          type="button"
                          className="button button-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => copyToClipboard(op.find, `find-${index}`)}
                        >
                          {copiedIndex === `find-${index}` ? <CheckCircle size={12} /> : <Copy size={12} />}
                          {copiedIndex === `find-${index}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="code-block">
                        {op.find}
                      </div>
                    </div>
                  )}

                  {op.replace && (
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="form-label">Replace With:</label>
                        <button
                          type="button"
                          className="button button-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => copyToClipboard(op.replace, `replace-${index}`)}
                        >
                          {copiedIndex === `replace-${index}` ? <CheckCircle size={12} /> : <Copy size={12} />}
                          {copiedIndex === `replace-${index}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="code-block">
                        {op.replace}
                      </div>
                    </div>
                  )}

                  {op.content && (
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="form-label">Content:</label>
                        <button
                          type="button"
                          className="button button-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => copyToClipboard(op.content, `content-${index}`)}
                        >
                          {copiedIndex === `content-${index}` ? <CheckCircle size={12} /> : <Copy size={12} />}
                          {copiedIndex === `content-${index}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="code-block">
                        {op.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Examples */}
        <div className="card" style={{ backgroundColor: '#f1f5f9', marginTop: '2rem' }}>
          <h3>Example Error Types</h3>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li><strong>build_error:</strong> Docker build failures, missing dependencies</li>
            <li><strong>syntax_error:</strong> Code syntax issues, malformed configuration</li>
            <li><strong>dependency_error:</strong> Package installation failures, version conflicts</li>
            <li><strong>security_error:</strong> Vulnerability scan failures, permission issues</li>
            <li><strong>test_error:</strong> Unit test failures, integration test issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AIPatchInterface;