import React, { useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from './LocalStorageUtils';
import { v4 as uuidv4 } from 'uuid';
import FormBody from './FormBody';
import Swal from 'sweetalert2';


const Form = ({ updateNameList, editData, setEditData, updateName }) => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [formData, setFormData] = useState({
    id: uuidv4(),
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    contact: '',
    program: '',
    optionalSubject: [],
    status:'active',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setSelectedSubjects(editData.optionalSubject || []); 
      setIsEditMode(true);
    } else {
      resetForm();
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contact') {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
     // Reset selected subjects when program changes
     if (name === 'program') {
      setSelectedSubjects([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingData = getFromLocalStorage('students') || [];
  
    // Integrate selectedSubjects into formData
    const newFormData = {
      ...formData,
      optionalSubject: selectedSubjects,
    };
  
    if (isEditMode) {
      const updatedData = existingData.map((item) =>
        item.id === formData.id ? newFormData : item
      );
      // saveToLocalStorage('students', updatedData);
      // updateName(updatedData);
    
      Swal.fire({
        title: "Do you want to Update the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Update",
        denyButtonText: `Don't Update`
      }).then((isEditMode) => {
        if (isEditMode.isConfirmed) {
          saveToLocalStorage('students', updatedData);
          updateName(updatedData);
      setEditData(null);
          Swal.fire("Updated!", "", "success");
        } else if (isEditMode.isDenied) {
          Swal.fire("Changes are not Updated", "", "info");
        }
      });
    } else {
      existingData.unshift(newFormData);
      saveToLocalStorage('students', existingData);
      updateNameList(newFormData);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "You Successfully Registered Student!",
        showConfirmButton: false,
        timer: 2000
      });
    }
    
    resetForm();
  };
  

  const handleCancel = () => {
    setEditData(null);
    resetForm();
  };
  

  const resetForm = () => {
    setFormData({
      id: uuidv4(),
      firstName: '',
      lastName: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      contact: '',
      program: '',
      optionalSubject: [],
      status: 'active',
    });
    setSelectedSubjects([]); 
    setIsEditMode(false);
  };

  return (
    <div className="rightSide">
      <div className="mainDiv1">
        <h1>{isEditMode ? 'Update Student' : 'Student Registration Form'}</h1>
        <form onSubmit={handleSubmit}>
          <FormBody
            formData={formData}
            handleChange={handleChange}
            isEditMode={isEditMode}
            handleCancel={handleCancel}
            selectedSubjects={selectedSubjects} 
            setSelectedSubjects={setSelectedSubjects} 
          />
        </form>
      </div>
    </div>
  );
};

export default Form;
