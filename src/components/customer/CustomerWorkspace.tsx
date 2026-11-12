import React, { useState } from 'react';
import {
  Customer,
  WebsiteProject,
  WebsiteContent,
  DocumentItem,
  PictureItem,
  TaskItem,
  ActivityItem,
  CalendarEventItem,
  NoteItem,
  GoalItem,
  StoreConfig,
  ProductItem,
  PackageConfig,
} from '../../types/index.ts';
import {
  Globe,
  FileText,
  Image as ImageIcon,
  CheckSquare,
  Activity as ActivityIcon,
  Calendar as CalendarIcon,
  BookOpen,
  Target,
  ShoppingBag,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  HardDrive,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface Props {
  customer: Customer;
  project?: WebsiteProject;
  content?: WebsiteContent;
  pkg?: PackageConfig;
  documents: DocumentItem[];
  pictures: PictureItem[];
  tasks: TaskItem[];
  activities: ActivityItem[];
  calendarEvents: CalendarEventItem[];
  notes: NoteItem[];
  goals: GoalItem[];
  products: ProductItem[];
  onAddDocument: (doc: Omit<DocumentItem, 'documentId' | 'createdAt'>) => void;
  onAddPicture: (pic: Omit<PictureItem, 'pictureId' | 'createdAt'>) => void;
  onAddTask: (task: Omit<TaskItem, 'taskId' | 'createdAt'>) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onAddActivity: (act: Omit<ActivityItem, 'activityId' | 'createdAt'>) => void;
  onToggleActivity: (actId: string) => void;
  onAddCalendarEvent: (evt: Omit<CalendarEventItem, 'eventId'>) => void;
  onAddNote: (note: Omit<NoteItem, 'noteId' | 'updatedAt'>) => void;
  onAddGoal: (goal: Omit<GoalItem, 'goalId'>) => void;
  onAddProduct: (prod: Omit<ProductItem, 'productId'>) => void;
  onActivateStoreRequest: () => void;
  onOpenLivePreview: () => void;
}

export const CustomerWorkspace: React.FC<Props> = ({
  customer,
  project,
  content,
  pkg,
  documents,
  pictures,
  tasks,
  activities,
  calendarEvents,
  notes,
  goals,
  products,
  onAddDocument,
  onAddPicture,
  onAddTask,
  onToggleTaskStatus,
  onAddActivity,
  onToggleActivity,
  onAddCalendarEvent,
  onAddNote,
  onAddGoal,
  onAddProduct,
  onActivateStoreRequest,
  onOpenLivePreview,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'website'
    | 'documents'
    | 'pictures'
    | 'tasks'
    | 'activities'
    | 'calendar'
    | 'notes'
    | 'goals'
    | 'store'
  >('website');

  // Modal / Form triggers
  const [showDocModal, setShowDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentItem['category']>('personal');

  const [showPicModal, setShowPicModal] = useState(false);
  const [picTitle, setPicTitle] = useState('');
  const [picUrl, setPicUrl] = useState('');
  const [picIsAsset, setPicIsAsset] = useState(true);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskItem['priority']>('medium');
  const [taskDue, setTaskDue] = useState('');

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCategory, setActivityCategory] = useState('Routine');

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');

  const [showProductModal, setShowProductModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(5000);
  const [productStock, setProductStock] = useState(10);
  const [productDesc, setProductDesc] = useState('');

  // Storage calculation
  const storageCapMb = (pkg ? pkg.storageLimitGb : 1) * 1024;
  const storageUsed = customer.storageUsedMb || 120;
  const percentUsed = Math.min(100, Math.round((storageUsed / storageCapMb) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner / Customer Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-xl shrink-0">
            {customer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{customer.name}</h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                {customer.packageId} Plan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal Space · Subdomain: <span className="font-mono text-slate-700">{customer.subdomain}.mpc.ng</span>
            </p>
          </div>
        </div>

        {/* Cloud Storage Gauge */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 w-full md:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cloud Storage</span>
            </span>
            <span className="font-mono text-[11px] tabular-nums">
              {storageUsed} MB / {pkg ? pkg.storageLimitGb : 1} GB
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${percentUsed}%` }} />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-100 rounded-xl text-xs font-medium scrollbar-none">
        {[
          { id: 'website', label: 'My Website', icon: Globe },
          { id: 'documents', label: `My Documents (${documents.length})`, icon: FileText },
          { id: 'pictures', label: `My Pictures (${pictures.length})`, icon: ImageIcon },
          { id: 'tasks', label: `My Tasks (${tasks.length})`, icon: CheckSquare },
          { id: 'activities', label: `My Activities (${activities.length})`, icon: ActivityIcon },
          { id: 'calendar', label: 'My Calendar', icon: CalendarIcon },
          { id: 'notes', label: `My Notes (${notes.length})`, icon: BookOpen },
          { id: 'goals', label: `My Goals (${goals.length})`, icon: Target },
          { id: 'store', label: customer.storeAddonActive ? `My Store (${products.length})` : 'My Store (Add-on)', icon: ShoppingBag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: My Website */}
      {activeTab === 'website' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Managed Website Status</h3>
                <p className="text-xs text-slate-500">
                  Managed centrally by authorized MPC staff
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{project?.status === 'published' ? 'Live & Published' : 'In Fulfillment'}</span>
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="text-slate-500">Live Website Address</div>
                <div className="font-mono text-sm font-bold text-indigo-700 flex items-center gap-2">
                  <span>https://{customer.subdomain}.mpc.ng</span>
                  <button
                    onClick={onOpenLivePreview}
                    className="text-xs text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 font-sans"
                  >
                    Open View <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                  <div className="text-slate-400 text-[10px]">Package Allowance</div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">
                    {pkg ? pkg.pageAllowance : 1} Page(s) Supported
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                  <div className="text-slate-400 text-[10px]">Custom Domain</div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">
                    {pkg?.customDomainSupport ? 'Supported (Contact MPC Staff)' : 'Upgrade to Pro'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-900">Request Website Changes</div>
                <p className="text-slate-500">
                  Need to update your biography, portfolio, phone, or services? Submit a request to your dedicated MPC Content Manager.
                </p>
                <textarea
                  rows={3}
                  placeholder="Describe your desired update or revision..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => alert('Update request dispatched to MPC Content Team!')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-2xs"
                >
                  Send Update Request to MPC Staff
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Site Preview</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden aspect-4/3 bg-slate-50 flex items-center justify-center p-6 text-center">
              <div className="space-y-3">
                <Globe className="w-8 h-8 text-indigo-500 mx-auto" />
                <div className="font-bold text-slate-800 text-sm">{content?.headline || customer.name}</div>
                <p className="text-xs text-slate-500 max-w-xs">{content?.tagline || 'Managed Personal Presence'}</p>
                <button
                  onClick={onOpenLivePreview}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
                >
                  View Full Website
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: My Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Private Document Storage</h3>
              <p className="text-xs text-slate-500">
                Secure cloud vault for credentials, contracts, and business certificates
              </p>
            </div>
            <button
              onClick={() => setShowDocModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Date Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No documents stored yet. Click "Upload Document" to add files.
                    </td>
                  </tr>
                ) : (
                  documents.map((d) => (
                    <tr key={d.documentId} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>{d.title}</span>
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-600">{d.category}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{d.fileSizeKb} KB</td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={d.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: My Pictures */}
      {activeTab === 'pictures' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Personal Cloud Photo Gallery</h3>
              <p className="text-xs text-slate-500">
                Store personal photos and select assets to feature on your website
              </p>
            </div>
            <button
              onClick={() => setShowPicModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pictures.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                No pictures stored yet. Add photographs for your personal cloud and website.
              </div>
            ) : (
              pictures.map((p) => (
                <div key={p.pictureId} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group">
                  <div className="aspect-square bg-slate-100 overflow-hidden relative">
                    <img
                      src={p.photoUrl}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {p.isWebsiteAsset && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold">
                        Website Asset
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-slate-900 text-xs truncate">{p.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.album || 'General'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: My Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Productivity Tasks</h3>
              <p className="text-xs text-slate-500">
                Manage personal priorities and business milestones
              </p>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['todo', 'in_progress', 'completed'] as const).map((col) => {
              const colTasks = tasks.filter((t) => t.status === col);
              return (
                <div key={col} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      {col.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {colTasks.map((t) => (
                      <div
                        key={t.taskId}
                        onClick={() => onToggleTaskStatus(t.taskId)}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer transition-colors space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-semibold text-xs text-slate-900 ${t.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                            {t.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              t.priority === 'high'
                                ? 'bg-red-50 text-red-700'
                                : t.priority === 'medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>
                        {t.dueDate && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(t.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 5: My Activities */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Habit & Activity Tracker</h3>
              <p className="text-xs text-slate-500">
                Log daily routines, physical activities, and personal progress
              </p>
            </div>
            <button
              onClick={() => setShowActivityModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Activity</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            {activities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No activities logged today. Record your first habit or routine.
              </div>
            ) : (
              activities.map((a) => (
                <div
                  key={a.activityId}
                  onClick={() => onToggleActivity(a.activityId)}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={a.completed}
                      onChange={() => {}}
                      className="rounded text-indigo-600 w-4 h-4"
                    />
                    <div>
                      <div className={`font-semibold text-xs text-slate-900 ${a.completed ? 'line-through text-slate-400' : ''}`}>
                        {a.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{a.category} · {a.date}</div>
                    </div>
                  </div>
                  {a.completed && (
                    <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 6: My Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Schedule & Calendar</h3>
              <p className="text-xs text-slate-500">
                Private schedule, client appointments, and key dates
              </p>
            </div>
            <button
              onClick={() => setShowEventModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            {calendarEvents.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No calendar events scheduled. Add consultations or personal appointments.
              </div>
            ) : (
              calendarEvents.map((e) => (
                <div key={e.eventId} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-xs">{e.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {e.startDate} {e.location && `· ${e.location}`}
                    </div>
                  </div>
                  <span className="text-xs text-indigo-700 font-semibold px-2 py-1 rounded bg-indigo-50">
                    Confirmed
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 7: My Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Notes & Memos</h3>
              <p className="text-xs text-slate-500">
                Private thoughts, meeting memos, and strategic drafts
              </p>
            </div>
            <button
              onClick={() => setShowNoteModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {notes.map((n) => (
              <div key={n.noteId} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{n.category}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{n.content}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
                  Updated {new Date(n.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 8: My Goals */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Strategic Goals & Targets</h3>
              <p className="text-xs text-slate-500">
                Track personal targets, business revenue goals, and quarterly milestones
              </p>
            </div>
            <button
              onClick={() => setShowGoalModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((g) => (
              <div key={g.goalId} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{g.title}</span>
                  <span className="text-xs font-mono font-bold text-indigo-700">
                    {g.progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${g.progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Target Date: {g.targetDate}</span>
                  <span className="capitalize font-semibold text-slate-700">{g.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 9: My Store (Add-on Gate / Active Catalog) */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          {!customer.storeAddonActive ? (
            /* Inactive State: Upgrade / Activation Gate */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-2xs max-w-2xl mx-auto text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Activate "My Store" Add-on</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Transform your personal cloud into an e-commerce storefront with product catalog, inventory tracking, and direct WhatsApp ordering.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Monthly Store Add-on Fee:</span>
                  <span className="font-mono text-indigo-700 text-sm">₦10,000 / mo</span>
                </div>
                <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                  <li>Direct WhatsApp one-click order generation</li>
                  <li>Product showcase linked on your live website</li>
                  <li>Inventory management in your private cloud dashboard</li>
                </ul>
              </div>

              <button
                onClick={onActivateStoreRequest}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Request Store Activation from MPC Staff
              </button>
            </div>
          ) : (
            /* Active State: Product Catalog */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">My Store Catalog</h3>
                  <p className="text-xs text-slate-500">
                    Live products available on your storefront with WhatsApp order routing
                  </p>
                </div>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.productId} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-3 p-4">
                    <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                    <p className="text-xs text-slate-500">{p.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-mono">
                      <span className="font-bold text-slate-900 text-sm">₦{p.priceNgn.toLocaleString()}</span>
                      <span className="text-xs text-slate-500">Stock: {p.inventory}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals for Quick Data Add */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Upload Document Record</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Practicing License 2026.pdf"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  <option value="credentials">Credentials & Licenses</option>
                  <option value="contracts">Contracts & Agreements</option>
                  <option value="business">Business Certificates</option>
                  <option value="personal">Personal Documents</option>
                  <option value="financial">Financial Statements</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowDocModal(false)} className="px-3 py-1.5 text-xs text-slate-600">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (docTitle) {
                    onAddDocument({
                      customerId: customer.customerId,
                      title: docTitle,
                      category: docCategory,
                      fileUrl: '#',
                      fileSizeKb: 450,
                      mimeType: 'application/pdf',
                    });
                    setDocTitle('');
                    setShowDocModal(false);
                  }
                }}
                className="px-4 py-1.5 text-xs bg-indigo-600 text-white rounded-lg font-medium"
              >
                Save Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Task</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Review legal brief for Monday meeting"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowTaskModal(false)} className="px-3 py-1.5 text-xs text-slate-600">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (taskTitle) {
                    onAddTask({
                      customerId: customer.customerId,
                      title: taskTitle,
                      priority: taskPriority,
                      status: 'todo',
                      dueDate: taskDue || new Date().toISOString(),
                    });
                    setTaskTitle('');
                    setShowTaskModal(false);
                  }
                }}
                className="px-4 py-1.5 text-xs bg-indigo-600 text-white rounded-lg font-medium"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
