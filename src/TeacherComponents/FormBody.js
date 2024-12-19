import {React, useEffect, useState} from 'react';

const FormBody = ({ formData, handleChange, isEditMode, 
  handleCancel }) => {
    const[faculty, setFaculty] = useState([]);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
      const fetchFaculty = async () => {
        try {
          const response = await fetch('https://localhost:7113/api/Faculty');
          const data = await response.json();
          setFaculty(data); 
        } catch (error) {
          console.error('Error fetching Faculty:', error);
        }
      };
      fetchFaculty();
    }, []);

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td><label htmlFor="firstName">First Name: </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            /></td>

            <td><label htmlFor="lastName">Last Name: </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            /></td>
          </tr>
          <tr>
            <td><label htmlFor="address">Address: </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            </td>
            <td><label htmlFor="dateOfBirth">Date of Birth: </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={today}
              required
            /></td>
          </tr>
          <tr>
            <td><label htmlFor="gender">Gender: </label><br/>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Gender:</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select></td>
          
            <td><label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            /></td>
          </tr>
          <tr>
            <td><label htmlFor="contact">Contact Number: </label><input
              type="text"
              name="contact"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              maxLength="10"
            /></td>
         
            <td><label htmlFor="faculty">Teaching Faculty: </label><select
              name="facultyId"
              id="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Faculty</option>
                {faculty.map(program=> (
                  <option key={program.id} value={program.id}>
                    {program.facultyName}
                  </option>
                ))}
                
            </select></td>
          </tr>
          <tr>
           
            <td><label>Teaching Semester:</label><br/>
            <select name="semester" id="semesterid"
            value={formData.semester}
            onChange={handleChange}
            required
            >
              <option value="" disabled>Select Semester</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
              <option value="5">5th Semester</option>
              <option value="6">6th Semester</option>
              <option value="7">7th Semester</option>
              <option value="8">8th Semester</option>
              
            </select>

            </td>
          </tr>
          </tbody>
         </table>
            
        <button className="submitBtn" type="submit">{isEditMode ? 'Update' : 'Register'}</button>
        {isEditMode &&
            <button className="cancelBtn" type="button" onClick={handleCancel}>Cancel</button>
          }
          
    </>
  )
};

export default FormBody;

