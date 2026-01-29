import React from 'react';
import { Play, ArrowRight, Dna, Activity, Search } from 'lucide-react';

interface HeroProps {
  onOpenSignup: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenSignup }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mesh-gradient min-h-screen flex items-center">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center text-center gap-10">
          
          {/* Badge */}
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-brand-100 rounded-full text-xs font-bold text-brand-700 uppercase tracking-wider shadow-sm hover:bg-white/80 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              Next Gen Diagnostics
            </div>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 leading-[1.05] animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
            Revolutionizing <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-white px-4">healthcare</span>
              <span className="absolute inset-0 bg-slate-900 rounded-full -rotate-1 z-0 shadow-xl"></span>
            </span> <br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-400">AI & Biotech</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-lg text-lg text-slate-500 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>
            Empowering individuals and healthcare professionals with advanced diagnostic tools and personalized treatment plans using genomic data.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s' }}>
            <button 
              onClick={onOpenSignup}
              className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white rounded-full font-semibold text-lg shadow-xl shadow-brand-500/30 hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get Started
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                <Play size={10} className="fill-current ml-0.5" />
              </div>
              See how it works
            </button>
          </div>

          {/* Central Visual / Abstract Art */}
          <div className="relative mt-16 w-full max-w-5xl mx-auto h-[400px] md:h-[500px] animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
             
             {/* Abstract Gradient Orbs (Simulating the 3D DNA) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-r from-brand-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-[60px] opacity-20 animate-pulse-slow"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[450px] md:h-[450px] bg-gradient-to-b from-blue-300 to-purple-400 rounded-full mix-blend-multiply filter blur-[60px] opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>

             {/* Central Phone Mockup Container */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] md:w-[300px] h-[500px] md:h-[580px] bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden z-20 hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                  alt="App Interface" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-transparent to-transparent flex flex-col justify-end p-8 text-center">
                   <div className="mx-auto w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
                      <Dna className="text-white" size={24} />
                   </div>
                   <h3 className="text-white font-bold text-xl mb-1">MediConnect</h3>
                   <p className="text-brand-200 text-sm">Analyzing sequence...</p>
                </div>
             </div>

             {/* Floating UI Card - Left */}
             <div className="absolute top-10 left-4 md:left-20 lg:left-32 bg-white p-5 rounded-3xl shadow-xl shadow-brand-900/5 animate-float hidden md:block max-w-[200px] hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
                   <Activity size={20} />
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">AI Diagnostics</p>
                <p className="text-xs text-slate-500 leading-snug">Real-time analysis of vital signs and genetic markers.</p>
             </div>

             {/* Floating UI Card - Right */}
             <div className="absolute bottom-20 right-4 md:right-20 lg:right-32 bg-white p-1 rounded-2xl shadow-xl shadow-brand-900/5 animate-float hidden md:block max-w-[220px] hover:scale-105 transition-transform cursor-pointer" style={{ animationDelay: '2s' }}>
                <div className="relative rounded-xl overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop" className="w-full h-32 object-cover" alt="Doctor" />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                         <Play size={16} className="text-white fill-current ml-0.5" />
                      </div>
                   </div>
                   <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                      01:56
                   </div>
                </div>
                <div className="p-3">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <p className="text-xs font-bold text-slate-800">Dr. Sarah Mitchell</p>
                   </div>
                   <p className="text-[10px] text-slate-500">Your results are ready for review.</p>
                </div>
             </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;