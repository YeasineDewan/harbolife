import { Link } from "react-router-dom";
import landingImage from "../../../assets/Home/doctor.webp";
import Button from "../../../components/ui/Button";
import { ShieldCheck, Clock, Sparkles, Activity, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-l from-[#0a3c2f] to-[#2c6e49] text-white pt-24 min-h-[85vh] md:min-h-fit flex items-center">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left z-10 pb-12 md:pb-0 lg:pb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to Rochetta
            </h1>
            <p className="text-lg md:text-xl text-green-50 mb-8 max-w-2xl mx-auto md:mx-0">
              Your online pharmacy — delivering trusted medicines and care,
              anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                as={Link}
                to="/signup"
                variant="solid"
                size="lg"
                className="px-8 py-3 bg-(--color-primary-500) hover:bg-(--color-primary-400) text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
              >
                Get Started
              </Button>
              <Button
                as={Link}
                to="/about-system"
                variant="outline"
                size="lg"
                className="px-8 py-3 bg-transparent border-2 border-(--color-primary-400) hover:bg-(--color-primary-400)/20 text-white font-bold rounded-xl transition-all active:scale-95"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden md:flex w-full md:w-1/2 justify-center items-end relative top-2.5 px-8 lg:px-12">
            <div className="relative flex justify-center items-end select-none">
              {/* Soft background glow */}
              <div className="absolute inset-0 bg-(--color-primary-400)/20 rounded-full blur-3xl scale-110 -z-20"></div>
              
              {/* SVG Drawing/Doodles around the doctor (Strictly behind him) */}
              <svg 
                className="absolute w-[125%] h-[125%] -bottom-5 text-emerald-400/25 pointer-events-none -z-10" 
                viewBox="0 0 500 500" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer decorative dashed circle centered around the doctor */}
                <circle 
                  cx="250" 
                  cy="230" 
                  r="215" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeDasharray="8 12" 
                  className="opacity-55 animate-[spin_180s_linear_infinite]" 
                />
                {/* Inner accent ring */}
                <circle 
                  cx="250" 
                  cy="230" 
                  r="175" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeDasharray="4 6" 
                  className="opacity-30 animate-[spin_100s_linear_infinite_reverse]" 
                />
                
                {/* Elegant curved swoop line */}
                <path 
                  d="M 50,230 A 200,200 0 0,1 450,230" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeDasharray="6 8" 
                  className="opacity-40" 
                />
                
                {/* Decorative stars / cross sparkles */}
                {/* Star 1 - Top Left */}
                <g className="opacity-60 text-yellow-300/40 animate-pulse">
                  <path d="M 80,110 L 83,113 L 86,110 L 83,107 Z" fill="currentColor" />
                  <path d="M 83,104 L 83,116 M 77,110 L 89,110" stroke="currentColor" strokeWidth="1" />
                </g>
                {/* Star 2 - Top Right */}
                <g className="opacity-60 text-yellow-300/40 animate-pulse animate-[pulse_2s_infinite_1s]">
                  <path d="M 400,90 L 403,93 L 406,90 L 403,87 Z" fill="currentColor" />
                  <path d="M 403,84 L 403,96 M 397,90 L 409,90" stroke="currentColor" strokeWidth="1" />
                </g>

                {/* Floating circles/dots resembling drawing elements */}
                <circle cx="60" cy="270" r="4" fill="currentColor" className="opacity-30" />
                <circle cx="430" cy="300" r="5" fill="currentColor" className="opacity-40" />
                <circle cx="120" cy="420" r="3" fill="currentColor" className="opacity-20" />
              </svg>

              {/* Doctor Image (z-10 ensures it stays in front of the drawings) */}
              <img
                src={landingImage}
                alt="Doctor"
                width="417"
                height="625"
                fetchPriority="high"
                className="max-h-[450px] lg:max-h-[580px] w-auto object-contain drop-shadow-2xl z-10 pointer-events-none"
                style={{ animation: "float 5s ease-in-out infinite" }}
              />

              {/* Floating Element 1: Health Stats Card (Top Left - Shifted outward but within bounds) */}
              <div 
                className="absolute left-[-80px] lg:left-[-110px] top-[12%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 w-48 text-left z-20 transition-all hover:bg-white/15"
                style={{ animation: "float-slow 6s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </div>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-1">
                    <Activity className="w-3 h-3 text-rose-400" /> Live Health
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">99.4%</span>
                  <span className="text-[10px] text-emerald-300 font-medium">+1.2%</span>
                </div>
                {/* Mini Bar Chart drawing inside card */}
                <div className="flex items-end gap-2.5 h-9 pt-2 px-1">
                  <div className="w-2.5 bg-emerald-400/30 rounded-full h-[40%]" />
                  <div className="w-2.5 bg-emerald-400/50 rounded-full h-[65%]" />
                  <div className="w-2.5 bg-emerald-400 rounded-full h-[95%] animate-[pulse_1.5s_infinite]" />
                  <div className="w-2.5 bg-emerald-400/40 rounded-full h-[55%]" />
                  <div className="w-2.5 bg-emerald-400/70 rounded-full h-[80%]" />
                </div>
              </div>

              {/* Floating Element 2: Trusted Badge (Middle Right - Shifted outward but within bounds) */}
              <div 
                className="absolute right-[-80px] lg:right-[-100px] top-[32%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl flex items-center gap-3 w-48 text-left z-20 transition-all hover:bg-white/15"
                style={{ animation: "float-medium 5s ease-in-out infinite 1s" }}
              >
                <div className="bg-emerald-500/20 text-emerald-300 p-2.5 rounded-xl flex-shrink-0 border border-emerald-400/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Trusted Partner</p>
                  <p className="text-sm font-bold text-white">100% Verified</p>
                </div>
              </div>

              {/* Floating Element 3: 24/7 Support (Bottom Left - Shifted outward but within bounds) */}
              <div 
                className="absolute left-[-80px] lg:left-[-100px] bottom-[25%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl flex items-center gap-3 w-44 text-left z-20 transition-all hover:bg-white/15"
                style={{ animation: "float-fast 5.5s ease-in-out infinite 0.5s" }}
              >
                <div className="bg-amber-500/20 text-amber-300 p-2.5 rounded-xl flex-shrink-0 border border-amber-400/30">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Pharmacy Care</p>
                  <p className="text-sm font-bold text-white">24/7 Support</p>
                </div>
              </div>
              
              {/* Floating Element 4: Quality Badge (Bottom Right - Shifted outward but within bounds) */}
              <div 
                className="absolute right-[-60px] lg:right-[-80px] bottom-[8%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl flex items-center gap-3 w-44 text-left z-20 transition-all hover:bg-white/15"
                style={{ animation: "float-slow 6.5s ease-in-out infinite 1.5s" }}
              >
                <div className="bg-sky-500/20 text-sky-300 p-2.5 rounded-xl flex-shrink-0 border border-sky-400/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Certified</p>
                  <p className="text-sm font-bold text-white">Top Quality</p>
                </div>
              </div>

              {/* Floating Element 5: Decorative Sparkle Icon (Top Right) */}
              <div 
                className="absolute right-[20px] lg:right-[30px] top-[5%] bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2.5 shadow-2xl flex items-center justify-center z-20 cursor-pointer hover:scale-110 transition-transform"
                style={{ animation: "float-medium 4s ease-in-out infinite 2s" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(8px) rotate(-1deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}
