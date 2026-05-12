import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import UserOptions from '../components/UserOptions';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <UserOptions />
      <Footer />
    </div>
  );
};

export default HomePage;