import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Edit2, Trash2, FileText, Paperclip, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import DefaultEditor from 'react-simple-wysiwyg';
import { Attachment } from '../types';

export const Templates: React.FC = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useAppContext();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', to: '', cc: '', bcc: '', subject: '', body: '', isHtml: true, attachments: [] as Attachment[] 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.body) return;

    if (isEditing) {
      updateTemplate(isEditing, formData);
      setIsEditing(null);
    } else {
      addTemplate(formData);
    }
    setFormData({ name: '', to: '', cc: '', bcc: '', subject: '', body: '', isHtml: true, attachments: [] });
  };

  const handleEdit = (template: any) => {
    setIsEditing(template.id);
    setFormData({ 
      name: template.name, 
      to: template.to || '', 
      cc: template.cc || '', 
      bcc: template.bcc || '', 
      subject: template.subject, 
      body: template.body,
      isHtml: template.isHtml ?? true,
      attachments: template.attachments || []
    });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ name: '', to: '', cc: '', bcc: '', subject: '', body: '', isHtml: true, attachments: [] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAttachment: Attachment = {
            id: uuidv4(),
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target.result as string
          };
          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, newAttachment]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== id)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Templates</h2>
          <p className="text-zinc-500 mt-1">Create reusable email templates with rich text and attachments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 mb-8">
        <h3 className="text-lg font-medium text-zinc-900 mb-4">
          {isEditing ? 'Edit Template' : 'Create New Template'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Template Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g., Weekly Report"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Email Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g., Project Update - [Date]"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Default To (Optional)</label>
              <input
                type="text"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Default CC (Optional)</label>
              <input
                type="text"
                value={formData.cc}
                onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="cc@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Default BCC (Optional)</label>
              <input
                type="text"
                value={formData.bcc}
                onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="bcc@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-zinc-700">Email Body</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Rich Text</span>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isHtml: !prev.isHtml }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.isHtml ? 'bg-indigo-600' : 'bg-zinc-300'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${formData.isHtml ? 'translate-x-4.5' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            
            {formData.isHtml ? (
              <div className="border border-zinc-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <DefaultEditor 
                  value={formData.body} 
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })} 
                  className="min-h-[200px] w-full"
                />
              </div>
            ) : (
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[200px] font-mono text-sm"
                placeholder="Hi [Name],&#10;&#10;Here is the update...&#10;&#10;Best,&#10;[Your Name]"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Attachments</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {formData.attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm">
                  <Paperclip size={14} className="text-zinc-500" />
                  <span className="truncate max-w-[150px] font-medium text-zinc-700">{att.name}</span>
                  <span className="text-xs text-zinc-400">({formatFileSize(att.size)})</span>
                  <button 
                    type="button" 
                    onClick={() => removeAttachment(att.id)}
                    className="ml-1 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-zinc-50 text-zinc-700 border border-zinc-300 rounded-xl hover:bg-zinc-100 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Paperclip size={16} />
              Add Attachment
            </button>
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-zinc-100 mt-6">
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium flex items-center gap-2"
            >
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
              {isEditing ? 'Update Template' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col group hover:border-indigo-200 transition-all hover:shadow-md overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex justify-between items-start bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText size={20} />
                </div>
                <h4 className="font-semibold text-zinc-900 truncate max-w-[180px]">{template.name}</h4>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(template)}
                  className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-3">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Subject</span>
                <p className="text-sm font-medium text-zinc-800 mt-0.5 truncate">{template.subject}</p>
              </div>
              
              {(template.to || template.cc || template.bcc) && (
                <div className="mb-3 space-y-1">
                  {template.to && <div className="text-xs text-zinc-600 truncate"><span className="font-medium text-zinc-400">To:</span> {template.to}</div>}
                  {template.cc && <div className="text-xs text-zinc-600 truncate"><span className="font-medium text-zinc-400">CC:</span> {template.cc}</div>}
                  {template.bcc && <div className="text-xs text-zinc-600 truncate"><span className="font-medium text-zinc-400">BCC:</span> {template.bcc}</div>}
                </div>
              )}

              {template.attachments && template.attachments.length > 0 && (
                <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md w-fit">
                  <Paperclip size={12} />
                  {template.attachments.length} Attachment{template.attachments.length !== 1 ? 's' : ''}
                </div>
              )}

              <div className="flex-1">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Body Preview</span>
                <div className="text-sm text-zinc-600 mt-0.5 line-clamp-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100 mt-2 h-[80px] overflow-hidden">
                  {template.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: template.body }} className="prose prose-sm max-w-none" />
                  ) : (
                    <p className="font-mono whitespace-pre-wrap">{template.body}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full text-center py-16 text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
            No templates yet. Create your first template above.
          </div>
        )}
      </div>
    </div>
  );
};
