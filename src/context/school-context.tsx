
'use client';

import { createContext, useState, ReactNode, useContext, useMemo } from 'react';

// For this prototype, we'll hardcode the current school.
// In a real application, this would be determined after login.
const schoolData = { 
  id: 'sch-01', 
  name: 'Greenwood High',
  accountName: 'greenwood-high',
  branch: 'Main Campus', 
  logoUrl: 'https://static.vecteezy.com/system/resources/previews/022/530/575/non_2x/school-building-exterior-vector-illustration-png.png' 
};

type School = {
    id: string;
    name: string;
    accountName: string;
    branch: string;
    logoUrl: string;
};

type SchoolContextType = {
  currentSchool: School;
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: ReactNode }) {
  // This state would be dynamic in a real app
  const [currentSchool, setCurrentSchool] = useState<School>(schoolData);

  const value = useMemo(() => ({
      currentSchool,
  }), [currentSchool]);

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}
