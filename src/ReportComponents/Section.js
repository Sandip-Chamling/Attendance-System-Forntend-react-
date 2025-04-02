import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../AuthContext";
import * as XLSX from "xlsx";

const Section = () => {
  const { user, gotoLogin } = useContext(AuthContext);
  console.log("User: ", user);

  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(user?.role === "student" ? user.facultyId : "");
  const [selectedSemester, setSelectedSemester] = useState(user?.role === "student" ? user.semester : "");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const today = new Date().toISOString().split("T")[0];

  const [attendanceDetail, setAttendanceDetail] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentStudents, setPresentStudents] = useState(0);
  const [absentStudents, setAbsentStudents] = useState(0);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch("https://localhost:7113/api/Faculty");
        const data = await response.json();
        setFaculty(data);
      } catch (error) {
        console.error("Error fetching Faculty:", error);
      }
    };
    fetchFaculty();
    gotoLogin();
  }, [gotoLogin]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (selectedFaculty && selectedSemester && attendanceDate) {
        try {
          const facultyId = parseInt(selectedFaculty, 10);
          const response = await fetch(
            `https://localhost:7113/api/Attendance/Date=${attendanceDate},facultyId=${facultyId},semester=${selectedSemester}`
          );
          const attendanceRecord = await response.json();
          setAttendanceDetail(attendanceRecord);

          let total = 0;
          let present = 0;
          let absent = 0;

          attendanceRecord.forEach((attendance) => {
            total += attendance.attendanceDetails.length;
            present += attendance.attendanceDetails.filter((student) => student.status === "present").length;
            absent += attendance.attendanceDetails.filter((student) => student.status !== "present").length;
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

  const handlePrint = () => {
    const facultyName = faculty.find(f => f.id === parseInt(selectedFaculty))?.facultyName || "N/A";
    const semesterLabel = `${selectedSemester}${["th", "st", "nd", "rd"][selectedSemester % 10] || "th"} Semester`;

    const prtContent = document.getElementById("ToPrint");
    const WinPrint = window.open('', '_blank', 'width=800,height=600');
    WinPrint.document.write(`
      <html>
        <head>
          <title>Daily Class Wise Report</title>
          <style>
            @page { size: auto; margin: 0mm; }
            table, th, td { border: 1px solid black; border-collapse: collapse; padding: 10px; }
            .title1 { text-align: center; font-size: 25px; margin-top: 20px; }
            .title2 { text-align: center; font-size: 20px; margin-bottom: 20px; }
            .title3 { text-align: center; font-size: 20px; margin-bottom: 25px; }
            .mainDiv { margin-left: 100px;}
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <div class="title1">Mega National College</div>
          <div class="title2">Kumaripati, Lalitpur</div>
          <div class="title3">Daily Class Wise Report</div>
          <div class="mainDiv">
            <p><strong>Date:</strong> ${attendanceDate}</p>
            <p><strong>Faculty:</strong> ${facultyName}</p>
            <p><strong>Semester:</strong> ${semesterLabel}</p>
            <p><strong>Total Student:</strong> ${totalStudents}</p>
            <p><strong>Present Students:</strong> ${presentStudents}</p>
            <p><strong>Absent Students:</strong> ${absentStudents}</p>
            ${prtContent.innerHTML}
          </div>
         
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  const handleExportToExcel = () => {
    if (!attendanceDetail.length) return;
    const ws = XLSX.utils.table_to_sheet(tableRef.current);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daily Attendance Report");
    XLSX.writeFile(wb, "Daily_Attendance_Report.xlsx");
  };

  return (
    <>
      <div className="recordType">Daily Class Report</div>
      
      {user.role === 'admin' && (
          <div className="buttonContainer" style={{ marginLeft: "1380px" }}>
            <button
              style={{
                height: "30px",
                width: "100px",
                borderRadius: "5px",
                marginRight: "10px"
              }}
              onClick={handlePrint}
              disabled={!attendanceDetail.length}
            >
              Print
            </button>
            <button
              style={{
                height: "30px",
                width: "100px",
                borderRadius: "5px"
              }}
              onClick={handleExportToExcel}
              disabled={!attendanceDetail.length}
            >
              Export to Excel
            </button>
          </div>
        )}

      <div className="sectionContainer">
        <div className="formContainer2">
          <form className="attendSelectDiv">
            <label><strong>Attendance Date:</strong></label>
            <input type="date" value={attendanceDate} max={today} onChange={(e) => setAttendanceDate(e.target.value)} />
            <br />

            <label>Faculty:</label>
            <select value={selectedFaculty} disabled={user?.role === "student"} onChange={(e) => setSelectedFaculty(e.target.value)}>
              <option value="" disabled>Select Faculty</option>
              {faculty.map((program) => (
                <option key={program.id} value={program.id}>{program.facultyName}</option>
              ))}
            </select>
            <br />

            <label>Semester:</label>
            <select value={selectedSemester} disabled={user?.role === "student"} onChange={(e) => setSelectedSemester(e.target.value)} required>
              <option value="" disabled>Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}th Semester</option>
              ))}
            </select>
          </form>
        </div>

        <div className="attendanceTableContainer" id="ToPrint">
          {!selectedFaculty || !selectedSemester || !attendanceDate ? (
            <p className="errorMessage">Please select date, faculty, and semester.</p>
          ) : attendanceDetail.length > 0 ? (
            <table ref={tableRef} className="sectionTable">
              <thead>
                <tr>
                  <th>Students</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceDetail.map((attendance) =>
                  attendance.attendanceDetails.map((student) => (
                    <tr key={student.studentId} className={student.status === "present" ? "presentStd" : "absentStd"}>
                      <td>{student.studentName}</td>
                      <td>{student.status === "present" ? "Present" : "Absent"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <p className="errorMessage">No records found for the selected date, faculty, and semester.</p>
          )}
        </div>

        <div className="totalContainer">
          <table>
            <tbody>
              <tr><td><strong>Total Students:</strong></td><td>{totalStudents}</td></tr>
              <tr><td><strong>Present Students:</strong></td><td>{presentStudents}</td></tr>
              <tr><td><strong>Absent Students:</strong></td><td>{absentStudents}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Section;
