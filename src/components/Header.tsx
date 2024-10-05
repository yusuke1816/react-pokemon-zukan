// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-decoration-none">
          <img 
            src={logo} 
            alt="モンスターボールのアイコン" 
            className="w-10 h-10"
          />
          ポケモン図鑑
        </Link>
      </h1>
    </header>
  );
};

export default Header;

