import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Notification from '../components/Notification';
import MenuButton from '../components/MenuButton';
import '../styles/Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setNotification({
                    message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
                    type: 'success'
                });
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                const data = await response.json();
                setError(data.message || 'Şifre sıfırlama işlemi başarısız oldu.');
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } catch (err) {
            setError('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <MenuButton to="/" />
                <h2>Şifremi Unuttum</h2>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className={`form-group${shake ? ' shake' : ''}`}>
                        <label>E-posta</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="E-posta adresinizi girin"
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/login">Giriş sayfasına dön</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 