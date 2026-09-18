import { RefreshCcw, FileText, Truck, Lock } from "lucide-react";
import policyImage from "../assets/Profile/policy-hero.webp";

export default function Policy() {
  const policies = [
    {
      icon: (
        <Lock className="w-6 h-6 text-(--color-primary-600) dark:text-green-400" />
      ),
      title: "1. Privacy & Data Security",
      content:
        "Your medical records and order history are strictly confidential. We use advanced encryption to protect your personal and payment information. We never sell your data to third parties.",
    },
    {
      icon: (
        <FileText className="w-6 h-6 text-(--color-primary-600) dark:text-green-400" />
      ),
      title: "2. Prescription Regulations",
      content:
        "Medications marked as 'Requires Prescription' cannot be dispensed without a valid, unexpired prescription from a licensed healthcare professional. Our pharmacists reserve the right to verify or reject any prescription.",
    },
    {
      icon: (
        <RefreshCcw className="w-6 h-6 text-(--color-primary-600) dark:text-green-400" />
      ),
      title: "3. Return & Refund Policy",
      content:
        "Standard medicines can be returned within 14 days if unopened. Items requiring refrigeration (e.g., insulin) or personalized compounds cannot be returned under any circumstances due to safety regulations.",
    },
    {
      icon: (
        <Truck className="w-6 h-6 text-(--color-primary-600) dark:text-green-400" />
      ),
      title: "4. Shipping & Delivery",
      content:
        "We strive to deliver within 2-4 business days. Rochetta is not liable for delays caused by incorrect addresses provided by the user. Urgent deliveries are subject to local availability.",
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-surface-page) dark:bg-[#121212] py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-(--color-surface-card) dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-(--color-border-base) dark:border-gray-800 overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-black text-(--color-text-primary) dark:text-white mb-4 leading-tight">
                Terms & Privacy Policy
              </h1>
              <p className="text-lg text-(--color-text-secondary) dark:text-gray-400 leading-relaxed">
                At Rochetta, we prioritize your health, privacy, and security.
                Please read our guidelines to understand how we protect you and
                what we expect from our users.
              </p>
            </div>
            <div className="md:w-1/2 bg-(--color-surface-page) dark:bg-[#252525] p-8 flex justify-center items-center">
              <img
                src={policyImage}
                alt="Security and Terms Illustration"
                className="max-w-full h-auto object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-(--color-surface-card) dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-(--color-border-base) dark:border-gray-800 p-8 md:p-12">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-(--color-text-primary) dark:text-white mb-4">
              Agreement of Terms
            </h2>
            <p className="text-(--color-text-secondary) dark:text-gray-400 leading-relaxed">
              By accessing and using the Rochetta platform, you agree to be
              bound by these Terms and Conditions. If you do not agree with any
              part of these terms, please do not use our services. These terms
              apply to all visitors, users, and others who access the pharmacy
              marketplace.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {policies.map((policy, index) => (
              <div
                key={index}
                className="bg-(--color-surface-page) dark:bg-[#252525] rounded-2xl p-6 border border-(--color-border-base) dark:border-gray-700 hover:border-(--color-primary-300) dark:hover:border-green-700 transition-colors"
              >
                <div className="w-12 h-12 bg-(--color-surface-card) dark:bg-[#1e1e1e] rounded-xl shadow-sm flex items-center justify-center mb-4 border border-(--color-border-base) dark:border-gray-700">
                  {policy.icon}
                </div>
                <h3 className="text-xl font-bold text-(--color-text-primary) dark:text-white mb-3">
                  {policy.title}
                </h3>
                <p className="text-(--color-text-secondary) dark:text-gray-400 leading-relaxed">
                  {policy.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
