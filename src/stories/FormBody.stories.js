
import React from 'react';
import FormBody from '../components/FormBody';

// Default export with component information
export default {
  title: 'Component/FormBody',
  component: FormBody,
};

// Template for creating different stories
const Template = (args) => <FormBody {...args} />;

// Default story without edit mode
export const Default = Template.bind({});
Default.args = {
  formData: {
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    contact: '',
    program: '',
  },
  handleChange: (e) => console.log(e.target.name, e.target.value),
  isEditMode: false,
  handleCancel: () => console.log('Cancel clicked'),
};

// Story with sample data in edit mode
export const EditMode = Template.bind({});
EditMode.args = {
  formData: {
    firstName: 'Sumit',
    lastName: 'Danwar',
    address: 'Dukuchhap',
    dateOfBirth: '1995-05-15',
    gender: 'Male',
    email: 'sumit@gmail.com',
    contact: '9876543210',
    program: 'Bachelor in Business Studies',
  },
  handleChange: (e) => console.log(e.target.name, e.target.value),
  isEditMode: true,
  handleCancel: () => console.log('Cancel clicked'),
};
