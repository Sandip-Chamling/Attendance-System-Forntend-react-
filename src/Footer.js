import { useContext } from 'react';
import React from 'react';
import { AuthContext } from './AuthContext';

const Footer = () => {
  const {user} = useContext(AuthContext);
  if(!user){
    return null;
  }
  return (
    <footer className="footer">
      <p>&copy; 2025 Mega College Attendance System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
