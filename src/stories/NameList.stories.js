import React, { useState } from 'react';
import NameList from '../components/NameList';
import { v4 as uuidv4 } from 'uuid';

export default {
  title: 'Component/NameList',
  component: NameList,
};

// Mock data for stories
const mockNames = [
  { id: uuidv4(), firstName: 'Sandip', lastName: 'Rai', address: 'Siraha', dateOfBirth: '2000-01-01', gender: 'Male', email: 'sandip@example.com', contact: '9823223242', program: 'BBA' },
  { id: uuidv4(), firstName: 'Prabhat', lastName: 'Karki', address: 'Mirchiya', dateOfBirth: '1995-05-15', gender: 'Male', email: 'prabhat@example.com', contact: '983535334', program: 'Business Studies' },
  { id: uuidv4(), firstName: 'Sandip', lastName: 'Rai', address: 'Siraha', dateOfBirth: '2000-01-01', gender: 'Male', email: 'sandip@example.com', contact: '9823223242', program: 'BBA' },
  { id: uuidv4(), firstName: 'Prabhat', lastName: 'Karki', address: 'Mirchiya', dateOfBirth: '1995-05-15', gender: 'Male', email: 'prabhat@example.com', contact: '983535334', program: 'Business Studies' },
  { id: uuidv4(), firstName: 'Sandip', lastName: 'Rai', address: 'Siraha', dateOfBirth: '2000-01-01', gender: 'Male', email: 'sandip@example.com', contact: '9823223242', program: 'BBA' },
  { id: uuidv4(), firstName: 'Prabhat', lastName: 'Karki', address: 'Mirchiya', dateOfBirth: '1995-05-15', gender: 'Male', email: 'prabhat@example.com', contact: '983535334', program: 'Business Studies' },
];

const Template = (args) => {
  const [names, setNames] = useState([...mockNames]); 
  const [editData, setEditData] = useState(null);

  // Function to update names state
  const updateName = (updatedNames) => setNames(updatedNames);

  return (
    <NameList
      {...args}
      names={names}
      updateName={updateName}
      setEditData={setEditData}
    />
  );
};

// Default story with mock data
export const Default = Template.bind({});
Default.args = {};
