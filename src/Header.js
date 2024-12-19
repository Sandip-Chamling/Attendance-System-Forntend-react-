import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from './AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext); 
    const navigate = useNavigate(); 

    const onLogout = () => {
        Swal.fire({
            title: "Are you sure you want to Logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Logout"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Logout!",
                text: "You have been logged out.",
                icon: "success"
              });
              logout();
              navigate('/'); 
            }
          });
    };

    if (!user) return null;
    else if(user.role==="student"){
        return (
            <nav className="navbar">
                <div className="logo-container">
                    <img src="/image/MegaLogo.png" alt="Logo" className="logo" />
                    <h1 className="test">Mega College Attendance System</h1>
                </div>
    
                <ul className="navUl">
                    
                    <li className="dropdown">
                        <NavLink to="#" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                            Report
                        </NavLink>
                        <ul className="dropdown-content">
                            <li>
                                <NavLink to="/class" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                    Class
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/individual" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                    Individual
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/range" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                    From-To
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <button onClick={onLogout} className="logoutBtn">Logout</button>
                    </li>
                </ul>
            </nav>
        );
    }
        else if(user.role==="teacher"){
        return (
            <nav className="navbar">
                <div className="logo-container">
                    <img src="/image/MegaLogo.png" alt="Logo" className="logo" />
                    <h1 className="test">Mega College Attendance System</h1>
                </div>
    
                <ul className="navUl">
    
                    <li>
                        <NavLink to="/attendance" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                            Attendance
                        </NavLink>
                    </li>
                    <li className="dropdown">
                        <NavLink to="#" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                            Report
                        </NavLink>
                        <ul className="dropdown-content">
                            <li>
                                <NavLink to="/class" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                    Class
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/individual" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                    Individual
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/range" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                    From-To
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <button onClick={onLogout} className="logoutBtn">Logout</button>
                    </li>
                </ul>
            </nav>
        );
    }
    else if(user.role ==="admin"){
    return (
        <nav className="navbar">
            <div className="logo-container">
                <img src="/image/MegaLogo.png" alt="Logo" className="logo" />
                <h1 className="test">Mega College Attendance System</h1>
            </div>

            <ul className="navUl">
                <li className="dropdown">
                    <NavLink to="#" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                        Registration
                    </NavLink>
                    <ul className="dropdown-content">
                        <li>
                            <NavLink to="/Student" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                Student Registration
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Teacher" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                Teacher Registration
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <NavLink to="/attendance" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                        Attendance
                    </NavLink>
                </li>
                <li className="dropdown">
                    <NavLink to="#" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                        Report
                    </NavLink>
                    <ul className="dropdown-content">
                        <li>
                            <NavLink to="/class" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                Class
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/individual" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                Individual
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/range" className={({ isActive }) => (isActive ? "activeLink" : "navLink")}>
                                From-To
                            </NavLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <button onClick={onLogout} className="logoutBtn">Logout</button>
                </li>
            </ul>
        </nav>
    );
    };
};

export default Header;
