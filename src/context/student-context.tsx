
'use client';

import { getParentsAndChildrenAction } from '@/app/portal/actions';
import { createContext, useState, ReactNode, useContext, useMemo, useEffect } from 'react';

type Student = {
    id: string;
    name: string;
    avatar?: string | null;
};

type Parent = {
    id: string;
    name: string;
    children: Student[];
}

type StudentContextType = {
  selectedParent: Parent | null;
  setSelectedParent: (parent: Parent) => void;
  availableParents: Parent[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  availableStudents: Student[];
  isLoading: boolean;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [availableParents, setAvailableParents] = useState<Parent[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getParentsAndChildrenAction();
      
      if (result.success && result.parents) {
        const formattedParents: Parent[] = result.parents.map(p => ({
            id: p.id,
            name: `${p.user.firstName} ${p.user.lastName}`,
            children: p.students.map(s => ({
                id: s.id,
                name: `${s.user.firstName} ${s.user.lastName}`,
                avatar: s.user.photoUrl
            }))
        }));

        setAvailableParents(formattedParents);
        if (formattedParents.length > 0) {
          const firstParent = formattedParents[0];
          setSelectedParent(firstParent);
          if (firstParent.children.length > 0) {
            setSelectedStudent(firstParent.children[0]);
          }
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSetSelectedParent = (parent: Parent) => {
    setSelectedParent(parent);
    if (parent && parent.children.length > 0) {
      setSelectedStudent(parent.children[0]);
    } else {
      setSelectedStudent(null);
    }
  };

  const availableStudents = selectedParent?.children || [];

  const value = useMemo(() => ({
    selectedParent,
    setSelectedParent: handleSetSelectedParent,
    availableParents,
    selectedStudent,
    setSelectedStudent,
    availableStudents,
    isLoading,
  }), [selectedParent, availableParents, selectedStudent, availableStudents, isLoading]);

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
