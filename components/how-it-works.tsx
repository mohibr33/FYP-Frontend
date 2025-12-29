import { UserPlus, ClipboardList, Sparkles, ArrowRight, CheckCircle, User, Settings, Wand2 } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    visualIcon: User,
    title: "Create your account",
    description: "Sign up for free in seconds using your email or Google account.",
    color: "teal",
  },
  {
    number: "02",
    icon: ClipboardList,
    visualIcon: Settings,
    title: "Set up your profile",
    description: "Add your health information, dietary preferences, and medical conditions.",
    color: "cyan",
  },
  {
    number: "03",
    icon: Sparkles,
    visualIcon: Wand2,
    title: "Get personalized guidance",
    description: "Access AI-powered recommendations tailored to your unique health needs.",
    color: "emerald",
  },
]

const colorMap: Record<string, { iconBg: string; text: string; lightBg: string }> = {
  teal: { iconBg: "bg-teal-100", text: "text-teal-600", lightBg: "bg-teal-50" },
  cyan: { iconBg: "bg-cyan-100", text: "text-cyan-600", lightBg: "bg-cyan-50" },
  emerald: { iconBg: "bg-emerald-100", text: "text-emerald-600", lightBg: "bg-emerald-50" },
}

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 text-sm text-teal-700 mb-4">
            <CheckCircle className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started in just a few simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-200 via-cyan-200 to-emerald-200" />
          
          {steps.map((step, index) => {
            const Icon = step.icon
            const VisualIcon = step.visualIcon
            const colors = colorMap[step.color]
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all text-center relative group">
                {/* Visual background decoration */}
                <div className={`absolute top-4 right-4 w-20 h-20 ${colors.lightBg} rounded-full opacity-50 group-hover:opacity-70 transition-opacity`}>
                  <VisualIcon className={`w-10 h-10 ${colors.text} opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />
                </div>
                
                {/* Step Number Badge */}
                <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-600 text-white rounded-full text-sm font-bold mb-6 relative z-10">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Icon className={`w-8 h-8 ${colors.text}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                
                {/* Arrow indicator */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md items-center justify-center z-10">
                    <ArrowRight className="w-4 h-4 text-teal-600" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
