import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AnaMenu from './pages/AnaMenu';
import KelimeEkle from './pages/KelimeEkle';
import Quiz from './pages/Quiz';
import Wordle from './pages/Wordle';
import KelimelerimVeAnaliz from './pages/KelimelerimVeAnaliz';
import KonuAnalizRaporu from './pages/KonuAnalizRaporu';
import AILearningPage from './pages/AILearningPage';
import Dashboard from './pages/Dashboard';
import ResetPasswordVerify from './pages/ResetPasswordVerify';
import './App.css';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/ana-menu" element={<PrivateRoute><AnaMenu /></PrivateRoute>} />
            <Route path="/kelime-ekle" element={<PrivateRoute><KelimeEkle /></PrivateRoute>} />
            <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
            <Route path="/wordle" element={<PrivateRoute><Wordle /></PrivateRoute>} />
            <Route path="/kelimelerim-ve-analiz" element={<PrivateRoute><KelimelerimVeAnaliz /></PrivateRoute>} />
            <Route path="/konu-analiz-raporu" element={<PrivateRoute><KonuAnalizRaporu /></PrivateRoute>} />
            <Route path="/ai-learning" element={<PrivateRoute><AILearningPage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/reset-password/verify" element={<ResetPasswordVerify />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
