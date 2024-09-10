import React from 'react';
import { BrowserRouter as Router,Routes, Route, NavLink } from 'react-router-dom';
import Registration from './Registration';
import Attendance from './Attendance';
import Report from './Report';

const App = () => {
  return (
    <>
    <Router>
    <nav>
      <ul className="navUl">
        <li>
          <NavLink to="/"
          className={({ isActive }) => isActive ? "activeLink" : "navLink"}
          >Registration</NavLink>
        </li>
        <li>
          <NavLink to="/attendance"
          className={({ isActive }) => isActive ? "activeLink" : "navLink"}
          >Attendance</NavLink>
        </li>
        <li>
          <NavLink to="/report"
          className={({ isActive }) => isActive ? "activeLink" : "navLink"}
          > Report </NavLink>
        </li>
      </ul>
    </nav>
    <div>
    <Routes>
      <Route exact path="/" element={<Registration/>} />
      <Route exact path="/attendance" element={<Attendance />} />
      <Route exact path="/report" element={<Report />} />
    </Routes>
    </div>
  </Router>
  </>
);
}
export default App;
