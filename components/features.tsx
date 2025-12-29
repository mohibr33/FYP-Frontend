import { MessageSquare, Utensils, Pill, BookOpen, ArrowRight, Bot, Salad, Search, FileText, Brain, Apple, Tablets, Newspaper } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: MessageSquare,
    title: "AI Health Chat",
    description: "Get instant answers to your health questions from our intelligent AI assistant. Ask about symptoms, treatments, or general health advice.",
    href: "/auth/login",
    color: "teal",
    visual: Brain,
    features: ["24/7 availability", "Medical knowledge", "Instant responses"],
  },
  {
    icon: Utensils,
    title: "Meal Planner",
    description: "Generate personalized meal plans tailored to your health profile, dietary preferences, and specific medical conditions.",
    href: "/auth/login",
    color: "emerald",
    visual: Apple,
    features: ["Custom diets", "Nutrition tracking", "Recipe suggestions"],
  },
  {
    icon: Pill,
    title: "Medicine Database",
    description: "Search comprehensive drug information including dosages, side effects, interactions, and usage guidelines.",
    href: "/medicines",
    color: "cyan",
    visual: Tablets,
    features: ["Drug interactions", "Side effects", "Dosage info"],
  },
  {
    icon: BookOpen,
    title: "Health Articles",
    description: "Read expert-written articles covering diseases, treatments, preventive care, and healthy living tips.",
    href: "/articles",
    color: "slate",
    visual: Newspaper,
    features: ["Expert content", "Latest research", "Health tips"],
  },
]

const colorMap: Record<string, { iconBg: string; text: string; accent: string; lightBg: string }> = {
  teal: { iconBg: "bg-teal-100", text: "text-teal-600", accent: "bg-teal-500", lightBg: "bg-teal-50" },
  emerald: { iconBg: "bg-emerald-100", text: "text-emerald-600", accent: "bg-emerald-500", lightBg: "bg-emerald-50" },
  cyan: { iconBg: "bg-cyan-100", text: "text-cyan-600", accent: "bg-cyan-500", lightBg: "bg-cyan-50" },
  slate: { iconBg: "bg-slate-100", text: "text-slate-600", accent: "bg-slate-500", lightBg: "bg-slate-50" },
}

export default function Features() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive tools to help you understand and manage your health better.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            const Visual = service.visual
            const colors = colorMap[service.color]
            return (
              <Link 
                key={index} 
                href={service.href}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all relative overflow-hidden border border-slate-100"
              >
                {/* Accent bar */}
                <div className={`absolute top-0 left-0 w-1 h-full ${colors.accent}`} />
                
                {/* Background visual */}
                <div className={`absolute -bottom-4 -right-4 w-32 h-32 ${colors.lightBg} rounded-full opacity-50 group-hover:opacity-70 transition-opacity`}>
                  <Visual className={`w-16 h-16 ${colors.text} opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />
                </div>
                
                <div className="flex gap-5 relative z-10">
                  <div className="pl-4 space-y-4 flex-1">
                    {/* Icon */}
                    <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${colors.text}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-slate-800">{service.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{service.description}</p>
                    </div>
                    
                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className={`text-xs px-2 py-1 ${colors.lightBg} ${colors.text} rounded-full`}>
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Link */}
                    <div className={`inline-flex items-center gap-1.5 text-sm font-medium ${colors.text} group-hover:gap-2.5 transition-all`}>
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
