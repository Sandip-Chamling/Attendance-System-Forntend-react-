
import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from './components/LocalStorageUtils';
import Swal from 'sweetalert2';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [isEditMode, setIsEditMode] = useState(false); 
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const studentData = getFromLocalStorage('students') || [];
    setStudents(studentData);

    const initialStatus = {};
    studentData.forEach(student => {
      initialStatus[student.id] = 'present'; // Default status to 'present'
    });
    setAttendanceStatus(initialStatus);
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setAttendanceDate(selectedDate);

    const existingAttendance = getFromLocalStorage('attendance') || [];

    const attendanceForDate = existingAttendance.find(record => record.date === selectedDate);

    if (attendanceForDate) {
      const initialStatus = {};
      attendanceForDate.attendanceRecord.forEach(studentRecord => {
        initialStatus[studentRecord.studentId] = studentRecord.status;
      });
      setAttendanceStatus(initialStatus);
      setIsEditMode(true); 
    } else {
      const initialStatus = {};
      students.forEach(student => {
        initialStatus[student.id] = 'present'; // Default status to 'present'
      });
      setAttendanceStatus(initialStatus);
      setIsEditMode(false); 
    }
  };

  const handleSwitchChange = (studentId) => {
    setAttendanceStatus(prevState => ({
      ...prevState,
      [studentId]: prevState[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingAttendance = getFromLocalStorage('attendance') || [];

    const newAttendanceRecord = {
      date: attendanceDate,
      attendanceRecord: students.map(student => ({
        studentId: student.id,
        status: attendanceStatus[student.id]
      }))
    };

    const existingRecordIndex = existingAttendance.findIndex(record => record.date === attendanceDate);

    if (existingRecordIndex !== -1) {
      // existingAttendance[existingRecordIndex] = newAttendanceRecord;
      // alert('Attendance updated successfully');
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          existingAttendance[existingRecordIndex] = newAttendanceRecord;
          saveToLocalStorage('attendance', existingAttendance);
   
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } else {
      // If adding a new record, push it to the attendance array
      existingAttendance.unshift(newAttendanceRecord);
      saveToLocalStorage('attendance', existingAttendance);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "You Successfully Record Today's Attendance!",
        showConfirmButton: false,
        timer: 2000
      });
    }

    // Save the updated attendance data back to local storage
    
   
  };

  return (
    <div className="attendDiv1">
      <div className="attendDiv2">
        <h2>{isEditMode ? 'Edit Attendance' : 'Record Attendance'}</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="allDate">
            <label htmlFor="attendanceDate" className="dateLabel"><strong>Attendance Date:</strong></label>
            <input
              type="date"
              id="attendanceDate"
              className="dateInput"
              value={attendanceDate}
              max={today}
              onChange={handleDateChange}
            />
          </div>
          
          <h4>Students:</h4>
          <table>
            <tbody>
              
          <ul className="list-unstyled">
            {students.map(student => (
              <tr key={student.id}>
                <td className="td1">
                  <li className="mb-3">
                    {student.firstName} {student.lastName}
                  </li>
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
          </ul>
          </tbody>
          </table>

          <button type="submit" className="btn btn-primary">
            {isEditMode ? 'Edit Attendance' : 'Record Attendance'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Attendance;
