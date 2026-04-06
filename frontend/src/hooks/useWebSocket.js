/**
 * Custom Hook: useWebSocket
 * Manages WebSocket connection to backend and real-time network state updates
 */

import { useEffect, useReducer, useCallback, useRef } from 'react';

const initialState = {
  nodes: [],
  edges: [],
  activePackets: [],
  healingInProgress: false,
  predictions: [],
  connected: false,
  error: null,
  networkState: null
};

const networkReducer = (state, action) => {
  switch (action.type) {
    case 'NETWORK_STATE_UPDATE':
      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
        activePackets: action.payload.activePackets,
        healingInProgress: action.payload.healingInProgress,
        predictions: action.payload.predictions,
        networkState: action.payload.networkState || {}
      };
    case 'CONNECTION_ESTABLISHED':
      return { ...state, connected: true, error: null };
    case 'CONNECTION_CLOSED':
      return { ...state, connected: false };
    case 'CONNECTION_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const useWebSocket = (url = 'ws://localhost:5000') => {
  const [state, dispatch] = useReducer(networkReducer, initialState);
  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const sendCommand = useCallback((command) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(command));
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('✓ WebSocket connected');
        dispatch({ type: 'CONNECTION_ESTABLISHED' });
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'network-state') {
            dispatch({
              type: 'NETWORK_STATE_UPDATE',
              payload: {
                nodes: data.nodes,
                edges: data.edges,
                activePackets: data.activePackets,
                healingInProgress: data.healingInProgress,
                predictions: data.predictions,
                networkState: {
                  dijkstraState: data.dijkstraState || {}
                }
              }
            });
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('⚠️  WebSocket disconnected');
        dispatch({ type: 'CONNECTION_CLOSED' });

        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          setTimeout(() => connect(), delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        dispatch({ type: 'CONNECTION_ERROR', payload: error });
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      dispatch({ type: 'CONNECTION_ERROR', payload: error });
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    ...state,
    sendCommand,
    connect,
    disconnect
  };
};

export default useWebSocket;
