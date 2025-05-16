import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/AnaMenu.css';
import { useAuth } from '../components/AuthContext';
import HelpButton from '../components/HelpButton';

const AnaMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (location.state && location.state.info) {
      setToast(location.state.info);
      // 3 saniye sonra bildirimi kaldır
      const timer = setTimeout(() => setToast(null), 3000);
      // Bildirim gösterildikten sonra location.state'i temizle
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <>
      <div className="ana-menu-container">
        <HelpButton />
        <button 
          className="user-info-bar"
          onClick={() => navigate('/dashboard')}
        >
          <i className="fas fa-user"></i>
          <span>👨🏻‍💻 {auth?.username}</span>
        </button>
        <img src="/assets/6logo.png" alt="Logo" className="ana-menu-logo" />
        <div className="ana-menu-main-title">6toLearn</div>
        <h1>Ana Menü</h1>
        {toast && (
          <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: '#d4edda', color: '#155724', padding: '12px 20px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #c3e6cb', minWidth: 200, textAlign: 'center', fontWeight: 500 }}>
            {toast}
          </div>
        )}
        <p>Hoş geldiniz! Hangi işlemi yapmak istersiniz?</p>
        <div className="menu-btn-group">
          <button onClick={() => navigate('/')} className="menu-btn logout">
            Çıkış Yap
          </button>
          <button onClick={() => navigate("/kelime-ekle") } className="menu-btn">
            Kelime Ekle
          </button>
          <button onClick={() => navigate("/quiz") } className="menu-btn">
            Quiz OL!
          </button>
          <button onClick={() => navigate("/wordle") } className="menu-btn">
            Wordle
          </button>
          <button onClick={() => navigate("/ai-learning") } className="menu-btn">
            Yapay Zekayla Öğren!
          </button>
          <button onClick={() => navigate("/kelimelerim-ve-analiz") } className="menu-btn">
            Kelimelerim ve Analiz
          </button>
        </div>
        <div className="ana-menu-subtitle">6toLearn - Kelime Öğrenme Sistemi</div>
      </div>
    </>
  );
};

export default AnaMenu; 