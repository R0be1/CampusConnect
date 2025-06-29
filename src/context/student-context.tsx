
'use client';

import { getStudentsForParentPortal } from "@/lib/data";
import { createContext, useState, ReactNode, useContext, useMemo, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Student = {
    id: string;
    name: string;
    avatar?: string | null;
};

type StudentContextType = {
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  availableStudents: Student[];
  isLoading: boolean;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      const response = await getStudentsForParentPortal();
      
      const formattedStudents = response.map(s => ({
        id: s.id,
        name: `${s.user.firstName} ${s.user.lastName}`,
        avatar: s.user.photoUrl
      }));

      setAvailableStudents(formattedStudents);
      if (formattedStudents.length > 0) {
        setSelectedStudent(formattedStudents[0]);
      }
      setIsLoading(false);
    };
    fetchStudents();
  }, []);

  const value = useMemo(() => ({
    selectedStudent,
    setSelectedStudent,
    availableStudents,
    isLoading,
  }), [selectedStudent, availableStudents, isLoading]);

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
