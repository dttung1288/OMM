import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Edit2, Trash2, Mail } from 'lucide-react';

export const Contacts: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact } = useAppContext();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (isEditing) {
      updateContact(isEditing, formData);
      setIsEditing(null);
    } else {
      addContact(formData);
    }
    setFormData({ name: '', email: '' });
  };

  const handleEdit = (contact: any) => {
    setIsEditing(contact.id);
    setFormData({ name: contact.name, email: contact.email });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ name: '', email: '' });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Contacts</h2>
          <p className="text-zinc-500 mt-1">Manage people you frequently email.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 mb-8">
        <h3 className="text-lg font-medium text-zinc-900 mb-4">
          {isEditing ? 'Edit Contact' : 'Add New Contact'}
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium flex items-center gap-2 h-[42px]"
            >
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
              {isEditing ? 'Update' : 'Add'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors font-medium h-[42px]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex justify-between items-center group hover:border-indigo-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium text-zinc-900">{contact.name}</h4>
                <div className="flex items-center text-sm text-zinc-500 mt-0.5">
                  <Mail size={14} className="mr-1.5" />
                  {contact.email}
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(contact)}
                className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteContact(contact.id)}
                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
            No contacts yet. Add your first contact above.
          </div>
        )}
      </div>
    </div>
  );
};
