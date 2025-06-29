
'use client';

import { getParentsAndChildrenAction } from '@/app/portal/actions';
import { getFirstSchool, getStudentsWithDetails } from '@/lib/data';
import { createContext, useState, ReactNode, useContext, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Student = {
    id: string;
    name: string;
    avatar: string;
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
  const pathname = usePathname();
  const isParentPortal = pathname.startsWith('/portal');

  const [availableParents, setAvailableParents] = useState<Parent[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      if (isParentPortal) {
          const result = await getParentsAndChildrenAction();
          if (result.success && result.parents) {
              const formattedParents: Parent[] = result.parents.map(p => ({
                  id: p.id,
                  name: `${p.user.firstName} ${p.user.lastName}`,
                  children: p.students.map(s => ({
                      id: s.id,
                      name: `${s.user.firstName} ${s.user.lastName}`,
                      avatar: s.user.photoUrl || `https://placehold.co/40x40.png`
                  }))
              }));
              setAvailableParents(formattedParents);
              if (formattedParents.length > 0) {
                  const firstParent = formattedParents[0];
                  setSelectedParent(firstParent);
                  setAvailableStudents(firstParent.children);
                  if (firstParent.children.length > 0) {
                      setSelectedStudent(firstParent.children[0]);
                  } else {
                      setSelectedStudent(null);
                  }
              } else {
                  setSelectedParent(null);
                  setAvailableStudents([]);
                  setSelectedStudent(null);
              }
          }
      } else { // Logic for the Student Portal (and others if needed)
           const school = await getFirstSchool();
           if (school) {
               // For demo purposes, we'll allow switching between all students in the student portal
               const students = await getStudentsWithDetails(school.id);
               const formattedStudents: Student[] = students.map(s => ({
                   id: s.id,
                   name: `${s.firstName} ${s.lastName}`,
                   avatar: s.user.photoUrl || `https://placehold.co/40x40.png`
               }));
               setAvailableStudents(formattedStudents);
               if (formattedStudents.length > 0) {
                   setSelectedStudent(formattedStudents[0]);
               } else {
                   setSelectedStudent(null);
               }
           }
           setAvailableParents([]);
           setSelectedParent(null);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [isParentPortal]);

  const handleSetSelectedParent = (parent: Parent) => {
    setSelectedParent(parent);
    setAvailableStudents(parent.children);
    if (parent.children.length > 0) {
      setSelectedStudent(parent.children[0]);
    } else {
      setSelectedStudent(null);
    }
  };

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
