import { useState, useEffect, useRef } from 'react';
import { buildsAPI } from '../services/api';

export function usePolling(callback, delay = 5000, enabled = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    function tick() {
      savedCallback.current();
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, enabled]);
}

export function useBuildStatus(buildId, autoRefresh = true) {
  const [buildStatus, setBuildStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    if (!buildId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await buildsAPI.getBuild(buildId);
      setBuildStatus(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const refreshStatus = () => {
    fetchStatus();
  };

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [buildId]);

  // Auto-refresh for non-terminal statuses
  const shouldPoll = buildStatus && 
    ['pending', 'running', 'deploying'].includes(buildStatus.status) && 
    autoRefresh;

  usePolling(fetchStatus, 3000, shouldPoll);

  return {
    buildStatus,
    loading,
    error,
    refreshStatus
  };
}

export function useBuildList(autoRefresh = true) {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBuilds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await buildsAPI.listBuilds();
      setBuilds(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Failed to fetch builds:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const refreshBuilds = () => {
    fetchBuilds();
  };

  // Initial fetch
  useEffect(() => {
    fetchBuilds();
  }, []);

  // Auto-refresh if there are running builds
  const hasRunningBuilds = builds.some(build => 
    ['pending', 'running', 'deploying'].includes(build.status)
  ) && autoRefresh;

  usePolling(fetchBuilds, 10000, hasRunningBuilds);

  return {
    builds,
    loading,
    error,
    refreshBuilds
  };
}

export function useWebSocket(url, onMessage) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url, onMessage]);

  const sendMessage = (message) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message));
    }
  };

  return { socket, connected, sendMessage };
}