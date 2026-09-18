import { Cpu, ShieldCheck, Activity, Truck, HeartHandshake, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutSystem() {
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-emerald-500" />,
      title: "Rochetta AI Chatbot Assist",
      desc: "Our smart AI agent provides 24/7 support. Consult regarding dosages, search for alternative medications, and get instant answers about stock availability.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: "Prescription Verification",
      desc: "Upload prescription scripts securely. Qualified pharmacists cross-examine every document alongside automated validation checks to guarantee security.",
    },
    {
      icon: <Activity className="w-8 h-8 text-emerald-500" />,
      title: "Smart Inventory Alerts",
      desc: "Automated real-time inventory management. Instantly notifies users and system administrators when crucial chronic medication stocks are low.",
    },
    {
      icon: <Truck className="w-8 h-8 text-emerald-500" />,
      title: "Cold-Chain Logistics",
      desc: "Delivering sensitive items (like insulin or vaccines) under temperature-controlled shipping to preserve pharmaceutical integrity all the way to your door.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Browse & Search",
      desc: "Find medicines or upload medical prescriptions directly through our catalog search.",
    },
    {
      step: "02",
      title: "Consult Rochetta AI",
      desc: "Chat with our virtual assistant for guidance on dosage, ingredients, and alternatives.",
    },
    {
      step: "03",
      title: "Pharmacist Validation",
      desc: "Licensed pharmacists review uploaded documents for regulated medical substances.",
    },
    {
      step: "04",
      title: "Express Delivery",
      desc: "Packaged securely and shipped with local express delivery in temperature-controlled containers.",
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-surface-page) dark:bg-[#121212] py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Unique Hero Banner */}
        <div className="bg-gradient-to-r from-[#0a3c2f] to-[#2c6e49] rounded-3xl overflow-hidden mb-16 relative shadow-2xl">
          {/* Background Vector Art circles */}
          <svg className="absolute inset-0 w-full h-full text-white/5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="90%" cy="10%" r="200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="10%" cy="90%" r="150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
          </svg>

          <div className="p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="md:w-3/5 text-left">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-400/20">
                System Overview
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6 leading-tight">
                Rochetta Smart Pharmacy Network
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8">
                Rochetta bridges the gap between digital convenience and pharmaceutical security. 
                Our platform incorporates intelligent prescription auditing, AI-powered dosage consultation, 
                and cold-chain courier tracking to construct a modern digital healthcare ecosystem.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/category/pain-relief"
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg active:scale-95 text-sm sm:text-base"
                >
                  Explore Products
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-3xl text-center w-64">
                <div className="absolute inset-0 bg-emerald-400/10 rounded-3xl blur-xl -z-10 animate-pulse"></div>
                <HeartHandshake className="w-16 h-16 text-emerald-300 mx-auto mb-4 animate-bounce" />
                <h4 className="text-lg font-bold text-white mb-1">Your Trustworthy Partner</h4>
                <p className="text-xs text-white/70">Certified Pharmacists & Automated Audits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: "10k+", label: "Delivered Orders" },
            { value: "24/7", label: "AI Consultation" },
            { value: "99.4%", label: "Accuracy Rating" },
            { value: "100%", label: "Secure Handling" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-(--color-surface-card) dark:bg-[#1e1e1e] border border-(--color-border-base) dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-3xl font-black text-emerald-600 dark:text-green-400 mb-1">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Core System Features */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              Designed For Health Security
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Rochetta integrates automation alongside licensed pharmacists to offer quick dispatching without sacrificing health safety.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feat, index) => (
              <div
                key={index}
                className="bg-(--color-surface-card) dark:bg-[#1e1e1e] hover:bg-emerald-500/5 border border-(--color-border-base) dark:border-gray-800 rounded-3xl p-8 shadow-sm transition-all hover:-translate-y-1 duration-300 text-left"
              >
                <div className="w-14 h-14 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feat.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The Workflow Path */}
        <div className="bg-(--color-surface-card) dark:bg-[#1e1e1e] border border-(--color-border-base) dark:border-gray-800 rounded-3xl p-8 sm:p-12 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              How Rochetta Operates
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              A smooth process from your first click to medication receipt.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4 relative">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col text-left relative z-10">
                <div className="text-5xl font-black text-emerald-500/10 dark:text-emerald-500/20 mb-4">{step.step}</div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {step.title}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
