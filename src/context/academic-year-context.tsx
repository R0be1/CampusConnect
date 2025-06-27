
'use client';

import { createContext, useState, ReactNode, useContext } from 'react';

// Mock data, as it's not coming from a central place yet.
const academicYears = ["2024-2025", "2023-2024"];

type AcademicYearContextType = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: string[];
};

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(undefined);

export function AcademicYearProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState<string>(academicYears[0]);

  return (
    <AcademicYearContext.Provider value={{ selectedYear, setSelectedYear, availableYears: academicYears }}>
      {children}
    </AcademicYearContext.Provider>
  );
}

export function useAcademicYear() {
  const context = useContext(AcademicYearContext);
  if (context === undefined) {
    throw new Error('useAcademicYear must be used within an AcademicYearProvider');
  }
  return context;
}
