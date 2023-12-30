import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '@auth0/auth0-react';


type StudentContextType = {
  selectedStudent: User | null;
  setSelectedStudent: (user: User | null) => void;
};

const StudentContext = createContext<StudentContextType | null>(null);

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

type StudentProviderProps = {
  children: ReactNode;
};

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  return (
    <StudentContext.Provider value={{ selectedStudent, setSelectedStudent }}>
      {children}
    </StudentContext.Provider>
  );
};
