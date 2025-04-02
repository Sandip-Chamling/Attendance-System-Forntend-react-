import React, { useEffect, useState,useContext} from "react";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getDay,
  isSameDay,
  isBefore,
  isAfter,
} from "date-fns";
import { AuthContext } from "../AuthContext";
//import { useNavigate } from "react-router-dom";

const Individual = () => {
  const {user,gotoLogin} = useContext(AuthContext);
 // const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendReport, setAttendReport] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState((user?.role)==='student' ? user.studentId : null);
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState((user?.role)==='student' ? user.facultyId : ""); 
  const [selectedSemester, setSelectedSemester] = useState((user?.role)==='student' ? user.semester : "");
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch('https://localhost:7113/api/Faculty');
        const data = await response.json();
        setFaculty(data); 
        //setSelectedStudentId(data[0].id);
      } catch (error) {
        console.error('Error fetching Faculty:', error);
      }
    };
    fetchFaculty();
    gotoLogin();
  },);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedFaculty && selectedSemester) {
        try {
          const facultyId = parseInt(selectedFaculty, 10); 
          const response = await fetch(`https://localhost:7113/api/Student/facultyId=
          ${facultyId},semester=${selectedSemester}`);       
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          
          setStudents(data);
          //setSelectedStudentId(data[0].id); 

        } catch (e) {
          console.error("Error in fetching students data: " + e);
        }
      } else {
        setStudents([]);
        setSelectedStudentId(null);
      }
    };
  
    fetchStudents();
  }, [selectedFaculty, selectedSemester]);
  
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("https://localhost:7113/api/Attendance");
        const data = await response.json();
        setAttendReport(data);
      } catch (e) {
        console.error("Error in fetching Attendance Data: " + e);
      }
    };
    fetchAttendance();
  }, []);

  const [selectedMonthYear, setSelectedMonthYear] = useState(
    format(new Date(), "yyyy-MM")
  );

  const handleStudentChange = (e) => {
    setSelectedStudentId(parseInt(e.target.value));
  };

  const handleDateChange = (e) => {
    setSelectedMonthYear(e.target.value);
  };

  const getAllDaysInMonth = (month, year) => {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));
    return eachDayOfInterval({ start, end });
  };

  const getAttendanceForStudent = () => {
    const today = new Date();
    const [year, month] = selectedMonthYear.split("-");
    const daysInMonth = getAllDaysInMonth(month, year);

    const studentAttendance = attendReport
      .filter((record) => format(new Date(record.date), "yyyy-MM") === selectedMonthYear)
      .map((attendance) => attendance.attendanceDetails)
      .flat()
      .filter((record) => record.studentId === selectedStudentId);

    return daysInMonth.map((day) => {
      const attendanceRecord = studentAttendance.find((record) =>
        isSameDay(
          new Date(attendReport.find((a) => a.attendanceDetails.includes(record)).date),
          day
        )
      );

      let status;
      if (attendanceRecord) {
        status = attendanceRecord.status;
      } else if (isBefore(day, today)) {
        status = "Holiday"; 
      } else if (isAfter(day, today)) {
        status = null; 
      }

      return {
        date: format(day, "dd"),
        dayOfWeek: format(day, "E"),
        status,
      };
    });
  };

  const attendanceData = getAttendanceForStudent();

  const totalPresentDays = attendanceData.filter((record) => record.status === "present").length;
  const totalAbsentDays = attendanceData.filter((record) => record.status === "absent").length;
  const totalHolidays = attendanceData.filter((record) => record.status === "Holiday").length;
  const presentPercentage = ((totalPresentDays / (totalPresentDays + totalAbsentDays)) * 100).toFixed(1);
  const absentPercentage = ((totalAbsentDays / (totalPresentDays + totalAbsentDays)) * 100).toFixed(1);

  const firstDayOfMonth = getDay(startOfMonth(new Date(selectedMonthYear)));

  const calendarGrid = Array(firstDayOfMonth).fill(null).concat(attendanceData);

  return (
    <>
    <div className="recordType2">Monthly Individual Report</div>
    <div className="mainIndividual" style={{ display: "flex", flexDirection: "row", height: "auto" }}>
      <div style={{ flex: 1, padding: "20px" }}>
        <div className="reportDiv">
          <form action="" className="individualForm">
            <label htmlFor="faculty">Faculty:</label>
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

            <label htmlFor="semester">Semester:</label>
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
            </select><br />

            <label htmlFor="">Student:</label>
            <select className="" value={selectedStudentId} onChange={handleStudentChange}  disabled={user?.role === 'student'}>
              {students.length > 0 ? (
                students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))
              ) : (
                <option value="" disabled>No students available</option>
              )}
            </select><br />

            <label>Select Month and Year:</label>
            <input
              className=""
              type="month"
              value={selectedMonthYear}
              onChange={handleDateChange}
            />
          </form>
        </div>
      </div>

      <div className="secondDiv"style={{ flex: 2, padding: "20px" }}>
        <div className="dateDiv">{format(new Date(selectedMonthYear), "MMM-yyyy")}</div>

        {calendarGrid.length > 0 && (
          <div className="mainGridDiv">
            <table className="calendar">
              <thead>
                <tr>
                  <th>Sun</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                </tr>
              </thead>
              <tbody>
                {Array(Math.ceil(calendarGrid.length / 7))
                  .fill(null)
                  .map((_, rowIndex) => (
                    <tr key={rowIndex} className="calendarTr">
                      {calendarGrid.slice(rowIndex * 7, rowIndex * 7 + 7).map((record, cellIndex) => (
                        <td key={cellIndex} className={record ? record.status : "empty"}>
                          {record ? record.date : ""}
                          <br />
                          {record ? (record.status === "present" ? "Present" : record.status === "absent" ? "Absent" : record.status === "Holiday" ? "Holiday" : "") : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="totalDiv">
            <table>
                    <tr>
                        <td><strong>Present Days:</strong></td>
                        <td>{totalPresentDays}</td>
                    </tr>
                    <tr>
                        <td><strong>Present Percentage:</strong></td>
                        <td> {isNaN(presentPercentage)?'0':presentPercentage}%</td>
                    </tr>
                    <tr>
                        <td><strong>Absent Days:</strong> </td>
                        <td>{totalAbsentDays}</td>
                    </tr>
                    <tr>
                        <td><strong>Absent Percentage:</strong></td>
                        <td>{isNaN(absentPercentage)?'0':absentPercentage}%</td>
                    </tr>
                    <tr>
                        <td><strong>Holidays:</strong></td>
                        <td>{totalHolidays}</td>
                    </tr>
                    
                </table>
             
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Individual;

