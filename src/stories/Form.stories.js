
import React, { useState } from 'react';
import Form from '../components/Form';

// Mock functions
const updateNameList = (data) => console.log('Name List Updated:', data);
const updateName = (data) => console.log('Name Updated:', data);
const setEditData = (data) => console.log('Edit Data Set:', data);

export default {
  title: 'Component/Form',
  component: Form,
};

const Template = (args) => {
  const [editData, setEditDataState] = useState(null);

  return (
    <Form
      {...args}
      updateNameList={updateNameList}
      updateName={updateName}
      editData={editData}
      setEditData={(data) => setEditDataState(data)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};

