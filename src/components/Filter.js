import React from 'react';

const Filter = ({ onFilterChange }) => {

  const handleFilter = (event) => {
    onFilterChange(event.target.value);
  };

  return (
    <div className="radioDiv">
      <input 
        type="radio" 
        id="option1" 
        name="options" 
        value="all"
        onChange={handleFilter} 
        defaultChecked
      />
      <label htmlFor="option1">All</label>

      <input 
        type="radio" 
        id="option2" 
        name="options" 
        value="active"
        onChange={handleFilter}
      />
      <label htmlFor="option2">Active</label>

      <input 
        type="radio" 
        id="option3"
        name="options" 
        value="inactive"
        onChange={handleFilter}
      />
      <label htmlFor="option3">Inactive</label>
    </div>
  );
};

export default Filter;
