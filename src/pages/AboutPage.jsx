import React from "react";
import { Lock, Zap, Heart, Clock, Shield, Brain, Users } from "lucide-react";

const AboutPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO (solid blue, SMALL + CENTERED) ================= */}
      <section className="relative bg-blue-600 text-white overflow-hidden py-10 md:py-12">
        {/* subtle blobs (kept small) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
              About Digital Healthcare Assistant
            </h1>
            <p className="text-base md:text-lg text-blue-100">
              Making healthcare simpler, safer, and smarter with reliable info and
              helpful digital tools.
            </p>
          </div>
        </div>
      </section>

      {/* ================= MISSION (button here on the left) ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left column — text + button */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                To democratize healthcare by providing everyone with access to
                reliable, personalized medical information and tools that empower
                informed health decisions.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We believe technology can bridge the gap between patients and
                healthcare providers, making medical knowledge more accessible
                while maintaining the highest standards of safety and accuracy.
              </p>

              {/* Button exactly under the mission text (left column) */}
              <button
                onClick={() => onNavigate && onNavigate("login")}
                className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Join Our Mission
              </button>
            </div>

            {/* Right column — feature cards grid */}
            <div className="grid grid-cols-2 gap-6">
              <FeatureCard
                icon={<Lock className="w-7 h-7 text-blue-600" />}
                title="Privacy First"
                text="Your health data is encrypted and secure"
              />
              <FeatureCard
                icon={<Zap className="w-7 h-7 text-green-600" />}
                title="Real-time"
                text="Instant access to health information"
              />
              <FeatureCard
                icon={<Heart className="w-7 h-7 text-purple-600" />}
                title="Personalized"
                text="Tailored to your unique health profile"
              />
              <FeatureCard
                icon={<Clock className="w-7 h-7 text-orange-600" />}
                title="Accessible"
                text="Available wherever you need it"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT WE OFFER ================= */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What We Offer
            </h3>
            <p className="text-lg text-black-600">
              Trusted healthcare tools and information at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <OfferCard
              icon={<Shield className="w-6 h-6 text-blue-600" />}
              title="Medicine Information Database"
              subtitle="Comprehensive coverage"
              text="Detailed information on medicines, interactions, and usage guidelines."
            />
            <OfferCard
              icon={<Brain className="w-6 h-6 text-blue-600" />}
              title="AI-Powered Health Insights"
              subtitle="Advanced precision"
              text="Personalized health recommendations powered by AI."
            />
            <OfferCard
              icon={<Users className="w-6 h-6 text-blue-600" />}
              title="Expert Medical Review"
              subtitle="Continuous verification"
              text="All content reviewed by licensed healthcare professionals."
            />
            <OfferCard
              icon={<Clock className="w-6 h-6 text-blue-600" />}
              title="24/7 Support"
              subtitle="Always available"
              text="Round-the-clock assistance for your healthcare needs."
            />
          </div>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-16 bg-white text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Join Our Growing Community
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Be part of a community that cares about health and wellness.
        </p>
        <button
          onClick={() => onNavigate && onNavigate("login")}
          className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:bg-blue-700"
        >
          Get Started Today
        </button>
      </section>
    </div>
  );
};

/* ---------- small reusable cards ---------- */
const FeatureCard = ({ icon, title, text }) => (
  <div className="rounded-2xl p-6 text-center border border-blue-100 bg-white shadow-sm">
    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
      {icon}
    </div>
    <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
);

const OfferCard = ({ icon, title, subtitle, text }) => (
  <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-blue-100">
    <div className="flex items-start gap-4 mb-4">
      <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-blue-600 font-medium">{subtitle}</p>
      </div>
    </div>
    <p className="text-gray-600 leading-relaxed">{text}</p>
  </div>
);

const Stat = ({ number, label }) => (
  <div>
    <h5 className="text-5xl font-bold text-white mb-2">{number}</h5>
    <p className="text-blue-100 text-lg font-medium">{label}</p>
  </div>
);

export default AboutPage;
