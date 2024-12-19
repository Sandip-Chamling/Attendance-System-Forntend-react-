import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../AuthContext';

const Section = () => {
  const { user, gotoLogin } = useContext(AuthContext); 
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState((user?.role)==='student' ?user.facultyId : ""); 
  const [selectedSemester, setSelectedSemester] = useState((user?.role)==='student' ?user.semester : ""); 
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];
  const [attendanceDetail, setAttendanceDetail] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentStudents, setPresentStudents] = useState(0);
  const [absentStudents, setAbsentStudents] = useState(0);

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
    const fetchAttendanceData = async () => {
      if (selectedFaculty && selectedSemester && attendanceDate) {
        try {
          const facultyId = parseInt(selectedFaculty, 10); 
          const response = await fetch(`https://localhost:7113/api/Attendance/Date=${attendanceDate},facultyId=${facultyId},semester=${selectedSemester}`);
          const attendanceRecord = await response.json();
          setAttendanceDetail(attendanceRecord);
  
          let total = 0;
          let present = 0;
          let absent = 0;
  
          attendanceRecord.forEach(attendance => {
            total += attendance.attendanceDetails.length;
            present += attendance.attendanceDetails.filter(student => student.status === 'present').length;
            absent += attendance.attendanceDetails.filter(student => student.status !== 'present').length;
          });
  
          setTotalStudents(total);
          setPresentStudents(present);
          setAbsentStudents(absent);
        } catch (error) {
          console.error("Error fetching attendance records:", error);
        }
      }
    };
    fetchAttendanceData();
  }, [attendanceDate, selectedFaculty, selectedSemester]);
  

  return (
    <>
    <div className="recordType">Daily Class Report</div>
    <div className="sectionContainer">
      <div className="formContainer2">
        <form className="attendSelectDiv">
          <label className=""><strong>Attendance Date:</strong></label>
          <input
            type="date"
            id=""
            className=""
            value={attendanceDate}
            max={today}
            onChange={(e) => setAttendanceDate(e.target.value)}
          /><br />

              <label>Faculty:</label>
              <select
                className=""
                id=""
                value={selectedFaculty}
                disabled={user?.role === 'student'}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="" disabled>Select Faculty</option>
                {faculty.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.facultyName}
                  </option>
                ))}
              </select><br />

              <label>Semester:</label>
              <select
                className=""
                id=""
                value={selectedSemester}
                disabled={user?.role === 'student'}
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

      <div className="attendanceTableContainer">
        {!selectedFaculty || !selectedSemester || !attendanceDate ? (
          <p className="errorMessage">Please select date, faculty, and semester.</p>
        ) : (
          attendanceDetail.length > 0 ? (
            <table className="sectionTable">
              <thead>
                <tr>
                  <th>Students</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceDetail.map((attendance) =>
                  attendance.attendanceDetails.map((student) => (
                    <tr key={student.studentId} className={student.status === 'present' ? 'presentStd' :'absentStd' }>
                      <td>{student.studentName}</td>
                      <td>{student.status === 'present' ? 'Present' : 'Absent'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <p className="errorMessage">No records found for the selected date, faculty, and semester.</p>
          )
        )}
      </div>

      <div className="totalContainer">
        <table>
          <tr>
            <td><strong>Total Students:</strong></td>
            <td>{totalStudents}</td>
          </tr>
          <tr>
            <td><strong>Present Students:</strong></td>
            <td>{presentStudents}</td>
          </tr>
          <tr>
            <td><strong>Absent Students:</strong></td>
            <td>{absentStudents}</td>
          </tr>
        </table>
      </div>
    </div>
    </>
  );
};
export default Section;
