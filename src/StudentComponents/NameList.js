import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Popup from "./Popup";
import Pagination from "./Pagination";
import Swal from "sweetalert2";

const NameList = ({ setEditData, fetchStudents, students }) => {
  const [filteredNames, setFilteredNames] = useState([]); 
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Fetch faculties once
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch('https://localhost:7113/api/Faculty');
        const data = await response.json();
        setFaculty(data);
      } catch (error) {
        console.error('Error fetching Faculty:', error);
      }
    };
    fetchFaculty();
  }, []);

  useEffect(() => {
    fetchStudents(selectedFaculty, selectedSemester);
  }, [fetchStudents,selectedFaculty, selectedSemester]);

  useEffect(() => {
    setFilteredNames(students);
  }, [students]);

  const deleteHandle = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`https://localhost:7113/api/Student/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setFilteredNames(prev => prev.filter((item) => item.id !== id));
          fetchStudents(selectedFaculty, selectedSemester);
          Swal.fire("Deleted!", "The student has been deleted.", "success");
        } else {
          Swal.fire("Error!", "There was a problem deleting the student.", "error");
        }
      }
    } catch (error) {
      console.error("Error in deleting student:", error);
      Swal.fire("Error!", "An unexpected error occurred.", "error");
    }
  };

  const editHandle = (data) => {
    setEditData(data);
  };

  const [selectedData, setSelectedData] = useState(null);

  const showDetail = (data) => {
    setSelectedData(data);
  };

  const closePopup = () => {
    setSelectedData(null);
  };

  const handleSearch = (searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = students.filter((data) =>
      `${data.firstName} ${data.lastName}`.toLowerCase().includes(lowerSearchTerm) ||
      data.email.toLowerCase().includes(lowerSearchTerm) ||
      data.address.toLowerCase().includes(lowerSearchTerm) ||
      data.contact.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredNames(filtered);
    setCurrentPage(1);
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
      <form className="selectForm">
        <select
          id="faculty"
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
        >
          <option value="" disabled>Select Faculty:</option>
          {faculty.map((program) => (
            <option key={program.id} value={program.id}>
              {program.facultyName}
            </option>
          ))}
        </select>
        <select
          id="semester"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          required
        >
          <option value="" disabled>Select Semester</option>
          <option value="1">1st Semester</option>
          <option value="2">2nd Semester</option>
          <option value="3">3rd Semester</option>
          <option value="4">4th Semester</option>
          <option value="5">5th Semester</option>
          <option value="6">6th Semester</option>
          <option value="7">7th Semester</option>
          <option value="8">8th Semester</option>
        </select>
      </form>

      <div className="listDiv">
        <ul>
          {!selectedFaculty || !selectedSemester ? (
            <p className="selectMessage">Please select faculty and semester</p>
          ) : currentStudents.length > 0 ? (
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
                </div>
              </li>
            ))
          ) : (
            <li className="emptyStudent">No Registered Students found.</li>
          )}
        </ul>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalStudents={filteredNames.length}
        onPageChange={handlePageChange}
      />
      {selectedData && <Popup data={selectedData} onClose={closePopup} />}
    </div>
  );
};

export default NameList;
