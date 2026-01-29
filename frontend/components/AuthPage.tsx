
import React, { useState, useEffect } from 'react';
import { MapPin, User, Mail, Phone, Lock, Navigation, CheckCircle, ShieldCheck, ArrowLeft, Stethoscope, Activity, Upload, FileText, Clock, AlertCircle, Briefcase, Globe } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
  onLoginSuccess: (role: 'patient' | 'doctor' | 'admin') => void;
}

type AuthView = 'login' | 'otp' | 'signup';
type UserRole = 'patient' | 'doctor' | 'admin';

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLoginSuccess }) => {
  const [view, setView] = useState<AuthView>('login');
  const [role, setRole] = useState<UserRole>('patient');
  const [signupStep, setSignupStep] = useState<0 | 1>(0); // 0: Role Selection, 1: Form
  const [mobileNumber, setMobileNumber] = useState('');
  const [addressMode, setAddressMode] = useState<'manual' | 'map'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSubmittedForApproval, setIsSubmittedForApproval] = useState(false);

  // Reset scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, signupStep, isSubmittedForApproval]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Check
    setTimeout(() => {
      setIsLoading(false);
      
      // DOCTOR SPECIFIC LOGIN CHECK
      if (mobileNumber === '7416186789') {
        // Direct bypass for this specific doctor number for demo
        setView('otp');
        setRole('doctor'); 
        return;
      }

      // Logic: For demo, if number ends in 0, simulate "New User", else "Existing User"
      if (mobileNumber.endsWith('0')) {
        setView('signup');
        setSignupStep(0); // Start at role selection
      } else {
        setView('otp');
        setRole('patient'); // Default to patient for existing users unless specific overrides
      }
    }, 1000);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // If role is Patient, go to Dashboard
      if (role === 'patient') {
        onLoginSuccess('patient');
      } else if (role === 'doctor') {
        // Doctor usually needs approval, but for this specific request:
        // "when the doctor is not existent then he can create his account by uploadinng his certificates thats is done in the create user for the doctor"
        // We will simulate approval or direct access. 
        // Let's assume after upload, they get access for the demo.
        onLoginSuccess('doctor');
      } else {
        // For admin or others
        alert(`Registration Successful for ${role}. Waiting for admin approval.`);
        onBack();
      }
    }, 2000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Logic: If login is successful, go to Dashboard based on identified role
      onLoginSuccess(role);
    }, 1500);
  };

  const switchToSignup = () => {
    setView('signup');
    setSignupStep(0);
  };

  const goBackStep = () => {
    if (isSubmittedForApproval) {
        onBack();
        return;
    }
    if (view === 'signup') {
        if (signupStep === 1) {
            setSignupStep(0);
        } else {
            setView('login');
        }
    } else if (view === 'otp') {
        setView('login');
    }
  };

  const selectRole = (selectedRole: UserRole) => {
      setRole(selectedRole);
      setSignupStep(1);
  };

  // Ultra Concise File Upload Component
  const ConciseFileUpload = ({ label, required = true }: { label: string, required?: boolean }) => (
    <div className="relative flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white hover:border-brand-400 transition-all cursor-pointer group">
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" required={required} />
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-8 h-8 bg-white rounded-md border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors shrink-0 shadow-sm">
            <Upload size={14} />
        </div>
        <div className="min-w-0 flex flex-col">
            <p className="text-xs font-semibold text-slate-700 truncate group-hover:text-brand-700">{label}</p>
            <p className="text-[9px] text-slate-400">PDF/JPG • Max 5MB</p>
        </div>
      </div>
      {required && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-400 rounded-full"></span>}
    </div>
  );

  if (isSubmittedForApproval) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in text-center">
             <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-4 border-amber-100 rounded-full animate-ping opacity-20"></div>
                <Clock size={48} className="text-amber-500" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted</h2>
             <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">
                Thank you for registering with MediConnect. Your profile and documents are currently under review by our administrative team.
             </p>
             
             <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 max-w-md w-full text-left shadow-sm mb-10">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-brand-500" /> Verification Process
                </h4>
                <div className="space-y-6 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                    
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-brand-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                            <CheckCircle size={10} className="text-white" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">Documents Received</p>
                        <p className="text-xs text-slate-500 mt-1">We have securely stored your credentials.</p>
                    </div>

                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-amber-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-sm font-bold text-slate-900">Under Review</p>
                        <p className="text-xs text-slate-500 mt-1">Admins are verifying your license & identity.</p>
                    </div>

                    <div className="relative pl-8 opacity-50">
                         <div className="absolute left-0 top-1 w-6 h-6 bg-slate-200 rounded-full border-4 border-white shadow-sm"></div>
                        <p className="text-sm font-bold text-slate-900">Approval & Activation</p>
                        <p className="text-xs text-slate-500 mt-1">You will receive an SMS once approved.</p>
                    </div>
                </div>
             </div>

             <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95">
                Return to Home
             </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row animate-fade-in">
      
      {/* LEFT PANEL: Branding & Image (Fixed on Desktop) */}
      <div className="lg:w-5/12 xl:w-4/12 relative hidden lg:flex flex-col bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" 
            alt="Medical Team" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 to-slate-900/90 mix-blend-multiply"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12 justify-between">
          {/* Top: Logo & Back */}
          <div>
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm font-medium"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-700 shadow-lg">
                <Activity size={20} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Medi<span className="text-brand-300">Connect</span>
              </span>
            </div>
          </div>

          {/* Bottom: Testimonial/Info */}
          <div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
               <ShieldCheck size={24} />
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Secure, Intelligent Healthcare Access.</h2>
            <p className="text-brand-100 leading-relaxed mb-8">
              "MediConnect has revolutionized how I manage my patients. The AI diagnostics are incredibly accurate and save valuable time."
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-900 bg-slate-600 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-full h-full object-cover" alt="User" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-white/80">Trusted by 10k+ Specialists</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Scrollable Form Area */}
      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto custom-scrollbar bg-slate-50 lg:bg-white">
        
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-20">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center">
                <Activity size={18} />
              </div>
              <span className="text-lg font-bold">MediConnect</span>
           </div>
           <button onClick={onBack} className="p-2 bg-slate-100 rounded-full text-slate-600">
             <ArrowLeft size={20} />
           </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 max-w-4xl mx-auto w-full">
          
          {/* Back Button for sub-views (within form area) */}
          {view !== 'login' && (
            <div className="mb-6">
               <button 
                  onClick={goBackStep}
                  className="text-slate-500 hover:text-brand-600 flex items-center gap-2 text-sm font-semibold transition-colors"
                >
                  <ArrowLeft size={16} /> {view === 'otp' ? 'Back to Login' : 'Back'}
                </button>
            </div>
          )}

          {/* VIEW 1: LOGIN */}
          {view === 'login' && (
            <div className="animate-fade-in w-full max-w-md mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
                <p className="text-slate-500">Enter your mobile number to access your portal</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mobile Number</label>
                  <div className="relative group">
                    <div className="absolute left-0 top-0 bottom-0 px-4 bg-slate-100 group-focus-within:bg-brand-50 group-focus-within:text-brand-700 transition-colors rounded-l-xl flex items-center border border-r-0 border-slate-200 group-focus-within:border-brand-500/20 text-slate-500 font-bold text-sm">
                      +91
                    </div>
                    <input 
                      type="tel" 
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      placeholder="98765 43210" 
                      className="w-full pl-16 pr-4 py-4 rounded-xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all placeholder:text-slate-300 font-medium text-lg text-slate-900" 
                      required 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || mobileNumber.length < 10}
                  className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:shadow-brand-600/40 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Get Started'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm">Don't have an account?</p>
                <button 
                  onClick={switchToSignup}
                  className="mt-2 text-brand-600 font-bold hover:text-brand-700 hover:underline transition-all"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: OTP */}
          {view === 'otp' && (
            <div className="animate-fade-in-up w-full max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
                <Lock size={30} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify it's you</h2>
              <p className="text-slate-500 mb-8">
                Enter the 4-digit code sent to <span className="font-bold text-slate-900">+91 {mobileNumber}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-center gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[index] = e.target.value.replace(/\D/g, '');
                        setOtp(newOtp);
                        if (e.target.value && index < 3) {
                          const nextInput = document.getElementById(`otp-${index + 1}`);
                          nextInput?.focus();
                        }
                      }}
                      id={`otp-${index}`}
                      className="w-16 h-16 text-center text-3xl font-bold bg-white border-2 border-slate-200 rounded-2xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-brand-600 shadow-sm"
                    />
                  ))}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || otp.join('').length < 4}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Login'}
                </button>
              </form>

              <div className="mt-8">
                <button className="text-sm text-slate-500 hover:text-brand-600 font-medium transition-colors">
                  Resend Code in 30s
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: SIGNUP - ROLE SELECTION */}
          {view === 'signup' && signupStep === 0 && (
             <div className="animate-fade-in w-full">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-4 text-brand-600">
                         <User size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Choose your profile</h2>
                    <p className="text-slate-500 max-w-md mx-auto">Select the account type that best describes you to customize your experience.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                    {/* Patient Card */}
                    <div 
                        onClick={() => selectRole('patient')}
                        className="group cursor-pointer bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <User size={36} />
                        </div>
                        <h3 className="relative z-10 font-bold text-xl text-slate-900 mb-2">Patient</h3>
                        <p className="relative z-10 text-sm text-slate-500 leading-snug">Book appointments, view records & consult doctors.</p>
                    </div>

                    {/* Doctor Card */}
                    <div 
                         onClick={() => selectRole('doctor')}
                         className="group cursor-pointer bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <Stethoscope size={36} />
                        </div>
                        <h3 className="relative z-10 font-bold text-xl text-slate-900 mb-2">Doctor</h3>
                        <p className="relative z-10 text-sm text-slate-500 leading-snug">Manage schedule, patients & provide consultations.</p>
                    </div>

                    {/* Admin Card */}
                    <div 
                         onClick={() => selectRole('admin')}
                         className="group cursor-pointer bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 w-20 h-20 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <ShieldCheck size={36} />
                        </div>
                        <h3 className="relative z-10 font-bold text-xl text-slate-900 mb-2">Admin</h3>
                        <p className="relative z-10 text-sm text-slate-500 leading-snug">Manage facility, users & analytics dashboard.</p>
                    </div>
                </div>
             </div>
          )}

          {/* VIEW 3: SIGNUP - FORM DETAILS */}
          {view === 'signup' && signupStep === 1 && (
            <div className="animate-fade-in-up w-full">
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{role} Account</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Complete your profile</h2>
                  <p className="text-slate-500 mt-2">Please provide your details to finish setting up your account.</p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-8">
                  
                  {/* Personal Details Group */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <User size={16} className="text-brand-500" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">First Name</label>
                        <input type="text" placeholder="Sarah" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Surname</label>
                        <input type="text" placeholder="Mitchell" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700">Age</label>
                          <input type="number" placeholder="28" min="0" max="120" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700">Gender</label>
                          <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-slate-700 appearance-none bg-white" required>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details Group */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Phone size={16} className="text-brand-500" /> Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="tel" 
                            defaultValue={mobileNumber}
                            placeholder="+91 98765 43210" 
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Gmail Account</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="email" placeholder="sarah.m@gmail.com" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" required />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <MapPin size={16} className="text-brand-500" /> Address
                      </h3>
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                          type="button"
                          onClick={() => setAddressMode('manual')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${addressMode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          Manual
                        </button>
                        <button 
                          type="button"
                          onClick={() => setAddressMode('map')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${addressMode === 'map' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          Google Maps
                        </button>
                      </div>
                    </div>

                    {addressMode === 'manual' ? (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-4 animate-fade-in">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-semibold text-slate-700">Door / House No.</label>
                          <input type="text" placeholder="42-B" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" />
                        </div>
                        <div className="md:col-span-4 space-y-2">
                          <label className="text-xs font-semibold text-slate-700">Area / Street Name</label>
                          <input type="text" placeholder="Greenwood Avenue" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" />
                        </div>
                        
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-xs font-semibold text-slate-700">City</label>
                          <input type="text" placeholder="Bangalore" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-xs font-semibold text-slate-700">District</label>
                          <input type="text" placeholder="Urban" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-semibold text-slate-700">State</label>
                          <input type="text" placeholder="Karnataka" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-semibold text-slate-700">Country</label>
                          <input type="text" defaultValue="India" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-semibold text-slate-700">Pincode</label>
                          <input type="text" placeholder="560001" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 h-[280px] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer animate-fade-in hover:border-brand-300 transition-colors">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2662&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700"></div>
                        <div className="relative z-10 flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-600 animate-bounce">
                            <MapPin size={28} className="fill-current" />
                          </div>
                          <button type="button" className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-brand-600 hover:text-white transition-colors flex items-center gap-2">
                            <Navigation size={16} /> Locate Me
                          </button>
                          <p className="text-xs font-medium text-slate-700 bg-white/90 px-3 py-1 rounded-md backdrop-blur-sm">Click to select location on map</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DOCTOR SPECIFIC SECTION */}
                  {role === 'doctor' && (
                    <>
                      {/* PROFESSIONAL EXPERIENCE */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                              <Briefcase size={16} className="text-brand-500" /> Professional Experience
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="md:col-span-2 space-y-2">
                                  <label className="text-xs font-semibold text-slate-700">Current Hospital/Clinic Name</label>
                                  <input type="text" placeholder="Apollo Hospital, Bangalore" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-semibold text-slate-700">Department/Specialty</label>
                                  <input type="text" placeholder="Cardiology" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-semibold text-slate-700">Years of Experience</label>
                                  <input type="number" placeholder="5" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-semibold text-slate-700">Hospital Location (City)</label>
                                  <input type="text" placeholder="Indiranagar, Bangalore" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-semibold text-slate-700">Hospital Website / Contact</label>
                                  <div className="relative">
                                      <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                      <input type="text" placeholder="www.apollo.com" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" />
                                  </div>
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                  <label className="text-xs font-semibold text-slate-700">Brief Professional Bio</label>
                                  <textarea rows={3} placeholder="Tell us about your specialization and achievements..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400 resize-none"></textarea>
                              </div>
                          </div>
                      </div>

                      {/* PROFESSIONAL DOCUMENTS (Concise List Layout) */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
                          <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                  <FileText size={16} className="text-brand-500" /> Professional Documents
                              </h3>
                              <span className="text-[10px] text-brand-600 bg-brand-50 px-2 py-1 rounded-full font-bold">5 Required</span>
                          </div>
                          
                          <div className="mb-4 bg-blue-50/50 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
                              <AlertCircle size={16} className="text-blue-500 shrink-0" />
                              <p className="text-xs text-blue-700 font-medium leading-tight">
                                  Upload clear images or PDFs. Admin verification takes 24-48 hours.
                              </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <ConciseFileUpload label="Provisional Registration Cert" />
                              <ConciseFileUpload label="Proof of Identity (Aadhar/Passport)" />
                              <ConciseFileUpload label="State Medical Council Cert" />
                              <ConciseFileUpload label="Medical Licence" />
                              <ConciseFileUpload label="Degree Certificates" />
                              
                              {/* Add More Button */}
                              <div className="relative flex items-center justify-center p-3 border border-slate-200 border-dashed rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-brand-600 hover:border-brand-300 cursor-pointer transition-all h-full min-h-[50px] group">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">+</div>
                                    <span className="text-xs font-bold">Add Other</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </>
                  )}

                  {/* Submit Action */}
                  <div className="pt-4 pb-12">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-brand-600 hover:shadow-brand-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {role === 'doctor' ? 'Create Account' : 'Create Account'} 
                          {role === 'doctor' ? <CheckCircle size={18} /> : <CheckCircle size={18} />}
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                      By clicking {role === 'doctor' ? 'Create Account' : 'Create Account'}, you agree to our <a href="#" className="underline hover:text-brand-600">Terms</a> and <a href="#" className="underline hover:text-brand-600">Privacy Policy</a>.
                    </p>
                  </div>

                </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
