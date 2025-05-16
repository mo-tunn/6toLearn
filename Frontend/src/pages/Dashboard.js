import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import MenuButton from '../components/MenuButton';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth, getAuthHeader } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': authHeader
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      const data = await response.json();
      setUserInfo(data);
      setEmail(data.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      const authHeader = getAuthHeader();
      const response = await fetch('http://localhost:8080/api/auth/update-email', {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('E-posta güncellenemedi');
      }

      setSuccess('E-posta başarıyla güncellendi');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      const authHeader = getAuthHeader();
      const response = await fetch('http://localhost:8080/api/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        }
      });

      if (!response.ok) {
        throw new Error('Doğrulama kodu gönderilemedi');
      }

      setSuccess('Doğrulama kodu e-posta adresinize gönderildi');
      setShowVerificationInput(true);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const authHeader = getAuthHeader();
      const response = await fetch('http://localhost:8080/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      });

      if (!response.ok) {
        throw new Error('E-posta doğrulanamadı');
      }

      setSuccess('E-posta başarıyla doğrulandı');
      setShowVerificationInput(false);
      setVerificationCode('');
      fetchUserInfo(); // Kullanıcı bilgilerini yenile
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }

    try {
      const authHeader = getAuthHeader();
      const response = await fetch('http://localhost:8080/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Şifre güncellenemedi');
      }

      setSuccess('Şifre başarıyla güncellendi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <div className="dashboard-container">Yükleniyor...</div>;
  if (!userInfo) return <div className="dashboard-container">Kullanıcı bilgileri bulunamadı</div>;

  return (
    <div className="dashboard-container">
      <MenuButton />
      <div className="dashboard-content">
        <h1>Kullanıcı Bilgileri</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="dashboard-section">
          <h2>Profil Bilgileri</h2>
          <div className="info-item">
            <span className="label">Kullanıcı Adı:</span>
            <span className="value">{userInfo.username}</span>
          </div>
          <div className="info-item">
            <span className="label">E-posta:</span>
            <span className="value">{userInfo.email}</span>
            <span className={`verification-status ${userInfo.emailVerified ? 'verified' : 'unverified'}`}>
              {userInfo.emailVerified ? '✓ Doğrulanmış' : '✗ Doğrulanmamış'}
            </span>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>E-posta Güncelle</h2>
          <form onSubmit={handleEmailUpdate} className="update-form">
            <div className="form-group">
              <label>E-posta:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="update-button">E-postayı Güncelle</button>
          </form>
        </div>

        {!userInfo.emailVerified && (
          <div className="dashboard-section">
            <h2>E-posta Doğrulama</h2>
            {!showVerificationInput ? (
              <button onClick={handleSendVerificationCode} className="update-button">
                Doğrulama Kodu Gönder
              </button>
            ) : (
              <form onSubmit={handleVerifyEmail} className="update-form">
                <div className="form-group">
                  <label>Doğrulama Kodu:</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="E-posta adresinize gönderilen 6 haneli kodu girin"
                    required
                  />
                </div>
                <button type="submit" className="update-button">E-postayı Doğrula</button>
              </form>
            )}
          </div>
        )}

        <div className="dashboard-section">
          <h2>Şifre Değiştir</h2>
          <form onSubmit={handlePasswordUpdate} className="update-form">
            <div className="form-group">
              <label>Mevcut Şifre:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Yeni Şifre:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Yeni Şifre (Tekrar):</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="update-button">Şifreyi Güncelle</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 