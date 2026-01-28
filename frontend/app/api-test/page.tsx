'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [status, setStatus] = useState('Testing API connection...');
  const [token, setToken] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<number | null>(null);

  useEffect(() => {
    // Check if we have a token
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
    
    if (storedToken) {
      setStatus(`Token found: ${storedToken.substring(0, 30)}...`);
    } else {
      setStatus('No token found. Please sign in first.');
    }
  }, []);

  const testApiCall = async () => {
    setStatus('Testing API call...');
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '', // Include token if available
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus(`API test successful! Retrieved ${data.length} tasks.`);
      } else {
        setStatus(`API test failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus(`API test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const createTestTask = async () => {
    if (!token) {
      setStatus('Cannot create task: No authentication token found');
      return;
    }

    setStatus('Creating test task...');
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Test Task',
          description: 'This is a test task created for verification',
          priority: 'medium'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setTaskId(data.id);
        setStatus(`Test task created successfully! ID: ${data.id}`);
      } else {
        setStatus(`Failed to create task: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus(`Error creating task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
        
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Token Present:</strong> {token ? 'Yes' : 'No'}</p>
          {taskId && <p><strong>Last Task ID:</strong> {taskId}</p>}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testApiCall}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test API Connection
          </button>
          
          <button
            onClick={createTestTask}
            disabled={!token}
            className={`px-4 py-2 rounded ${
              token 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Test Task
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Instructions:</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Sign in to your account first</li>
            <li>Return to this page after signing in</li>
            <li>Click "Test API Connection" to verify the API is working</li>
            <li>Click "Create Test Task" to create a sample task</li>
          </ol>
        </div>
      </div>
    </div>
  );
}