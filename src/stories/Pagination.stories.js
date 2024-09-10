
import React, { useState } from 'react';
import Pagination from '../components/Pagination';

export default {
  title: 'Component/Pagination',
  component: Pagination,
};

// Template for stories
const Template = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
};

// Default story with mock data
export const Default = Template.bind({});
Default.args = {
  currentPage: 1,
  totalPages: 5,
};

// Additional stories
export const MidPage = Template.bind({});
MidPage.args = {
  currentPage: 3,
  totalPages: 10,
};

export const LastPage = Template.bind({});
LastPage.args = {
  currentPage: 5,
  totalPages: 5,
};
