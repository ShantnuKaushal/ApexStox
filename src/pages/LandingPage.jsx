import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Footer   from '../components/Footer';
import '../styles/landing.css';

import img1 from '../assets/img1.svg';
import img2 from '../assets/img2.svg';
import img3 from '../assets/img3.svg';
import img4 from '../assets/img4.svg';
import img5 from '../assets/img5.svg';

const images = [img1, img2, img3, img4, img5];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <div className="landing__carousel">
        <Carousel images={images} interval={3000} />
      </div>
      <div className="landing__cta">
        <h1 className="landing__title">Welcome to ApexStox</h1>
        <p className="landing__subtitle">
          The Top 15 Stocks In Real Time All In One Place
        </p>
        <button
          className="landing__button"
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>

        {/* Footer moved inside the CTA, now centered */}
        <Footer className="footer--landing" />
      </div>
    </div>
  );
}
