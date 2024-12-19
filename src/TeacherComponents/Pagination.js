import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange,totalTeachers,currentFilter}) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  const getTotalCount = () => {
    return "Total Teachers: ";
  };


  return (
    <div className="pagination">
      <button onClick={handlePrev} disabled={currentPage === 1}>
      &lt;&lt; Prev
      </button>
      <span className="spanTxt">Page {currentPage} / {totalPages}
       <br/>
       {getTotalCount()}
        {totalTeachers} 
        </span> <br/>
     
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Next &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;
