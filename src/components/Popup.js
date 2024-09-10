
import React from 'react';


const Popup = ({ data, onClose }) => {
  if (!data) return null; 

  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <h2>Student Details</h2>
        <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
        <p><strong>Address:</strong> {data.address}</p>
        <p><strong>Date of Birth:</strong> {data.dateOfBirth}</p>
        <p><strong>Gender:</strong> {data.gender}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Contact:</strong> {data.contact}</p>
        <p><strong>Program:</strong> {data.program}</p>
        <p><strong>Optional Subjects:</strong></p>
        <ol>
          <li>{data.optionalSubject[0]}</li>
          <li>{data.optionalSubject[1]}</li>
          <li>{data.optionalSubject[2]}</li>
        </ol>
        <p><strong>Status: </strong>{data.status}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
