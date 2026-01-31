import { Heart, Shield, Clock, Zap, Sparkles, Utensils, FlaskConical, Bell, Calculator, TestTube, Brain, Stethoscope } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "About Us - Digital Health Assistant",
  description:
    "Learn about our mission to democratize healthcare and empower patients with reliable medical information.",
}

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your health data is encrypted and secure",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
  },
  {
    icon: Zap,
    title: "Real-time",
    description: "Instant access to health information",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/30",
  },
  {
    icon: Heart,
    title: "Personalized",
    description: "Tailored to your unique health profile",
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
    borderColor: "border-rose-500/30",
  },
  {
    icon: Clock,
    title: "Accessible",
    description: "Available wherever you need it",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* Dark Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-24 px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-slate-300">
              <Sparkles className="w-4 h-4 text-teal-400" />
              About Digital Health Assistant
            </div>
          </div>

          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Our{" "}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Mission
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              To democratize healthcare by providing everyone with access to reliable, personalized medical information
              and tools that empower informed health decisions.
            </p>
            <p className="text-base text-slate-400 max-w-3xl mx-auto">
              We believe technology can bridge the gap between patients and healthcare providers, making medical knowledge
              more accessible while maintaining the highest standards of safety and accuracy.
            </p>
          </div>

          {/* Core Values - Inline in dark hero */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className={`${value.bgColor} ${value.borderColor} border rounded-xl p-5 text-center`}
                >
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className={`w-6 h-6 ${value.color}`} />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{value.title}</h3>
                  <p className="text-sm text-slate-300">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Advanced Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Healthcare Modules</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Comprehensive tools designed to help you manage every aspect of your health journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* AI Meal Planner */}
            <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">AI Meal Planner</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Personalized nutrition recommendations based on your health profile and dietary needs.
              </p>
            </div>

            {/* Medicine Interaction Checker */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Interaction Checker</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Comprehensive drug interaction analysis to keep you safe with multiple medications.
              </p>
            </div>

            {/* Dosage Calculator */}
            <div className="group relative bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-2xl border border-cyan-100 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Dosage Calculator</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Accurate dosage calculations based on demographics and medical conditions.
              </p>
            </div>

            {/* Lab Test Analyzer */}
            <div className="group relative bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Lab Test Analyzer</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                AI-powered analysis of lab results with trend graphs and health insights.
              </p>
            </div>

            {/* Stress & Wellness */}
            <div className="group relative bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-2xl border border-violet-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Wellness Support</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Mood tracking, journaling, meditation exercises, and wellness resources.
              </p>
            </div>

            {/* Rehabilitation */}
            <div className="group relative bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Rehab & Recovery</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Physiotherapy guides, recovery checklists, and post-surgery recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-800 to-slate-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Join Our Mission</h2>
          <p className="text-lg text-slate-300">
            Start your journey to better health today. Join thousands of patients who trust Digital Health Care
            Assistant for their healthcare information needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg shadow-teal-500/25"
            >
              Get Started Free
            </Link>
            <Link
              href="/articles"
              className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
