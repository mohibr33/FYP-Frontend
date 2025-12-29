import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, Clock, Sparkles, MessageSquare, Utensils, Pill, BookOpen, Activity, Heart, Stethoscope } from "lucide-react"

const featureCards = [
  {
    icon: MessageSquare,
    title: "AI Health Chat",
    description: "Instant medical guidance",
    href: "/auth/login",
    color: "teal",
  },
  {
    icon: Utensils,
    title: "Meal Planner",
    description: "Personalized nutrition",
    href: "/auth/login",
    color: "emerald",
  },
  {
    icon: Pill,
    title: "Medicines",
    description: "Drug information",
    href: "/medicines",
    color: "cyan",
  },
  {
    icon: BookOpen,
    title: "Articles",
    description: "Expert health content",
    href: "/articles",
    color: "slate",
  },
]

const colorMap: Record<string, { iconBg: string; iconBgDark: string; text: string; textDark: string }> = {
  teal: { iconBg: "bg-teal-100", iconBgDark: "dark:bg-teal-900/50", text: "text-teal-600", textDark: "dark:text-teal-400" },
  emerald: { iconBg: "bg-emerald-100", iconBgDark: "dark:bg-emerald-900/50", text: "text-emerald-600", textDark: "dark:text-emerald-400" },
  cyan: { iconBg: "bg-cyan-100", iconBgDark: "dark:bg-cyan-900/50", text: "text-cyan-600", textDark: "dark:text-cyan-400" },
  slate: { iconBg: "bg-slate-100", iconBgDark: "dark:bg-slate-700", text: "text-slate-600", textDark: "dark:text-slate-400" },
}

export default function Hero() {
  return (
    <section className="bg-white dark:bg-slate-900 py-16 md:py-20 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Main Hero Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-900/50 text-sm text-teal-700 dark:text-teal-400 mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Platform
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white leading-tight mb-6">
              Your Personal
              <span className="block text-teal-600 dark:text-teal-400">Health Assistant</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Get AI-powered health guidance, personalized meal plans, comprehensive medicine information, and expert health articles — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/auth/register">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 bg-white dark:bg-transparent border-slate-200 dark:border-slate-700 shadow-sm">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="hidden md:block relative">
            <div className="relative w-full h-[400px]">
              {/* Background circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-teal-100 dark:bg-teal-900/30 rounded-full opacity-50" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-teal-200 dark:bg-teal-800/40 rounded-full opacity-40" />
              
              {/* Center icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Stethoscope className="w-16 h-16 text-white" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-8 left-12 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg animate-pulse border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Heart Rate</p>
                    <p className="font-semibold text-slate-800 dark:text-white">98 BPM</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-16 right-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Health Score</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">Excellent</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-16 left-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl flex items-center justify-center">
                    <Pill className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Medicines</p>
                    <p className="font-semibold text-slate-800 dark:text-white">Tracked</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 right-16 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg animate-pulse border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Meal Plan</p>
                    <p className="font-semibold text-slate-800 dark:text-white">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - 4 in a row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featureCards.map((card, index) => {
            const Icon = card.icon
            const colors = colorMap[card.color]
            return (
              <Link 
                key={index}
                href={card.href}
                className="bg-teal-50/50 dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:bg-teal-50 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700"
              >
                <div className={`w-12 h-12 ${colors.iconBg} ${colors.iconBgDark} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${colors.text} ${colors.textDark}`} />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{card.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{card.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
