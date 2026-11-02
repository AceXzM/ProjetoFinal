import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><Routes>
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<Navigate to="/cadastro" replace />} />
  </Routes></BrowserRouter></React.StrictMode>
);
