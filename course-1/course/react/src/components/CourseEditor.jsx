import React, { useState } from 'react';
import { X, Plus, Trash2, Video, FileText, ChevronDown, ChevronUp, Save, GripVertical, Edit2, Check } from 'lucide-react';
import { useToast } from './Toast';
import useCourseStore from '../store/courseStore';

const toEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) return url;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = url.match(/[?&]v=([^?&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return url;
};

const emptyLesson = () => ({
  id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: '',
  duration: '',
  free: false,
  type: 'video',
  videoUrl: '',
  note: '',
});

const emptySection = () => ({
  id: `sec-${Date.now()}`,
  title: '',
  lessons: [emptyLesson()],
});

const CourseEditor = ({ course, onClose }) => {
  const { showToast } = useToast();
  const { updateCourse } = useCourseStore();

  // Initialise sections from course.sections or build from freeContent/paidContent
  const initSections = () => {
    if (course.sections?.length) return JSON.parse(JSON.stringify(course.sections));
    return [
      {
        id: 'sec-free',
        title: 'Getting Started',
        lessons: (course.freeContent || []).map((t, i) => ({
          id: `free-${i}`, title: t, duration: '8:00', free: true,
          type: 'video', videoUrl: i === 0 ? (course.videoUrl || '') : '', note: '',
        })),
      },
      {
        id: 'sec-paid',
        title: 'Full Course',
        lessons: (course.paidContent || []).map((t, i) => ({
          id: `paid-${i}`, title: t, duration: '12:00', free: false,
          type: 'video', videoUrl: '', note: '',
        })),
      },
    ].filter(s => s.lessons.length > 0);
  };

  const [sections, setSections] = useState(initSections);
  const [expanded, setExpanded] = useState(0);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // ── Section helpers ──────────────────────────────────────────────
  const addSection = () => {
    const s = emptySection();
    setSections(prev => [...prev, s]);
    setExpanded(sections.length);
  };

  const removeSection = (si) => {
    if (sections.length === 1) { showToast('At least one section required', 'error'); return; }
    setSections(prev => prev.filter((_, i) => i !== si));
  };

  const updateSectionTitle = (si, val) =>
    setSections(prev => prev.map((s, i) => i === si ? { ...s, title: val } : s));

  // ── Lesson helpers ───────────────────────────────────────────────
  const addLesson = (si) =>
    setSections(prev => prev.map((s, i) => i === si ? { ...s, lessons: [...s.lessons, emptyLesson()] } : s));

  const removeLesson = (si, li) =>
    setSections(prev => prev.map((s, i) => i === si
      ? { ...s, lessons: s.lessons.filter((_, j) => j !== li) }
      : s));

  const updateLesson = (si, li, field, val) =>
    setSections(prev => prev.map((s, i) => i === si
      ? { ...s, lessons: s.lessons.map((l, j) => j === li ? { ...l, [field]: val } : l) }
      : s));

  // ── Save ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    // Validate: every section needs a title, every lesson needs a title
    for (const s of sections) {
      if (!s.title.trim()) { showToast('All sections need a title', 'error'); return; }
      for (const l of s.lessons) {
        if (!l.title.trim()) { showToast('All lessons need a title', 'error'); return; }
      }
    }
    setSaving(true);
    // Convert all video URLs to embed format
    const cleaned = sections.map(s => ({
      ...s,
      lessons: s.lessons.map(l => ({ ...l, videoUrl: toEmbedUrl(l.videoUrl) || '' })),
    }));
    await new Promise(r => setTimeout(r, 400));
    updateCourse(course.id, { sections: cleaned });
    setSaving(false);
    showToast('✅ Course content saved!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-gray-700/50">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">Edit Course Content</h2>
            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{course.title}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving…' : 'Save'}</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {sections.map((section, si) => (
            <div key={section.id} className="bg-gray-800/60 rounded-2xl border border-gray-700/50 overflow-hidden">

              {/* Section header */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-800/80">
                <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {si + 1}
                </div>

                {editingSection === si ? (
                  <input
                    autoFocus
                    value={section.title}
                    onChange={e => updateSectionTitle(si, e.target.value)}
                    onBlur={() => setEditingSection(null)}
                    onKeyDown={e => e.key === 'Enter' && setEditingSection(null)}
                    className="flex-1 bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm border border-blue-500 focus:outline-none"
                    placeholder="Section title"
                  />
                ) : (
                  <span
                    className="flex-1 text-white font-semibold text-sm cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => setEditingSection(si)}
                  >
                    {section.title || <span className="text-gray-500 italic">Untitled Section</span>}
                  </span>
                )}

                <span className="text-gray-500 text-xs">{section.lessons.length} lessons</span>
                <button onClick={() => setEditingSection(si)} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-gray-700 transition-all">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setExpanded(expanded === si ? -1 : si)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700 transition-all">
                  {expanded === si ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={() => removeSection(si)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lessons */}
              {expanded === si && (
                <div className="divide-y divide-gray-700/40">
                  {section.lessons.map((lesson, li) => (
                    <div key={lesson.id} className="p-4 space-y-3">

                      {/* Lesson row 1: title + free toggle + delete */}
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs">{li + 1}</span>
                        </div>
                        <input
                          value={lesson.title}
                          onChange={e => updateLesson(si, li, 'title', e.target.value)}
                          placeholder="Lesson title"
                          className="flex-1 bg-gray-700/60 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          value={lesson.duration}
                          onChange={e => updateLesson(si, li, 'duration', e.target.value)}
                          placeholder="e.g. 12:30"
                          className="w-20 bg-gray-700/60 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500 focus:outline-none text-center"
                        />
                        <label className="flex items-center space-x-1.5 cursor-pointer flex-shrink-0">
                          <div
                            onClick={() => updateLesson(si, li, 'free', !lesson.free)}
                            className={`w-9 h-5 rounded-full transition-colors relative ${lesson.free ? 'bg-green-500' : 'bg-gray-600'}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${lesson.free ? 'translate-x-4' : 'translate-x-0.5'}`} />
                          </div>
                          <span className="text-xs text-gray-400">Free</span>
                        </label>
                        <button onClick={() => removeLesson(si, li)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Lesson row 2: video URL */}
                      <div className="flex items-center space-x-2 pl-8">
                        <Video className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <input
                          value={lesson.videoUrl}
                          onChange={e => updateLesson(si, li, 'videoUrl', e.target.value)}
                          placeholder="YouTube URL for this lesson (e.g. https://youtube.com/watch?v=...)"
                          className="flex-1 bg-gray-700/60 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      {/* Lesson row 3: notes */}
                      <div className="flex items-start space-x-2 pl-8">
                        <FileText className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-2" />
                        <textarea
                          value={lesson.note}
                          onChange={e => updateLesson(si, li, 'note', e.target.value)}
                          placeholder="Lesson notes (shown to enrolled students below the video)"
                          rows={2}
                          className="flex-1 bg-gray-700/60 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-yellow-500 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add lesson */}
                  <div className="px-4 py-3">
                    <button
                      onClick={() => addLesson(si)}
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Lesson</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add section */}
          <button
            onClick={addSection}
            className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-gray-700 hover:border-blue-500 text-gray-500 hover:text-blue-400 py-4 rounded-2xl transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
