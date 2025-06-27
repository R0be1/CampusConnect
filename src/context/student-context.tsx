'use client';

import { createContext, useState, ReactNode, useContext, useMemo } from 'react';

// Mock data for parent's children
const studentsData = [
  { id: 's001', name: 'John Doe' },
  { id: 's002', name: 'Alice Smith' },
];

type Student = {
    id: string;
    name: string;
};

type StudentContextType = {
  selectedStudent: Student;
  setSelectedStudent: (student: Student) => void;
  availableStudents: Student[];
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [selectedStudent, setSelectedStudent] = useState<Student>(studentsData[0]);

  const value = useMemo(() => ({
      selectedStudent,
      setSelectedStudent,
      availableStudents: studentsData
  }), [selectedStudent]);

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
