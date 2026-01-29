
import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  LayoutGrid, 
  Calendar, 
  Users, 
  MessageSquare, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  X, 
  FileText, 
  Video, 
  Activity, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  MoreVertical, 
  CheckCircle, 
  Plus, 
  ArrowRight, 
  Filter,
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MoreHorizontal,
  ArrowLeft,
  Check
} from 'lucide-react';
import { 
  Appointment, 
  Patient,
  ChatThread,
  ChatMessage
} from './doctor-data';

interface DoctorDashboardProps {
  onLogout: () => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointmentTab, setAppointmentTab] = useState<'upcoming' | 'pending' | 'history'>('upcoming');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // API Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [chatHistory, setChatHistory] = useState<{ [key: string]: ChatMessage[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Patient View State
  const [patientFilter, setPatientFilter] = useState<'All' | 'Active' | 'Recovered' | 'Critical'>('All');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Appointment | Patient | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'history' | 'documents'>('overview');
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [patientDocuments, setPatientDocuments] = useState<any[]>([]);

  // Messages View State
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Overview' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'patients', icon: Users, label: 'My Patients' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 2 },
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (selectedChatId && chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatId, chatHistory[selectedChatId || '']]);

  // Load data from API on mount
  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        setIsLoading(true);
        // Get doctor ID from localStorage or user session
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const doctorId = user._id || user.id;
        
        // Load appointments and patients from API
        const [aptsResponse, patientsResponse] = await Promise.all([
          api.appointments.getMyAppointments(),
          doctorId ? api.doctors.getPatients(doctorId) : Promise.resolve({ data: [] })
        ]);
        
        setAppointments(aptsResponse.data || []);
        setPatients(patientsResponse.data || []);
        
        // Load chat threads
        const chatsResponse = await api.chat.getConversations();
        setChatThreads(chatsResponse.data || []);
      } catch (error) {
        console.error('Error loading doctor data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDoctorData();
  }, []);

  const handleOpenPatientProfile = (data: Appointment | Patient) => {
    setSelectedPatient(data);
    setProfileTab('overview');
  };

  const closePatientProfile = () => {
    setSelectedPatient(null);
  };

  const handleSendMessage = async () => {
      if (!messageInput.trim() || !selectedChatId) return;
      
      const newMessage: ChatMessage = {
          id: `new_${Date.now()}`,
          sender: 'doctor',
          text: messageInput,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'sent'
      };
      
      // Update local state
      setChatHistory(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
      }));
      
      setMessageInput('');
      
      // Send to API
      try {
        await api.chat.sendMessage(selectedChatId, messageInput, 'text');
      } catch (error) {
        console.error('Error sending message:', error);
      }
  };

  // Helper to get normalized data from either Appointment or Patient type
  const getPatientDisplayData = (data: Appointment | Patient) => {
    if ('patientName' in data) {
      return {
        name: data.patientName,
        id: data.patientId,
        image: data.patientImage,
        reason: data.reason,
        age: data.age,
        gender: data.gender,
        email: data.patientName.toLowerCase().replace(' ', '.') + '@email.com',
        phone: '+91 98765 43210',
        bloodType: 'O+', 
        visitTime: data.time,
        visitType: data.type,
        symptoms: data.symptoms
      };
    } else {
      return {
        name: data.name,
        id: data.patientId,
        image: data.image,
        reason: data.condition,
        age: data.age,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        bloodType: data.bloodType,
        visitTime: null,
        visitType: null,
        symptoms: []
      };
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesFilter = patientFilter === 'All' || p.status === patientFilter;
    const matchesSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
                          p.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          p.condition.toLowerCase().includes(patientSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredChats = chatThreads.filter(c => 
      c.patientName.toLowerCase().includes(chatSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen fixed left-0 top-0 bg-white/80 backdrop-blur-xl border-r border-slate-100 z-40">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Activity size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                MediConnect
              </span>
              <span className="text-xs font-medium text-brand-600 tracking-wider uppercase">DOCTOR</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedChatId(null); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-brand-50 text-brand-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-brand-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2 group-hover:stroke-[2.5px]'} />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-slate-100">
           <div className="bg-gradient-to-br from-brand-50 to-white p-3 rounded-2xl border border-brand-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" alt="Doctor Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-slate-900 truncate">Dr. S. Mitchell</p>
                 <p className="text-xs text-brand-500 truncate">Cardiologist</p>
              </div>
              <button onClick={onLogout} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                 <LogOut size={16} />
              </button>
           </div>
        </div>
      </aside>

      {/* MOBILE HEADER & MENU */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center">
               <Activity size={18} />
            </div>
            <span className="font-bold text-slate-900">MediConnect</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

       {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white pt-20 px-6 animate-fade-in">
           <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                      setSelectedChatId(null);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-medium ${
                    activeTab === item.id ? 'bg-brand-50 text-brand-600' : 'text-slate-500'
                  }`}
                >
                  <item.icon size={24} />
                  {item.label}
                </button>
              ))}
              <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-bold text-red-500 mt-8 bg-red-50">
                  <LogOut size={24} /> Logout
              </button>
           </nav>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 lg:pl-[260px] w-full h-screen overflow-hidden relative ${activeTab === 'messages' ? 'bg-white' : 'p-6 lg:p-10 pt-20 lg:pt-8 max-w-7xl mx-auto overflow-y-auto custom-scrollbar'}`}>
        
        {/* --- MESSAGES VIEW (FULL HEIGHT, SPLIT PANE) --- */}
        {activeTab === 'messages' && (
            <div className="h-full flex flex-col lg:flex-row animate-fade-in pt-16 lg:pt-0">
                
                {/* LEFT PANE: Chat List */}
                <div className={`w-full lg:w-[380px] bg-white border-r border-slate-100 flex flex-col h-full ${selectedChatId ? 'hidden lg:flex' : 'flex'}`}>
                    
                    {/* Header */}
                    <div className="p-6 pb-2">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                            <div className="flex items-center gap-2">
                                <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full">{chatThreads.reduce((acc, t) => acc + t.unreadCount, 0)} New</span>
                                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><MoreVertical size={20} /></button>
                            </div>
                        </div>
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                            <input 
                                type="text" 
                                value={chatSearch}
                                onChange={(e) => setChatSearch(e.target.value)}
                                placeholder="Search chats..." 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-brand-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Thread List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                        {filteredChats.map(thread => (
                            <div 
                                key={thread.id}
                                onClick={() => setSelectedChatId(thread.id)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-start gap-4 border border-transparent ${
                                    selectedChatId === thread.id 
                                    ? 'bg-brand-50/60 border-brand-100' 
                                    : 'hover:bg-slate-50 hover:border-slate-100'
                                }`}
                            >
                                <div className="relative">
                                    <img src={thread.patientImage} alt={thread.patientName} className="w-12 h-12 rounded-full object-cover" />
                                    {thread.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`text-sm font-bold truncate ${selectedChatId === thread.id ? 'text-brand-900' : 'text-slate-900'}`}>{thread.patientName}</h4>
                                        <span className={`text-[10px] font-medium ${thread.unreadCount > 0 ? 'text-brand-600' : 'text-slate-400'}`}>{thread.time}</span>
                                    </div>
                                    <p className={`text-sm truncate ${thread.typing ? 'text-brand-600 font-medium italic' : 'text-slate-500'}`}>
                                        {thread.typing ? 'Typing...' : thread.lastMessage}
                                    </p>
                                </div>
                                {thread.unreadCount > 0 && (
                                    <div className="w-5 h-5 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full mt-1.5 shadow-sm shadow-brand-500/30">
                                        {thread.unreadCount}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANE: Conversation */}
                <div className={`flex-1 flex flex-col h-full bg-slate-50/50 relative ${!selectedChatId ? 'hidden lg:flex' : 'flex'}`}>
                    
                    {selectedChatId ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-20 px-6 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10 shrink-0">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedChatId(null)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full">
                                        <ArrowLeft size={20} />
                                    </button>
                                    
                                    {(() => {
                                        const thread = chatThreads.find(t => t.id === selectedChatId);
                                        return (
                                            <>
                                                <div className="relative">
                                                    <img src={thread?.patientImage} alt={thread?.patientName} className="w-10 h-10 rounded-full object-cover" />
                                                    {thread?.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{thread?.patientName}</h3>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                                        <span>{thread?.patientId}</span>
                                                        {thread?.online && <span className="w-1 h-1 bg-slate-300 rounded-full"></span>}
                                                        {thread?.online && <span className="text-green-600 font-medium">Online</span>}
                                                    </p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors hidden sm:block">
                                        <Phone size={20} />
                                    </button>
                                    <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors hidden sm:block">
                                        <Video size={20} />
                                    </button>
                                    <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#f8fafc]">
                                <div className="flex justify-center mb-4">
                                    <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
                                </div>
                                {chatHistory[selectedChatId]?.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}>
                                            <div 
                                                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                                                    msg.sender === 'doctor' 
                                                    ? 'bg-brand-600 text-white rounded-tr-none' 
                                                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                                }`}
                                            >
                                                {msg.text}
                                                <div className={`text-[10px] mt-1 text-right font-medium opacity-70 ${msg.sender === 'doctor' ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {msg.time}
                                                </div>
                                            </div>
                                            {/* Status for sent messages */}
                                            {msg.sender === 'doctor' && (
                                                <span className="text-[10px] text-slate-400 mt-1 mr-1 flex items-center gap-1">
                                                    {msg.status === 'read' ? <span className="flex"><Check size={10} /><Check size={10} className="-ml-1" /></span> : <Check size={10} />} 
                                                    {msg.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                                <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-2 flex items-end gap-2 shadow-sm focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
                                    <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-white rounded-full transition-all">
                                        <Paperclip size={20} />
                                    </button>
                                    <textarea 
                                        rows={1}
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..." 
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none max-h-32 placeholder:text-slate-400"
                                        style={{ minHeight: '44px' }}
                                    ></textarea>
                                    {messageInput.trim() ? (
                                        <button 
                                            onClick={handleSendMessage}
                                            className="p-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all active:scale-95"
                                        >
                                            <Send size={18} />
                                        </button>
                                    ) : (
                                        <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-white rounded-full transition-all">
                                            <Mic size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Chat Selected</h3>
                            <p className="text-slate-500 max-w-xs">Select a patient from the list to start a consultation or view message history.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* VIEW: OVERVIEW (DASHBOARD) - Keep existing logic for tabs != messages */}
        {activeTab !== 'messages' && (
            // ... (Rest of the Dashboard Logic from previous steps, truncated here for brevity as we are only updating Messages UI)
            // Re-pasting the existing logic for non-message tabs to ensure file integrity.
            
            <div className="animate-fade-in">
             {/* HEADER FOR NON-MESSAGES TABS */}
             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {activeTab === 'dashboard' ? 'Good Morning, Dr. Sarah' : 
                         activeTab === 'appointments' ? 'Appointments' : 
                         activeTab === 'patients' ? 'Patients' : 'Dashboard'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {activeTab === 'dashboard' ? 'Here is your daily practice summary for Thu Jan 29 2026.' :
                         activeTab === 'appointments' ? 'Manage your patient schedule and history.' :
                         'View and manage your patient records.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {activeTab !== 'dashboard' && (
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                            <input 
                                type="text" 
                                value={activeTab === 'patients' ? patientSearch : ''}
                                onChange={(e) => activeTab === 'patients' && setPatientSearch(e.target.value)}
                                placeholder="Search..." 
                                className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all w-64 shadow-sm"
                            />
                        </div>
                    )}
                    <button className="relative w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all shadow-sm">
                        <Bell size={18} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </header>

            {/* DASHBOARD STATS */}
            {activeTab === 'dashboard' && (
                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                    {[
                      { label: 'Total Patients', value: patients.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Appointments', value: appointments.length.toString(), icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
                      { label: 'Consultations', value: (appointments.filter(a => a.type === 'video').length).toString(), icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
                      { label: 'Messages', value: chatThreads.reduce((acc, t) => acc + t.unreadCount, 0).toString(), icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-brand-900/5 transition-all flex items-center justify-between group cursor-pointer">
                            <div>
                                <p className="text-slate-500 font-medium text-sm mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* MAIN CONTENT GRIDS FOR NON-MESSAGE TABS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* --- SCHEDULE / APPOINTMENTS LIST --- */}
                {activeTab !== 'patients' && (
                    <div className="xl:col-span-2 space-y-6">
                        {(activeTab === 'dashboard' || activeTab === 'appointments') && (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {activeTab === 'appointments' ? 
                                            (appointmentTab === 'upcoming' ? 'Upcoming Appointments' : appointmentTab === 'pending' ? 'Pending Requests' : 'History') 
                                            : "Today's Schedule"}
                                    </h3>
                                    {activeTab === 'dashboard' && (
                                        <button onClick={() => setActiveTab('appointments')} className="text-brand-600 font-bold text-sm hover:underline">View All</button>
                                    )}
                                    {activeTab === 'appointments' && (
                                        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                                            {['upcoming', 'pending', 'history'].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setAppointmentTab(tab as any)}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                                        appointmentTab === tab 
                                                        ? 'bg-white text-slate-900 shadow-sm' 
                                                        : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {/* RENDER LIST BASED ON TAB */}
                                    {(activeTab === 'dashboard' || (activeTab === 'appointments' && appointmentTab === 'upcoming')) && appointments.filter(a => a.status === 'Upcoming').map((apt) => (
                                        <div key={apt.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-brand-200 transition-all flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-md cursor-pointer" onClick={() => handleOpenPatientProfile(apt)}>
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="text-center min-w-[60px]">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Time</p>
                                                    <p className="text-lg font-bold text-slate-900 mt-1 leading-tight">
                                                        {apt.time.split(' ')[0]} <br/>
                                                        <span className="text-sm font-medium text-slate-500">{apt.time.split(' ')[1]}</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <img src={apt.patientImage} alt={apt.patientName} className="w-14 h-14 rounded-2xl object-cover" />
                                                    <div>
                                                        <h4 className="text-lg font-bold text-slate-900">{apt.patientName}</h4>
                                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                                                            <span>{apt.reason}</span>
                                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                            <span className="flex items-center gap-1">
                                                                {apt.type === 'Video Call' ? <Video size={12} className="text-brand-500" /> : <FileText size={12} className="text-slate-500" />}
                                                                {apt.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end md:justify-start">
                                                {apt.type === 'Video Call' ? (
                                                    <button className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 active:scale-95 text-sm">
                                                        Join Call
                                                    </button>
                                                ) : (
                                                    <button className="bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors border border-green-100 active:scale-95 text-sm">
                                                        Check In
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* PENDING REQUESTS VIEW */}
                                    {activeTab === 'appointments' && appointmentTab === 'pending' && appointments.filter(a => a.status === 'Pending').map((req) => (
                                        <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all flex flex-col md:flex-row items-center gap-6 animate-fade-in-up">
                                            <div className="flex-1 flex items-center gap-4 w-full">
                                                    <img src={req.patientImage} className="w-14 h-14 rounded-2xl object-cover" alt={req.patientName} />
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900">{req.patientName}</h3>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{req.reason}</span>
                                                            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md font-bold">{req.time}</span>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="flex gap-3 w-full md:w-auto">
                                                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors">Decline</button>
                                                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-colors">Accept</button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* HISTORY VIEW */}
                                    {activeTab === 'appointments' && appointmentTab === 'history' && appointments.filter(a => a.status === 'Completed').map((hist) => (
                                        <div key={hist.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 opacity-80 hover:opacity-100 transition-opacity animate-fade-in-up">
                                            <div className="flex-1 flex items-center gap-4 w-full">
                                                    <img src={hist.patientImage} className="w-14 h-14 rounded-2xl object-cover grayscale" alt={hist.patientName} />
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900">{hist.patientName}</h3>
                                                        <p className="text-sm text-slate-500">{hist.date} • {hist.time}</p>
                                                    </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${hist.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                    {hist.status}
                                                </span>
                                                <button className="text-brand-600 text-sm font-bold hover:underline">View Report</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* --- SIDEBAR WIDGETS (Only on Dashboard) --- */}
                {activeTab === 'dashboard' && (
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Pending Requests</h3>
                        <div className="space-y-4">
                            {appointments.filter(a => a.status === 'Pending').map((req) => (
                                <div key={req.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4 mb-6">
                                        <img src={req.patientImage} alt={req.patientName} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <div className="flex justify-between w-full">
                                                <h4 className="text-lg font-bold text-slate-900">{req.patientName}</h4>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1">{req.time}</span>
                                            <p className="text-sm text-slate-500">{req.reason}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 active:scale-95 text-sm">
                                            Accept
                                        </button>
                                        <button className="flex-1 bg-slate-50 text-slate-600 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors active:scale-95 text-sm">
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- MY PATIENTS VIEW --- */}
                {activeTab === 'patients' && (
                    <div className="xl:col-span-3">
                        {/* Filters */}
                        <div className="mb-8 overflow-x-auto pb-2 custom-scrollbar">
                            <div className="flex gap-2">
                                {['All', 'Active', 'Recovered', 'Critical'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setPatientFilter(filter as any)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                            patientFilter === filter 
                                            ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/30' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Patients List */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-4">Patient Name</div>
                                <div className="col-span-2">ID</div>
                                <div className="col-span-2">Age / Gender</div>
                                <div className="col-span-2">Condition</div>
                                <div className="col-span-2 text-right">Last Visit</div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {filteredPatients.map((patient) => (
                                    <div 
                                        key={patient.id} 
                                        onClick={() => handleOpenPatientProfile(patient)}
                                        className="group p-6 md:grid md:grid-cols-12 md:gap-4 flex flex-col gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative"
                                    >
                                        <div className="md:hidden absolute top-6 right-6">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                                patient.status === 'Active' ? 'bg-blue-50 text-blue-600' : 
                                                patient.status === 'Recovered' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {patient.status}
                                            </span>
                                        </div>

                                        <div className="col-span-4 flex items-center gap-4">
                                            <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-xl object-cover" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-base">{patient.name}</h4>
                                                <p className="text-xs text-slate-500 md:hidden">{patient.patientId}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-center text-sm font-medium text-brand-600 md:text-slate-600">
                                            <span className="hidden md:inline bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-slate-500">{patient.patientId}</span>
                                        </div>

                                        <div className="col-span-2 flex items-center text-sm font-medium text-slate-700">
                                            {patient.age} / {patient.gender}
                                        </div>

                                        <div className="col-span-2 flex items-center">
                                            <span className="text-sm font-medium text-slate-900">{patient.condition}</span>
                                        </div>

                                        <div className="col-span-2 flex items-center justify-between md:justify-end gap-4">
                                            <span className="text-sm text-slate-500">{patient.lastVisit}</span>
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all">
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {filteredPatients.length === 0 && (
                                <div className="p-12 text-center">
                                    <p className="text-slate-500">No patients found matching your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            </div>
        )}

      </main>

      {/* PATIENT PROFILE MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
               {/* Same Modal Content as before... */}
               <div className="w-full md:w-[320px] bg-slate-50 border-r border-slate-200 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
                   {(() => {
                       const data = getPatientDisplayData(selectedPatient);
                       return (
                           <>
                               <div className="text-center mb-8">
                                   <div className="w-28 h-28 mx-auto rounded-full p-1 border-2 border-brand-200 relative mb-4">
                                       <img src={data.image} className="w-full h-full rounded-full object-cover" alt={data.name} />
                                       <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                                   </div>
                                   <h2 className="text-2xl font-bold text-slate-900 leading-tight">{data.name}</h2>
                                   <p className="text-brand-600 font-bold text-sm mt-1">{data.id}</p>
                               </div>

                               <div className="space-y-6 mb-8">
                                   <div>
                                       <p className="text-xs font-bold text-slate-400 uppercase mb-2">Contact Info</p>
                                       <div className="space-y-3">
                                           <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                               <Phone size={16} className="text-slate-400" /> {data.phone}
                                           </div>
                                           <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                               <Mail size={16} className="text-slate-400" /> <span className="truncate">{data.email}</span>
                                           </div>
                                       </div>
                                   </div>

                                   <div>
                                       <p className="text-xs font-bold text-slate-400 uppercase mb-3">Vitals (Last Checked)</p>
                                       <div className="grid grid-cols-2 gap-3">
                                           <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                               <p className="text-[10px] text-slate-400 font-bold uppercase">BP</p>
                                               <p className="text-lg font-bold text-slate-900">118/75</p>
                                           </div>
                                           <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                               <p className="text-[10px] text-slate-400 font-bold uppercase">Weight</p>
                                               <p className="text-lg font-bold text-slate-900">65kg</p>
                                           </div>
                                           <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                               <p className="text-[10px] text-slate-400 font-bold uppercase">Height</p>
                                               <p className="text-lg font-bold text-slate-900">170cm</p>
                                           </div>
                                           <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                               <p className="text-[10px] text-slate-400 font-bold uppercase">Blood</p>
                                               <p className="text-lg font-bold text-slate-900">{data.bloodType}</p>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </>
                       );
                   })()}

                   <button 
                      onClick={closePatientProfile}
                      className="mt-auto w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                   >
                      Close Profile
                   </button>
               </div>

               <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
                   <div className="px-8 pt-8 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                       <div className="flex gap-6">
                           {['overview', 'history', 'documents'].map(tab => (
                               <button 
                                  key={tab}
                                  onClick={() => setProfileTab(tab as any)}
                                  className={`pb-3 text-sm font-bold capitalize relative transition-all ${
                                      profileTab === tab ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
                                  }`}
                               >
                                   {tab}
                                   {profileTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"></div>}
                               </button>
                           ))}
                       </div>
                       <div className="text-right hidden md:block">
                           <p className="text-xs text-slate-400 font-bold uppercase">Last Visit</p>
                           <p className="text-sm font-bold text-slate-900">Jan 12, 2024</p>
                       </div>
                   </div>

                   <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                       {profileTab === 'overview' && (
                           <div className="space-y-8 animate-fade-in">
                               {(() => {
                                   const data = getPatientDisplayData(selectedPatient);
                                   return (
                                       <>
                                           <div>
                                               <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                   <Activity className="text-brand-600" size={20} /> Current Status
                                               </h3>
                                               <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                                                   <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                       <div>
                                                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Condition / Reason</p>
                                                           <p className="text-lg font-bold text-slate-900">{data.reason}</p>
                                                       </div>
                                                       <div>
                                                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Recent Symptoms</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {data.symptoms && data.symptoms.length > 0 ? data.symptoms.map((sym, i) => (
                                                                    <span key={i} className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-xs font-bold text-indigo-700 shadow-sm">
                                                                        {sym}
                                                                    </span>
                                                                )) : <span className="text-sm text-slate-500">None reported for current session</span>}
                                                            </div>
                                                       </div>
                                                   </div>
                                                   <div>
                                                       <p className="text-xs font-bold text-slate-400 uppercase mb-2">Clinical Notes (Draft)</p>
                                                       <textarea 
                                                          className="w-full h-32 p-4 rounded-xl bg-white border border-indigo-100 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium resize-none"
                                                          placeholder="Add your clinical observations here..."
                                                       ></textarea>
                                                   </div>
                                               </div>
                                           </div>
                                           {data.visitTime && (
                                               <div>
                                                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                       <Calendar className="text-brand-600" size={20} /> Appointment Info
                                                   </h3>
                                                   <div className="grid grid-cols-3 gap-4">
                                                       <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                                                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Date</p>
                                                           <p className="font-bold text-slate-900">Today, Jan 29</p>
                                                       </div>
                                                       <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                                                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Time</p>
                                                           <p className="font-bold text-slate-900">{data.visitTime}</p>
                                                       </div>
                                                       <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                                                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Type</p>
                                                           <p className="font-bold text-slate-900">{data.visitType}</p>
                                                       </div>
                                                   </div>
                                               </div>
                                           )}
                                       </>
                                   );
                               })()}
                           </div>
                       )}
                       {profileTab === 'history' && (
                           <div className="space-y-6 animate-fade-in">
                               {patientHistory.map((item, idx) => (
                                   <div key={item.id} className="relative pl-8 pb-8 border-l-2 border-slate-100 last:border-0 last:pb-0">
                                       <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                                       <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-200 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-lg font-bold text-slate-900">{item.diagnosis}</h4>
                                                <span className="text-xs font-bold text-slate-400">{item.date}</span>
                                            </div>
                                            <p className="text-xs font-bold text-brand-600 mb-3">{item.doctor}</p>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.notes}</p>
                                            {item.prescription && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                                                    <FileText size={14} /> Prescription: {item.prescription}
                                                </div>
                                            )}
                                       </div>
                                   </div>
                               ))}
                           </div>
                       )}
                       {profileTab === 'documents' && (
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
                               {patientDocuments.map((doc) => (
                                   <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group cursor-pointer text-center flex flex-col items-center justify-center h-48">
                                       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                            <FileText size={24} />
                                       </div>
                                       <h4 className="font-bold text-slate-900 text-sm mb-1">{doc.title}</h4>
                                       <p className="text-xs text-slate-400">{doc.date}</p>
                                       <button className="mt-4 text-xs font-bold text-brand-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                           View Document <ArrowRight size={12} />
                                       </button>
                                   </div>
                               ))}
                               <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center h-48 cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all text-slate-400 hover:text-brand-600">
                                   <Plus size={32} className="mb-2" />
                                   <span className="text-sm font-bold">Upload New</span>
                               </div>
                           </div>
                       )}
                   </div>
               </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
