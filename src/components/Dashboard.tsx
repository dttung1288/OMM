import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Plus, Trash2, ExternalLink, Download } from 'lucide-react';
import { generateEml, downloadEml } from '../utils/emlGenerator';
import { Contact, Template } from '../types';

export const Dashboard: React.FC = () => {
  const { contacts, templates, shortcuts, addShortcut, deleteShortcut } = useAppContext();
  const [selectedContact, setSelectedContact] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [shortcutName, setShortcutName] = useState('');

  const handleQuickSend = () => {
    if (!selectedContact || !selectedTemplate) return;
    const contact = contacts.find(c => c.id === selectedContact);
    const template = templates.find(t => t.id === selectedTemplate);
    if (!contact || !template) return;

    openOutlook(contact, template);
  };

  const handleSaveShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortcutName || !selectedContact || !selectedTemplate) return;
    addShortcut({
      name: shortcutName,
      contactId: selectedContact,
      templateId: selectedTemplate
    });
    setShortcutName('');
  };

  const openOutlook = (contact: Contact, template: Template) => {
    // Combine contact email with template's default To, CC, BCC
    const to = template.to ? `${contact.email}, ${template.to}` : contact.email;
    const cc = template.cc || '';
    const bcc = template.bcc || '';
    
    // Replace placeholders in subject and body
    const subject = template.subject.replace(/\[Name\]/g, contact.name);
    const body = template.body.replace(/\[Name\]/g, contact.name);

    // Generate EML content
    const emlContent = generateEml(
      to,
      cc,
      bcc,
      subject,
      body,
      template.isHtml,
      template.attachments || []
    );

    // Download the EML file which opens in Outlook
    downloadEml(emlContent, `Draft - ${subject.substring(0, 30)}`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Dashboard</h2>
          <p className="text-zinc-500 mt-1">Quickly generate Outlook drafts with rich text and attachments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Send Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 sticky top-8">
            <h3 className="text-lg font-medium text-zinc-900 mb-6 flex items-center gap-2">
              <Send size={20} className="text-indigo-600" />
              Quick Send
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Select Contact</label>
                <select
                  value={selectedContact}
                  onChange={(e) => setSelectedContact(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="">-- Choose a contact --</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Select Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="">-- Choose a template --</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleQuickSend}
                disabled={!selectedContact || !selectedTemplate}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                <Download size={18} />
                Generate Outlook Draft
              </button>

              <div className="pt-6 mt-6 border-t border-zinc-100">
                <h4 className="text-sm font-medium text-zinc-900 mb-3">Save as Shortcut</h4>
                <form onSubmit={handleSaveShortcut} className="flex gap-2">
                  <input
                    type="text"
                    value={shortcutName}
                    onChange={(e) => setShortcutName(e.target.value)}
                    placeholder="Shortcut Name"
                    className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!shortcutName || !selectedContact || !selectedTemplate}
                    className="px-3 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title="Save Shortcut"
                  >
                    <Plus size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Shortcuts Grid */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium text-zinc-900 mb-6">Saved Shortcuts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut) => {
              const contact = contacts.find(c => c.id === shortcut.contactId);
              const template = templates.find(t => t.id === shortcut.templateId);
              
              if (!contact || !template) return null;

              return (
                <div key={shortcut.id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm group hover:border-indigo-300 hover:shadow-md transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-zinc-900 text-lg">{shortcut.name}</h4>
                    <button
                      onClick={() => deleteShortcut(shortcut.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Shortcut"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-16 text-zinc-500 font-medium">To:</span>
                      <span className="text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md font-medium">{contact.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-16 text-zinc-500 font-medium">Template:</span>
                      <span className="text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md font-medium truncate">{template.name}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openOutlook(contact, template)}
                    className="w-full mt-5 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Generate Draft
                  </button>
                </div>
              );
            })}
            
            {shortcuts.length === 0 && (
              <div className="col-span-full text-center py-16 text-zinc-500 bg-zinc-50/50 rounded-2xl border border-zinc-200 border-dashed">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-zinc-100">
                  <Plus size={24} className="text-zinc-400" />
                </div>
                <p className="font-medium text-zinc-900 mb-1">No shortcuts yet</p>
                <p className="text-sm">Create a shortcut from the Quick Send panel to save time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
