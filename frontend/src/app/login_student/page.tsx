'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { login } from '../api/auth'; 

const LoginStudent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.access_token);
      router.push('/protected_page');
    } catch (error) {
      alert('Incorrect username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        /><br/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginStudent;