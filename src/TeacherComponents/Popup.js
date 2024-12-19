
import React from 'react';


const Popup = ({ data, onClose }) => {
  if (!data) return null; 

  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <h2>Teacher Details</h2>
        <p><strong>Name:</strong>  {data.firstName} {data.lastName}</p>
        <p><strong>Address:</strong>  {data.address}</p>
        <p><strong>Date of Birth:</strong>  {data.dateOfBirth}</p>
        <p><strong>Gender:</strong>  {data.gender}</p>
        <p><strong>Email:</strong>  {data.email}</p>
        <p><strong>Contact:</strong>  {data.contact}</p>
        <p><strong>Faculty:</strong>  {data.facultyName}</p>
        <p><strong>Semester:</strong> {data.semester === 1 ? `${data.semester}st Semester` :
          data.semester === 2 ? `${data.semester}nd Semester` :
          data.semester === 3 ? `${data.semester}rd Semester` :
         `${data.semester}th Semester`}
        </p>
     
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
