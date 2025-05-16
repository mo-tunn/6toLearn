import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Notification from '../components/Notification';
import MenuButton from '../components/MenuButton';
import '../styles/Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [shake, setShake] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:8080/api/words", {
        headers: { 
          'Authorization': "Basic " + btoa(username + ":" + password)
        }
      });

      if (response.ok) {
        login(username, password);
        setNotification({
          message: 'Giriş başarılı!',
          type: 'success'
        });
        setTimeout(() => {
          navigate('/ana-menu');
        }, 1000);
      } else {
        setError('Kullanıcı adı veya şifre hatalı!');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        if (usernameRef.current) usernameRef.current.focus();
      }
    } catch (err) {
      setError('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (usernameRef.current) usernameRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <MenuButton to="/" />
        <h2>Giriş Yap</h2>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className={`form-group${shake ? ' shake' : ''}`}>
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Kullanıcı adınızı girin"
              ref={usernameRef}
              disabled={loading}
            />
          </div>
          <div className={`form-group${shake ? ' shake' : ''}`}>
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Şifrenizi girin"
              ref={passwordRef}
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Şifremi Unuttum</Link>
          <div style={{ marginTop: '0.5rem' }}>
            Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 