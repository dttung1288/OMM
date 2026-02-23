import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Contact, Template, Shortcut } from '../types';

interface AppState {
  contacts: Contact[];
  templates: Template[];
  shortcuts: Shortcut[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;
  addTemplate: (template: Omit<Template, 'id'>) => void;
  updateTemplate: (id: string, template: Omit<Template, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  addShortcut: (shortcut: Omit<Shortcut, 'id'>) => void;
  updateShortcut: (id: string, shortcut: Omit<Shortcut, 'id'>) => void;
  deleteShortcut: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('contacts');
    if (saved) return JSON.parse(saved);
    return [
      { id: uuidv4(), name: 'Alice Smith', email: 'alice@example.com' },
      { id: uuidv4(), name: 'Bob Jones', email: 'bob@example.com' }
    ];
  });

  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem('templates');
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: uuidv4(), 
        name: 'Weekly Update', 
        to: '',
        cc: '',
        bcc: '',
        subject: 'Weekly Status Update - [Project Name]', 
        body: 'Hi [Name],<br><br>Here is the status update for this week.<br><br>Best,<br>[Your Name]',
        isHtml: true,
        attachments: []
      },
      { 
        id: uuidv4(), 
        name: 'Follow Up', 
        to: '',
        cc: '',
        bcc: '',
        subject: 'Following up on our last meeting', 
        body: 'Hi [Name],\n\nJust following up on our discussion from last week. Let me know if you need anything else.\n\nThanks,\n[Your Name]',
        isHtml: false,
        attachments: []
      }
    ];
  });

  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
    const saved = localStorage.getItem('shortcuts');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    setContacts([...contacts, { ...contact, id: uuidv4() }]);
  };

  const updateContact = (id: string, contact: Omit<Contact, 'id'>) => {
    setContacts(contacts.map(c => c.id === id ? { ...contact, id } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    // Also remove associated shortcuts
    setShortcuts(shortcuts.filter(s => s.contactId !== id));
  };

  const addTemplate = (template: Omit<Template, 'id'>) => {
    setTemplates([...templates, { ...template, id: uuidv4() }]);
  };

  const updateTemplate = (id: string, template: Omit<Template, 'id'>) => {
    setTemplates(templates.map(t => t.id === id ? { ...template, id } : t));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    // Also remove associated shortcuts
    setShortcuts(shortcuts.filter(s => s.templateId !== id));
  };

  const addShortcut = (shortcut: Omit<Shortcut, 'id'>) => {
    setShortcuts([...shortcuts, { ...shortcut, id: uuidv4() }]);
  };

  const updateShortcut = (id: string, shortcut: Omit<Shortcut, 'id'>) => {
    setShortcuts(shortcuts.map(s => s.id === id ? { ...shortcut, id } : s));
  };

  const deleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider value={{
      contacts, templates, shortcuts,
      addContact, updateContact, deleteContact,
      addTemplate, updateTemplate, deleteTemplate,
      addShortcut, updateShortcut, deleteShortcut
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
