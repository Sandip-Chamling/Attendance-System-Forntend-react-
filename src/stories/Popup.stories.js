import React, { useState } from 'react';
import Popup from '../components/Popup';

export default {
  title: 'Component/Popup',
  component: Popup,
};

const Template = (args) => {
  const [showPopup, setShowPopup] = useState(true);

  const handleClose = () => setShowPopup(false);

  return (
    <>
      {showPopup && <Popup {...args} onClose={handleClose} />}
      <button onClick={() => setShowPopup(true)}>Show Popup</button>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  data: {
    firstName: 'Sandip',
    lastName: 'Rai',
    address: 'Siraha',
    dateOfBirth: '2000-01-01',
    gender: 'Male',
    email: 'chamlingsandip@gamil.com',
    contact: '9815712492',
    program: 'BCA',
  },
};
