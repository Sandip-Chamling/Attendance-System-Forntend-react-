import React, { useState, useEffect,useContext } from "react";
import { AuthContext } from "../AuthContext";

const Range = () => {
  const {user, gotoLogin}= useContext(AuthContext);
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState((user?.role)==='student' ? user.facultyId : ""); 
  const [selectedSemester, setSelectedSemester] = useState((user?.role)==='student' ? user.semester : "");
  const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); 
    const maxDate = yesterday.toISOString().split('T')[0]; 
    const [fromDate, setFromDate] = useState(maxDate);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];
  const [attendanceDetail, setAttendanceDetail] = useState([]);
  const [students,setStudents]= useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState((user?.role)==='student' ? user.studentId : null);
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentdays] = useState(0);

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
    const fetchStudents = async () => {
        if (selectedFaculty && selectedSemester) {
          try {
            const facultyId = parseInt(selectedFaculty, 10);
            const response = await fetch(`https://localhost:7113/api/Student/facultyId=
            ${facultyId},semester=${selectedSemester}`);
            const studentsData = await response.json();
            setStudents(studentsData);
            //setSelectedStudentId(studentsData[0].id); 
          } catch (e) {
            console.error("Error fetching students:", e);
          }
        }
      };
    fetchStudents();

  }, [selectedFaculty, selectedSemester]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (selectedFaculty && selectedSemester && selectedStudentId && fromDate && toDate) {
        try {
          const facultyId = parseInt(selectedFaculty, 10);
          const response = await fetch(`https://localhost:7113/api/Attendance/studentId=${selectedStudentId},facultyId=${facultyId},semester=${selectedSemester},fromDate=${fromDate},toDate=${toDate}`);
          const attendanceRecord = await response.json();
          setAttendanceDetail(attendanceRecord);
          setPresentDays(attendanceRecord.totalPresentDays);
          setAbsentdays(attendanceRecord.totalAbsentDays);

        } catch (error) {
          console.error("Error fetching attendance records:", error);
        }
      }
    };
    fetchAttendanceData();
  }, [fromDate,toDate, selectedFaculty, selectedSemester,selectedStudentId]);

  const totalClassDays = presentDays + absentDays;
  const presentPercentage = ((presentDays/ totalClassDays)*100).toFixed(1);
  const absentPercentage = ((absentDays/ totalClassDays)*100).toFixed(1);

  return (
    <>
    <div className="recordType">From-To Report</div>
    <div className="rangeContainer">
      <div className="formContainer3">
        <form className="attendSelectDiv2">
            <table className="rangeTable">
                <tr>
                    <td> <label>Faculty:</label></td>
                    <td> <select
                             value={selectedFaculty}
                             onChange={(e) => setSelectedFaculty(e.target.value)}
                             disabled={user?.role === 'student'}
                            > 
                            <option value="" disabled>Select Faculty</option>
                              {faculty.map((program) => (
                            <option key={program.id} value={program.id}>
                             {program.facultyName}
                             </option>
                             ))}
                          </select>
                    </td>
                </tr>
                <tr>
                    <td><label>Semester:</label></td>
                    <td><select
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
                    </td>
                </tr>
                <tr>
                    <td><label htmlFor="">Student:</label></td>
                    <td><select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} disabled={user?.role === 'student'}>
                         {students.length > 0 ? (
                          students.map((student) => (
                         <option key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                          </option>
                         ))
              ) : (
                     <option value="" disabled>No students available</option>
                 )}
                     </select>
                     </td>
                </tr>
                <tr>
                    <td><label className=""><strong>From Date:</strong></label></td>
                    <td> <input
                        type="date"
                        id=""
                        className=""
                        value={fromDate}
                        max={maxDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    </td>
                </tr>
                <tr>
                    <td> <label className=""><strong>To Date:</strong></label></td>
                    <td><input
                        type="date"
                        id=""
                        className=""
                        value={toDate}
                        max={today}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                  </td>
                </tr>
            </table>   
          
        </form>
      </div>

      <div className="summaryDiv">
      {!selectedFaculty || !selectedSemester || !selectedStudentId || !fromDate || !toDate ? (
            <p className="errorMessage2">Please select faculty, semester and Student.</p>
            ) : (
            attendanceDetail ? (
             <div className="totalCountDiv">
                <table>
                    <tr>
                        <td><strong>Total Class Days:</strong></td>
                        <td>{totalClassDays}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Present Days:</strong></td>
                        <td>{presentDays}</td>
                    </tr>
                    <tr>
                        <td><strong>Present Percentage:</strong></td>
                        <td> {isNaN(presentPercentage)?'0':presentPercentage}%</td>
                    </tr>
                    <tr>
                        <td><strong>Total Absent Days:</strong> </td>
                        <td>{absentDays}</td>
                    </tr>
                    <tr>
                        <td><strong>Absent Percentage:</strong></td>
                        <td>{isNaN(absentPercentage)?'0':absentPercentage}%</td>
                    </tr>
                    
                </table>
             
            </div>
         ) : (
       <p className="errorMessage2">No records found for the selected criteria.</p>
             )
            )}
      </div>

    </div>
    </>
  );
};
export default Range;
