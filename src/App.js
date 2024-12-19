import React, { useState, useContext } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from './AuthContext';
import { BiShow, BiHide } from 'react-icons/bi';

const App = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const [showIcon, setShowIcon] = useState(true);

  const handleToggle = () => {
    setType(type === 'password' ? 'text' : 'password');
    setShowIcon(!showIcon);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://localhost:7113/api/Authentication/userName=${username},password=${password}`);
      
      if (!response.ok) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Invalid Username or Password!",
          showConfirmButton: true,
        });
        return; 
      }
      
      const data = await response.json();
      
      if (data) {
        login(data);
        console.log(data);
        if (data.role === "admin") {
          navigate("/Student"); 
        } else if (data.role === "teacher") {
          navigate("/attendance");
        } else {
          navigate("/class");
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Invalid Username or Password!",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="loginMainDiv"> 
      <div className="loginDiv">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="icon"><FaUserTie /></div>
            <div className="userLogin">User Login</div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="UserName"
              required
            />
          </div>
          <div className="password-container">
            <input
              type={type}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span className="eye-icon" onClick={handleToggle}>
              {showIcon ? <BiHide /> : <BiShow />}
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default App;
