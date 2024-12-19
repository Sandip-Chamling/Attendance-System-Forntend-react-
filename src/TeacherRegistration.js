import React, { useState, useEffect ,useContext} from 'react';
import Form from './TeacherComponents/Form';
import NameList from './TeacherComponents/NameList';
import { AuthContext } from './AuthContext';

const TeacherRegistration = () => {
  const {gotoLogin} = useContext(AuthContext);
  const [names, setNames] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(()=>{
    gotoLogin();
  });

  const fetchTeachers = async () => {
    try {
      const response = await fetch('https://localhost:7113/api/Teacher');
      const data = await response.json();
      setNames(data);
    } catch (error) {
      console.error('Error in fetching Teacher:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="formContainer">
      <NameList names={names} fetchTeachers={fetchTeachers} setEditData={setEditData} />
      <Form fetchTeachers={fetchTeachers} editData={editData} setEditData={setEditData}/>
    </div>
  );
};

export default TeacherRegistration;
