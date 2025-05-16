import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="logo-container">
        <img src={process.env.PUBLIC_URL + "/assets/6logo.png"} alt="6toLearn Logo" className="logo" />
        <h1 className="title">6toLearn</h1>
      </div>
      <div className="button-container">
        <Link to="/login" className="button login-button">
          Giriş Yap
        </Link>
        <Link to="/register" className="button register-button">
          Kayıt Ol
        </Link>
      </div>
      <div className="about-section">
        <h3>Hakkında</h3>
        <p>6toLearn, İngilizce kelime öğrenimini kolaylaştıran kişisel bir quiz uygulamasıdır. Kendi kelimelerinizi ekleyin, tekrarlarla kalıcı öğrenin ve gelişiminizi takip edin.</p>
      </div>
    </div>
  );
};

export default Home; 