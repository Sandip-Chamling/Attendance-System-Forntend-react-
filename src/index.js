import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import StudentRegistration from './StudentRegistration';
import TeacherRegistration from './TeacherRegistration';
import Attendance from './Attendance';
import Individual from './ReportComponents/Individual';
import Range from './ReportComponents/Range';
import Section from './ReportComponents/Section';
import Recommendation from './Recommendation';
//import Login from './Login';
import Header from './Header';
import Footer from './Footer';
import {AuthProvider } from './AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>   
    <Router>
    <AuthProvider>
      <Header />
      <div>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path="/teacher" element={<TeacherRegistration />} />
          <Route path="/student" element={<StudentRegistration />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/class" element={<Section />} />
          <Route path="/individual" element={<Individual />} />
          <Route path="/range" element={<Range />} />
          <Route path="/recommendation" element={<Recommendation/>}/>
        </Routes>
      </div>
      <Footer/>
      </AuthProvider>
    </Router>
  
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


