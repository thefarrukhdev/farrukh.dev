"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ContactContextType {
  isOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
}

const ContactContext = createContext<ContactContextType>({
  isOpen: false,
  openContact: () => {},
  closeContact: () => {},
});

export function ContactProvider({ children }: { children: ReactNode }): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContactContext.Provider
      value={{
        isOpen,
        openContact: () => setIsOpen(true),
        closeContact: () => setIsOpen(false),
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export function useContact(): ContactContextType {
  return useContext(ContactContext);
}
