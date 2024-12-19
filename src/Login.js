// import React, { useState } from "react";

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault(); 
//     console.log('Username:', username);
//     console.log('Password:', password);
//   };

//   return (
//     <div className="loginDiv"> 
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="username">Username</label><br/>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password</label><br/>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <button type="submit">Login</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import {useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [information, setInformation] = useState('');

  const navigate = useNavigate();

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
        setInformation(data); 
        console.log(information); 
        navigate("/Student"); 
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
    
    <div className="loginMinDiv"> 
      <div className="loginDiv">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="icon"><FaUserTie /></div>
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
          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;