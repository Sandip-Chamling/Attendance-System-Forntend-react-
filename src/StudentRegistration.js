import React, { useState,useContext,useEffect } from 'react';
import Form from './StudentComponents/Form';
import NameList from './StudentComponents/NameList';
import { AuthContext } from './AuthContext';

const StudentRegistration = () => {
  const {gotoLogin} = useContext(AuthContext);
  const [editData, setEditData] = useState(null);  
  const [students, setStudents] = useState([]); 
  
  useEffect(()=>{
    gotoLogin();
  });

  const fetchStudents = async (selectedFaculty, selectedSemester) => {
    if (selectedFaculty && selectedSemester) {
      try {
        const facultyId = parseInt(selectedFaculty.trim(), 10);
        const response = await fetch(`https://localhost:7113/api/Student/facultyId=
        ${facultyId},semester=${selectedSemester}`);
        const studentsData = await response.json();
        setStudents(studentsData); 
      } catch (e) {
        console.error("Error fetching students:", e);
      }
    }
  };

  
  return (
    <div className="formContainer">
      <NameList
        fetchStudents={fetchStudents}   
        setEditData={setEditData}       
        students={students}             
      />
      <Form
        fetchStudents={fetchStudents}    
        editData={editData}            
        setEditData={setEditData}
      />
    </div>
  );
};

export default StudentRegistration;
