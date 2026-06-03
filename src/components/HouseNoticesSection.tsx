import { useState, FormEvent } from 'react';
import { Megaphone, Plus, Trash2, Edit3, X, Check, AlertTriangle, Info, ShieldAlert, Printer, Search } from 'lucide-react';
import { Notice } from '../types.js';

interface HouseNoticesSectionProps {
  notices: Notice[];
  isAdmin: boolean;
  onAddNotice: (notice: Omit<Notice, 'id' | 'date'>) => Promise<void>;
  onDeleteNotice: (id: string) => Promise<void>;
  onEditNotice: (id: string, notice: Partial<Notice>) => Promise<void>;
}

export default function HouseNoticesSection({
  notices,
  isAdmin,
  onAddNotice,
  onDeleteNotice,
  onEditNotice
}: HouseNoticesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Form states for ADD notice
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newPriority, setNewPriority] = useState('medium');

  // Form states for EDIT notice
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('general');
  const [editPriority, setEditPriority] = useState('medium');

  const filteredNotices = notices.filter((notice) => {
    const titleMatch = notice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const contentMatch = notice.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const dateMatch = notice.date?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const matchesSearch = titleMatch || contentMatch || dateMatch;

    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || notice.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    await onAddNotice({
      title: newTitle,
      content: newContent,
      category: newCategory,
      priority: newPriority
    });

    setNewTitle('');
    setNewContent('');
    setNewCategory('general');
    setNewPriority('medium');
    setIsAdding(false);
  };

  const startEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setEditTitle(notice.title);
    setEditContent(notice.content);
    setEditCategory(notice.category || 'general');
    setEditPriority(notice.priority || 'medium');
  };

  const handleEditSubmit = async (e: FormEvent, id: string) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;

    await onEditNotice(id, {
      title: editTitle,
      content: editContent,
      category: editCategory,
      priority: editPriority
    });

    setEditingId(null);
  };

  // Badge styles helpers
  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water':
        return '💧';
      case 'gas':
        return '🔥';
      case 'rent':
        return '💵';
      case 'security':
        return '🛡️';
      default:
        return '📢';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner / Header */}
      <div className="rounded-xl bg-white p-6 border border-[#D0E8F4] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in print:shadow-none print:border-none print:p-0">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#D94444] border border-red-100 shrink-0 print:hidden">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#1A2A3A] font-serif">House Notices</h1>
            <p className="text-xs text-[#4A6075] mt-1 max-w-xl print:text-xs">
              Stay updated with the official maintenance cycles, gas inspections, power grid regulations, and security updates of Kabir Villa.
            </p>
          </div>
        </div>

        {/* Action Buttons Panel */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap print:hidden">
          {/* Print Notice Board Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-3xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print Board</span>
          </button>

          {/* Admin Action Button */}
          {isAdmin && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-1.5 bg-[#4AA8D8] hover:bg-[#2E90C4] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{isAdding ? 'Cancel' : 'Create Notice'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Notice Form (Only for Admin) */}
      {isAdmin && isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-white rounded-xl border border-red-150 p-6 shadow-sm space-y-4 animate-fade-in print:hidden">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <h2 className="text-sm font-bold text-slate-800">Publish New Notice (Admin Panel)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notice Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Roof-Terrace Key Handback Policy"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="general">📢 General</option>
                  <option value="water">💧 Water Sys</option>
                  <option value="gas">🔥 Gas Utility</option>
                  <option value="rent">💵 Rent & Utilities</option>
                  <option value="security">🛡️ Security Check</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notice content text</label>
            <textarea
              required
              rows={4}
              placeholder="Provide a detailed official message for the residents here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#D94444] hover:bg-[#BE2B2B] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Broadcast Notice
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between print:hidden">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search notices by keywords (title/body) or dates (e.g. 2026)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pl-9 focus:outline-hidden focus:bg-white focus:border-[#4AA8D8] text-slate-800 transition-colors"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-hidden focus:bg-white focus:border-[#4AA8D8] text-slate-700 font-semibold w-full sm:w-auto"
          >
            <option value="all">📁 All Categories</option>
            <option value="general">📢 General</option>
            <option value="water">💧 Water Sys</option>
            <option value="gas">🔥 Gas Utility</option>
            <option value="rent">💵 Rent & Utilities</option>
            <option value="security">🛡️ Security Check</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-hidden focus:bg-white focus:border-[#4AA8D8] text-slate-700 font-semibold w-full sm:w-auto"
          >
            <option value="all">⚠️ All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          {(searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedPriority('all');
              }}
              className="text-xs font-bold text-[#D94444] hover:text-[#BE2B2B] whitespace-nowrap cursor-pointer px-1 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Notices Grid / List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => {
            const isEditing = editingId === notice.id;

            if (isEditing) {
              return (
                <form
                  key={notice.id}
                  onSubmit={(e) => handleEditSubmit(e, notice.id)}
                  className="bg-slate-50 rounded-xl border-2 border-dashed border-[#4AA8D8] p-5 space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-sky-600 flex items-center gap-1">
                      <Edit3 className="h-4 w-4" /> Editing Notice Details
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-slate-400 hover:text-slate-650"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400">Notice Title</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400">Category</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-hidden"
                        >
                          <option value="general">📢 General</option>
                          <option value="water">💧 Water Sys</option>
                          <option value="gas">🔥 Gas Utility</option>
                          <option value="rent">💵 Rent & Utilities</option>
                          <option value="security">🛡️ Security Check</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400">Priority</label>
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-hidden"
                        >
                          <option value="low">🟢 Low</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="high">🔴 High</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400">Content Body</label>
                    <textarea
                      required
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 border border-slate-200 text-slate-505 rounded-md text-xs font-semibold hover:bg-white cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-[#4AA8D8] text-white rounded-md text-xs font-bold hover:bg-[#2E90C4] flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" /> Save Changes
                    </button>
                  </div>
                </form>
              );
            }

            return (
              <div
                key={notice.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 justify-between items-start print:shadow-none print:border-slate-300 print:break-inside-avoid print:p-4"
              >
                <div className="space-y-2 max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base">{getCategoryIcon(notice.category || 'general')}</span>
                    <h3 className="font-serif text-sm font-extrabold text-[#1A2A3A] hover:text-[#4AA8D8] duration-150 print:text-sm print:text-slate-900">
                      {notice.title}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border rounded-full ${getPriorityBadge(notice.priority || 'medium')}`}>
                      {notice.priority || 'medium'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      📅 {notice.date}
                    </span>
                  </div>

                  <p className="text-xs text-[#4A6075] whitespace-pre-line leading-relaxed font-semibold print:text-slate-800">
                    {notice.content}
                  </p>
                </div>

                {/* Edit & Delete Action Panel (Admin ONLY) */}
                {isAdmin && (
                  <div className="flex md:flex-col lg:flex-row gap-1.5 shrink-0 self-end md:self-start pt-2 md:pt-0 print:hidden">
                    <button
                      onClick={() => startEdit(notice)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 border border-teal-100 cursor-pointer transition-colors"
                      title="Edit Notice"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you absolutely sure you want to delete this bulletin notice permanently?')) {
                          onDeleteNotice(notice.id);
                        }
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-[#D94444] border border-red-100 cursor-pointer transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 rounded-xl bg-white border border-slate-200 text-slate-400">
            <Info className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs italic font-medium">
              {notices.length === 0 
                ? "No official bulletin notices have been published yet." 
                : "No announcements match your search or filters."}
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedPriority('all');
                }}
                className="mt-3 inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-250 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer transition-colors"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
