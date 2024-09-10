import React from 'react';
import SearchBar from '../components/SearchBar';

export default {
  title: 'Component/SearchBar',
  component: SearchBar,
};

const Template = (args) => {
  const handleSearch = (value) => {
    console.log('Search Term:', value);
  };

  return <SearchBar {...args} handleSearch={handleSearch} />;
};

export const Default = Template.bind({});
Default.args = {
};


