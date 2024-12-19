import React, { useState, useEffect } from 'react';
import FormBody from './FormBody';
import Swal from 'sweetalert2';

const Form = ({editData, setEditData,fetchTeachers }) => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    contact: '',
    facultyId: '',
    semester:'',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
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
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newFormData = {
      ...formData,
      facultyId: parseInt(formData.facultyId, 10), 
    };
    console.log("submitted data" +newFormData);
  
    try {
      if (isEditMode) {
        const response = await fetch(`https://localhost:7113/api/Teacher/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFormData),
        });
  
        if (response.ok) {
          fetchTeachers();
          setEditData(null);
          Swal.fire("Updated!", "", "success");
        } else {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error('Failed to update Teacher');
        }
      } else {
        
        const response = await fetch('https://localhost:7113/api/Teacher', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFormData),
        });
  
        if (response.ok) {
          fetchTeachers();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "You successfully registered the Teacher!",
            showConfirmButton: false,
            timer: 2000,
          });
          resetForm();
        } else {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error('Failed to register teacher');
        }
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error submitting data to the server!",
        showConfirmButton: true,
      });
    }
  };
 
  const handleCancel = () => {
    setEditData(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    contact: '',
    facultyId: '',
    semester:'',
    });
    setIsEditMode(false);
  };
  console.log(formData);
  return (
    <div className="rightSide">
      <div className="mainDiv1">
        <h1>{isEditMode ? 'Update Teacher' : 'Teacher Registration Form'}</h1>
        <form onSubmit={handleSubmit}>
          <FormBody
            formData={formData}
            handleChange={handleChange}
            isEditMode={isEditMode}
            handleCancel={handleCancel}

          />
        </form>
      </div>
    </div>
  );
};

export default Form;

