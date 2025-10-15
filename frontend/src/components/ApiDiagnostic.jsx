import React, { useState, useEffect } from 'react';

function ApiDiagnostic() {
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('ApiDiagnostic: Testing API call...');
        const response = await fetch('http://localhost:8003/api/v1/builds');
        console.log('ApiDiagnostic: Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('ApiDiagnostic: API data:', data);
          setApiData(data);
          
          // Test counting logic
          let stats = { total: 0, success: 0, failed: 0, running: 0 };
          data.forEach(build => {
            stats.total++;
            console.log(`ApiDiagnostic: Build ${build.id} status: ${build.status}`);
            
            if (['passed', 'deployed', 'fixed'].includes(build.status)) {
              stats.success++;
              console.log(`  -> SUCCESS count now: ${stats.success}`);
            } else if (build.status === 'failed') {
              stats.failed++;
              console.log(`  -> FAILED count now: ${stats.failed}`);
            } else {
              stats.running++;
              console.log(`  -> RUNNING count now: ${stats.running}`);
            }
          });
          
          console.log('ApiDiagnostic: Final stats:', stats);
        } else {
          setError(`API Error: ${response.status}`);
        }
      } catch (err) {
        console.error('ApiDiagnostic: Error:', err);
        setError(err.message);
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
      <h3>API Diagnostic</h3>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {apiData && (
        <div>
          <p>Builds found: {apiData.length}</p>
          <pre style={{ fontSize: '12px', backgroundColor: 'white', padding: '10px' }}>
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ApiDiagnostic;