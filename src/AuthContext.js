import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData); 
    sessionStorage.setItem('user', JSON.stringify(userData)); 
  };

  const logout = () => {
    setUser(null); 
    sessionStorage.removeItem('user'); 
  };

  const gotoLogin = () =>{
    if(!user){
      navigate('/');
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, logout,gotoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
