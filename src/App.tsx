/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Contacts } from './components/Contacts';
import { Templates } from './components/Templates';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <AppProvider>
      <div className="flex h-screen bg-zinc-50 font-sans overflow-hidden">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'contacts' && <Contacts />}
          {currentTab === 'templates' && <Templates />}
        </main>
      </div>
    </AppProvider>
  );
}
