import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import NameList from './components/NameList';
import { getFromLocalStorage } from './components/LocalStorageUtils';

const Registration = () => {
  const [names, setNames] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const savedNames = getFromLocalStorage('students');
    setNames(savedNames);
  }, []);

  const updateNameList = (newName) => {
    setNames((prevNames) => [newName, ...prevNames]);  
  };
  
  
  const updateName = (newNames) => {
    setNames(newNames);
  };

  return (
    <div className="formContainer">
      <NameList names={names} updateName={updateName} setEditData={setEditData}/>
      <Form updateNameList={updateNameList} editData={editData} setEditData={setEditData} updateName={updateName} />
    </div>
  )
};

export default Registration;
