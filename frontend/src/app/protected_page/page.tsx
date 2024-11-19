'use client'; 

import React, { useEffect, useState } from 'react';
import withAuth from '../withAuth'; 
import axios from 'axios';

const ProtectedPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const API_URL = 'http://localhost:8000'; 

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_URL}/protected`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(response.data.message);
      } catch (error) {
        alert('Session expired. Please log in again.');
      }
    };

    fetchProtectedData();
  }, []);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>{message}</p>
    </div>
  );
};

export default withAuth(ProtectedPage);