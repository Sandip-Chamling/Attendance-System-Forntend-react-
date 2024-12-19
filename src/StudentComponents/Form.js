import React, { useState, useEffect } from 'react';
import FormBody from './FormBody';
import Swal from 'sweetalert2';

const Form = ({ editData, setEditData, fetchStudents }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    contact: '',
    batch: '',
    facultyId: '',
    semester: '',
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

    try {
      if (isEditMode) {
        const response = await fetch(`https://localhost:7113/api/Student/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFormData),
        });

        if (response.ok) {
          fetchStudents(formData.facultyId, formData.semester);  
          setEditData(null);
          Swal.fire("Updated!", "", "success");
        } else {
          throw new Error('Failed to update student');
        }
      } else {
        const response = await fetch('https://localhost:7113/api/Student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFormData),
        });

        if (response.ok) {
          fetchStudents(formData.facultyId, formData.semester);
          resetForm();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "You successfully registered the student!",
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          throw new Error('Failed to register student');
        }
      }
    } catch (error) {
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
      batch: '',
      facultyId: '',
      semester: '',
    });
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
          />
        </form>
      </div>
    </div>
  );
};

export default Form;
