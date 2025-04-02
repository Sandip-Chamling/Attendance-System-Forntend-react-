import React, { useEffect, useState } from "react";
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const Recommendation = () => {
  const [data, setData] = useState({
    frequentAbsenteeism: [],
    belowAverageAttendance: [],
    goodAttendance: [],
  });

  useEffect(() => {
    const fetchRecomData = async () => {
      try {
        const response = await fetch(
          "https://localhost:7113/api/Recommendation/attendance"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRecomData();
  }, []);

  const columns = [
    {
      header: "SN",
      accessorKey: "sn", 
    },
    { header: "Name", accessorKey: "studentName" },
    { header: "Faculty", accessorKey: "facultyName" },
    { header: "Semester", accessorKey: "semester" },
    { header: "Attendance Rate", accessorKey: "attendanceRate" },
  ];

  const renderTable = (title, rows) => (
    <Box sx={{ marginBottom: 4, padding: 2, border: "1px solid #ddd", borderRadius: 2,background: "lightgray" }}>
      <Typography className="titleHolder" variant="h6" sx={{ marginBottom: 2 }}>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="attendance table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.accessorKey}>{column.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.studentName}</TableCell>
                <TableCell>{row.facultyName}</TableCell>
                <TableCell>{row.semester}</TableCell>
                <TableCell>{`${row.attendanceRate.toFixed(2)}%`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <div className="recDiv" style={{ padding: "20px", maxWidth: "1500px" }}>
      <Typography className="ARholder" variant="h4" sx={{ marginBottom: 4 }}>
        Attendance Recommendations
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {renderTable("Frequent Absenteeism", data.frequentAbsenteeism)}
        {renderTable("Below Average Attendance", data.belowAverageAttendance)}
        {renderTable("Good Attendance", data.goodAttendance)}
      </Box>
    </div>
  );
};

export default Recommendation;
