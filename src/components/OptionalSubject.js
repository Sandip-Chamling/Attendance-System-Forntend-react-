import React, { useState, useEffect } from 'react';

const OptionalSubjects = ({ program, selectedSubjects, setSelectedSubjects }) => {
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    const subjects = getSubjectsByProgram(program);
    setAvailableSubjects(subjects);
  }, [program]);

  const getSubjectsByProgram = (program) => {
    switch (program) {
      case 'Bachelor Of Computer Application':
        return ['Mathematics', 'Physics', 'Computer Science', 'Statistics', 'Economics'];
      case 'Bachelor in Business Studies':
        return ['Accounting', 'Economics', 'Marketing', 'Finance', 'Management'];
      case 'Bachelor in Business Management':
        return ['Human Resources', 'Marketing', 'Economics', 'Finance', 'Operations'];
      case 'Bachelor in Arts':
        return ['History', 'Political Science', 'Sociology', 'Psychology', 'Economics'];
      case 'Bachelor in Business Administration':
        return ['Management', 'Accounting', 'Marketing', 'Finance', 'Economics'];
      default:
        return [];
    }
  };

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));//toogle
    } else {
      if (selectedSubjects.length < 3) {
        setSelectedSubjects([...selectedSubjects, subject]);
      }
    }
  };
  const isPlaceholderVisible = !program || availableSubjects.length === 0;

  return (
    <div className="checkbox-container">
        <label className="option"><strong>Optional Subjects:</strong></label>
        {isPlaceholderVisible && (
        <div className="placeholder-text">Select program for optional subjects</div>
      )}
      {availableSubjects.map((subject) => (
        <div key={subject}>
          <input
          className="checkBox"
            type="checkbox"
            name="optionalSubject"
            value={subject}
            checked={selectedSubjects.includes(subject)}
            onChange={handleSubjectChange}
            disabled={!selectedSubjects.includes(subject) && selectedSubjects.length >= 3}
            required
          />
          <label>{subject}</label>
        </div>
      ))}
    </div>
  );
};

export default OptionalSubjects;
