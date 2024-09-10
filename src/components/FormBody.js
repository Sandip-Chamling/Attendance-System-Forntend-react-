import React from 'react';
import OptionalSubjects from './OptionalSubject';

const FormBody = ({ formData, handleChange, isEditMode, 
  handleCancel, selectedSubjects, setSelectedSubjects }) => {

    const today = new Date().toISOString().split('T')[0];

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
         
            <td><label htmlFor="program">Program: </label><select
              name="program"
              id="program"
              value={formData.program}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Program</option>
              <option value="Bachelor Of Computer Application">Bachelor Of Computer Application</option>
              <option value="Bachelor in Business Studies">Bachelor in Business Studies</option>
              <option value="Bachelor in Business Management">Bachelor in Business Management</option>
              <option value="Bachelor in Arts">Bachelor in Arts</option>
              <option value="Bachelor in Business Administration">Bachelor in Business Administration</option>
            </select></td>
          </tr>
          </tbody>
         </table>
            <OptionalSubjects
            program={formData.program}
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
                />
        <button className="submitBtn" type="submit">{isEditMode ? 'Update' : 'Register'}</button>
        {isEditMode &&
            <button className="cancelBtn" type="button" onClick={handleCancel}>Cancel</button>
          }
    </>
  )
};

export default FormBody;
