import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Notification from '../components/Notification';
import MenuButton from '../components/MenuButton';
import '../styles/Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const emailRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (passwordRef.current) passwordRef.current.focus();
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email
        }),
      });

      if (response.ok) {
        setNotification({
          message: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...',
          type: 'success'
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Kayıt işlemi başarısız oldu.');
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
        <h2>Kayıt Ol</h2>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleRegister}>
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
            <label>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="E-posta adresinizi girin"
              ref={emailRef}
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
          <div className={`form-group${shake ? ' shake' : ''}`}>
            <label>Şifre Tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Şifrenizi tekrar girin"
              ref={confirmPasswordRef}
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="auth-links">
          <div>
            Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 