import React, { createContext, useContext, useState } from 'react';
import Tour from 'reactour';

interface TourContextType {
  isTourOpen: boolean;
  openTour: () => void;
  closeTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const steps = [
  {
    selector: '.tour-dashboard',
    content: 'View your health overview and daily insights',
  },
  {
    selector: '.tour-userinfo',
    content: 'Chat with our AI health assistant and get instant health guidance',
  },
  {
    selector: '.tour-goals',
    content: 'Access and manage your health profile',
  },
  {
    selector: '.tour-appointments',
    content: 'View your health overview and daily insights',
  },
  {
    selector: '.tour-report',
    content: 'View your health overview and daily insights',
  },
  {
    selector: '.tour-mri-scan',
    content: 'View your health overview and daily insights',
  },
  {
    selector: '.tour-chatbot',
    content: 'View your health overview and daily insights',
  },
  {
    selector: '.tour-first-aid',
    content: 'View your health overview and daily insights',
  },
  // Add more tour steps as needed
];

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const openTour = () => setIsTourOpen(true);
  const closeTour = () => setIsTourOpen(false);

  return (
    <TourContext.Provider value={{ isTourOpen, openTour, closeTour }}>
      {children}
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={closeTour}
        accentColor="#2563eb"
        rounded={8}
        className="tour-helper"
      />
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}; 