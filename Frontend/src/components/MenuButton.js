import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MenuButton.css';

const MenuButton = ({ to = '/ana-menu' }) => {
  const navigate = useNavigate();
  return (
    <button
      className="menu-btn-fixed"
      onClick={() => navigate(to)}
      type="button"
    >
      <i className="fas fa-arrow-left"></i>
      Ana Menüye Dön
    </button>
  );
};

export default MenuButton; 