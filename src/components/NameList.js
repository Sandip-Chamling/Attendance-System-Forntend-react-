import React, { useState, useEffect,useCallback } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "./LocalStorageUtils";
import SearchBar from "./SearchBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faInfoCircle, faCheckCircle, faTimesCircle } 
from '@fortawesome/free-solid-svg-icons';
import Popup from "./Popup";
import Pagination from "./Pagination";
import Filter from "./Filter";
import Swal from "sweetalert2";

const NameList = ({ names = [], updateName, setEditData }) => {
  const [filteredNames, setFilteredNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const [currentFilter, setCurrentFilter] = useState('all'); 
  const totalStudents = filteredNames.length;

  const deleteHandle = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it !"
    }).then((result) => {
      if (result.isConfirmed) {
        const savedData = getFromLocalStorage('students') || [];
      const updatedData = savedData.filter((item) => item.id !== id);
      saveToLocalStorage('students', updatedData);
    
      const newNames = filteredNames.filter(item => item.id !== id);
      setFilteredNames(newNames);
      updateName(newNames);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  };

  const editHandle = (data) => {
    setEditData(data);
    const updatedData = getFromLocalStorage('students') || [];
    updateName(updatedData);
  };

  const [selectedData, setSelectedData] = useState(null);

  const showDetail = (data) => {
    setSelectedData(data);
  };

  const closePopup = () => {
    setSelectedData(null);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      applyFilter(currentFilter); 
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = filteredNames.filter((data) =>
        `${data.firstName} ${data.lastName}`.toLowerCase().includes(lowerSearchTerm) ||
        data.email.toLowerCase().includes(lowerSearchTerm) ||
        data.address.toLowerCase().includes(lowerSearchTerm) ||
        data.contact.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredNames(filtered);
      setCurrentPage(1); 
    }
  };

    const applyFilter = useCallback((status) => {
      let filtered = names;
      if (status === 'active') {
        filtered = names.filter(student => student.status === 'active');
      } else if (status === 'inactive') {
        filtered = names.filter(student => student.status === 'inactive');
      }
      setFilteredNames(filtered);
      setCurrentPage(1);
    }, [names]);
  
    useEffect(() => {
      applyFilter(currentFilter);
    }, [names, currentFilter, applyFilter]);
  

  const toggleStatus = (id) => {
    const updatedNames = names.map((item) => 
      item.id === id 
      ? { ...item, status: item.status === "active" ? "inactive" : "active" }
      : item
    );
    saveToLocalStorage('students', updatedNames);
    updateName(updatedNames);

    applyFilter(currentFilter);
  };

  const onFilterChange = (status) => {
    setCurrentFilter(status); 
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredNames.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredNames.length / studentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="nameList">
      <h1>Registered Students</h1>
      <SearchBar handleSearch={handleSearch} />
      <Filter onFilterChange={onFilterChange} />
      <div className="listDiv">
        <ul>
          {currentStudents.length > 0 ? (
            currentStudents.map((data) => (
              <li key={data.id}>
                <div className="nameDiv">
                  {data.firstName} {data.lastName}
                  <button onClick={() => showDetail(data)} aria-label="View details">
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </button>
                  <button onClick={() => editHandle(data)} aria-label="Edit student">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => deleteHandle(data.id)} aria-label="Delete student">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  <button onClick={() => toggleStatus(data.id)} aria-label="Toggle status">
                    <FontAwesomeIcon
                      icon={data.status === "active" ? faCheckCircle : faTimesCircle}
                      style={{ color: data.status === "active" ? "green" : "red" }}
                    />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No registered students found.</li>
          )}
        </ul>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalStudents={totalStudents}
        onPageChange={handlePageChange}
        currentFilter={currentFilter}
      />
      {selectedData && <Popup data={selectedData} onClose={closePopup} />}
    </div>
  );
};

export default NameList;
