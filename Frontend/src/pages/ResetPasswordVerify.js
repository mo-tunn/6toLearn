import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import MenuButton from '../components/MenuButton';
import '../styles/Auth.css';

const ResetPasswordVerify = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code, newPassword }),
            });
            if (response.ok) {
                setNotification({
                    message: 'Şifreniz başarıyla sıfırlandı! Giriş sayfasına yönlendiriliyorsunuz...',
                    type: 'success',
                });
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.message || 'Şifre sıfırlama başarısız.');
            }
        } catch (err) {
            setError('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <MenuButton to="/" />
                <h2>Şifre Sıfırlama</h2>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Kod</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            placeholder="E-posta ile gelen kodu girin"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Yeni Şifre</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Yeni şifrenizi girin"
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Sıfırlanıyor...' : 'Şifreyi Sıfırla'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordVerify; 