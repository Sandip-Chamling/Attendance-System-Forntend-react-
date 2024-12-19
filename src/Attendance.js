import React, { useState, useEffect,useContext} from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from './AuthContext';

const Attendance = () => {
  const {gotoLogin} = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceDateId, setAttendanceDateId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); 
  const today = new Date().toISOString().split('T')[0];
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

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
    gotoLogin();
  });

  useEffect(() => {
    const fetchStudentsData = async () => {
        if (selectedFaculty && selectedSemester) {
          try {
            const facultyId = parseInt(selectedFaculty, 10); 
            const response = await fetch(`https://localhost:7113/api/Student/facultyId=
            ${facultyId},semester=${selectedSemester}`);       
            const data = await response.json();
            setStudents(data);

        const initialStatus = {};
        data.forEach(student => {
          initialStatus[student.id] = 'present';
        });
        setAttendanceStatus(initialStatus);
      } catch (e) {
        console.error("Error in fetching students: " + e);  
      }
    }};
    if (selectedFaculty && selectedSemester) {
      fetchStudentsData();
    }
  }, [selectedFaculty, selectedSemester]);


  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (selectedFaculty && selectedSemester && attendanceDate) {
        try {
          const facultyId = parseInt(selectedFaculty.trim(), 10);
          const response = await fetch(`https://localhost:7113/api/Attendance/Date=${attendanceDate},facultyId=${facultyId},semester=${selectedSemester}`);
          const existingAttendance = await response.json();
          console.log("fetched"+response);
          
          const attendanceForDate = existingAttendance.find(
            (record) => record.date === attendanceDate
          );
  
          if (attendanceForDate) {
            setAttendanceDateId(attendanceForDate.id);
            const initialStatus = {};
  
            if (Array.isArray(attendanceForDate.attendanceDetails)) {
              attendanceForDate.attendanceDetails.forEach((studentRecord) => {
                initialStatus[studentRecord.studentId] = studentRecord.status;
              });
            } else {
              console.error("attendanceDetails is not an array:", attendanceForDate.attendanceDetails);
            }
  
            setAttendanceStatus(initialStatus);
            setIsEditMode(true);
          } else {
            const initialStatus = {};
            students.forEach(student => {
              initialStatus[student.id] = 'present';
            });
            setAttendanceStatus(initialStatus);
            setAttendanceDateId(null);
            setIsEditMode(false);
          }
        } catch (error) {
          console.error("Error fetching attendance records:", error);
        }
      }
    };
  
    if (selectedFaculty && selectedSemester && attendanceDate) {
      fetchAttendanceData();
    }
  }, [attendanceDate, selectedFaculty, selectedSemester, students]); 
  
  
  const handleDateChange = (e) => {
    setAttendanceDate(e.target.value);
  };

  const handleSwitchChange = (studentId) => {
    setAttendanceStatus((prevState) => ({
      ...prevState,
      [studentId]: prevState[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedAttendanceDetails = students.map(student => ({
      id: 0,  
      studentId: student.id,
      status: attendanceStatus[student.id],
    }));

    const postAttendanceRecord = {
      date: attendanceDate,
      attendanceDetails: students.map(student => ({
        studentId: student.id,
        status: attendanceStatus[student.id],
      })),
    };
        
    if (attendanceDateId) {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`https://localhost:7113/api/Attendance/${attendanceDateId}`, {
              method: 'PUT', 
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedAttendanceDetails),
            });

            if (response.ok) {
              Swal.fire("Saved!", "", "success");
            } else {
              Swal.fire("Failed to update attendance", "", "error");
            }
          } catch (error) {
            Swal.fire("Error updating attendance", error.message, "error");
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } else { 
      try {
        const response = await fetch('https://localhost:7113/api/Attendance/record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postAttendanceRecord),
        });

        if (response.ok) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "You Successfully Recorded Today's Attendance!",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          const errorResponse = await response.text();
          console.log(postAttendanceRecord);
          console.error('Error response:', errorResponse);
          console.error('Response status:', response.status);
          Swal.fire("Failed to record attendance", "", "error");
        }
      } catch (error) {
        Swal.fire("Error saving attendance", error.message, "error");
      }
    }
  };
  
  return (
    <div className="attendDiv1">
      <div>
        <form className="attendSelectDiv1">
          <label className="dateLabel"><strong>Attendance Date:</strong></label>
          <input
            type="date"
            value={attendanceDate}
            max={today}
            onChange={handleDateChange}
          /><br/>

          <label htmlFor="faculty">Faculty:</label>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="" disabled>Select Faculty</option>
            {faculty.map((program) => (
              <option key={program.id} value={program.id}>
                {program.facultyName}
              </option>
            ))}
          </select><br/>

          <label htmlFor="semester">Semester:</label>
          <select
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
      </div>

      <div className="attendDiv2">
        <h2>{isEditMode ? 'Edit Attendance' : 'Record Attendance'}</h2>
        <form onSubmit={handleSubmit}>
          {!selectedFaculty || !selectedSemester ? (
            <p className="attendPrag">Please select faculty and semester</p>
          ) : students.length > 0 ? (
            <>
              <h4>Students:</h4>
              <table>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="td1">
                        {student.firstName} {student.lastName}
                      </td>
                      <td>
                        <div id="checkDiv" className="switch-wrapper">
                          <label className="switch" htmlFor={`attendance-switch-${student.id}`}>
                            <input
                              type="checkbox"
                              id={`attendance-switch-${student.id}`}
                              checked={attendanceStatus[student.id] === 'present'}
                              onChange={() => handleSwitchChange(student.id)}
                            />
                            <span className="slider"></span>
                          </label>
                          {attendanceStatus[student.id] === 'present' ? 'Present' : 'Absent'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="submit">
                {isEditMode ? 'Edit Attendance' : 'Record Attendance'}
              </button>
            </>
          ) : (
            <p className="attendPrag">No Registered Students Found.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Attendance;

