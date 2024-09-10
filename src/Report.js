import React, { useState } from "react";
import { getFromLocalStorage } from "./components/LocalStorageUtils";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from "date-fns";

const Report = () => {
  const attendReport = getFromLocalStorage("attendance") || [];
  const students = getFromLocalStorage("students") || [];

  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const [selectedMonthYear, setSelectedMonthYear] = useState(format(new Date(), "yyyy-MM"));

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedMonthYear(e.target.value); 
  };

  const getAllDaysInMonth = (month, year) => {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));
    return eachDayOfInterval({ start, end });
  };

  // attendance for selected student in the selected month
  const getAttendanceForStudent = () => {
    // if (!selectedStudentId || !selectedMonthYear) return [];

    const [year, month] = selectedMonthYear.split("-");
    const daysInMonth = getAllDaysInMonth(month, year);

    const studentAttendance = attendReport
      .filter((record) => format(new Date(record.date), "yyyy-MM") === selectedMonthYear)
      .map((attendance) => attendance.attendanceRecord)
      .flat()
      .filter((record) => record.studentId === selectedStudentId);

    return daysInMonth.map((day) => {
      const attendanceRecord = studentAttendance.find((record) =>
        isSameDay(new Date(attendReport.find(a => a.attendanceRecord.includes(record)).date), day)
      );

      return {
        date: format(day, "dd"),
        status: attendanceRecord ? attendanceRecord.status : "Holiday",
      };
    });
  };

  const attendanceData = getAttendanceForStudent();
  
  const totalPresentDays = attendanceData.filter((record) => record.status==="present").length;
  const totalAbsentDays = attendanceData.filter((record) => record.status==="absent").length;
  const totalHolidays = attendanceData.filter((record) => record.status === "Holiday").lenght;
  const presentPercentage = (totalPresentDays/(totalPresentDays + totalAbsentDays)*100).toFixed(1);
  const absentPercentage= ((totalAbsentDays)/(totalPresentDays+ totalAbsentDays)*100).toFixed(1);

  return (
    <>
      <div class="mainRepoDiv">
        <div className="reportDiv">
        <form action="">
          <label>Select Student:</label>
          <select value={selectedStudentId} onChange={handleStudentChange}>
            {/* <option value="">--Select Student--</option> */}
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>

          <label>Select Month and Year:</label>
          <input
            type="month"
            value={selectedMonthYear}
            onChange={handleDateChange}
          />
        </form>
        </div>
              <div class="dateDiv"> {format(selectedMonthYear,"MMM-yyyy")}</div>
        {attendanceData.length > 0 && (
          <div class="mainGridDiv">
            <div class="gridDiv">
            {attendanceData.map((record, index) => (
                <div class={record.status==="present"?
                "present": record.status==="absent"?
                "absent":"holiday"}
                 key={index}> {record.date}<br/>
                 {record.status=== "present" ? "Present": record.status==="absent" ? "Absent" : "Holiday"}
                 </div>
            ))}
         </div>
          <div class="totalDiv">
            Total Present Days: {totalPresentDays} <br/>
            Present Percentage:{presentPercentage} %<br/>
            Total Absent Days: {totalAbsentDays} <br/>
             Absent Percentage:{absentPercentage} %<br/>
            Total Holidays: {totalHolidays}
          </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Report;
