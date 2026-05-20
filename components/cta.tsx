import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Shield, Zap, Sparkles } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4 mx-4 md:mx-8 lg:mx-16 bg-black relative overflow-hidden mb-16 rounded-3xl">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 border-2 border-white rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Visual Cards */}
          <div className="hidden md:block relative">
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-600/50 rounded-xl flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 text-teal-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Health First</span>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center mt-6">
                <div className="w-12 h-12 bg-slate-600/50 rounded-xl flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-teal-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Secure Data</span>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-600/50 rounded-xl flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-teal-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">AI-Powered</span>
              </div>
              <div className="bg-teal-600 rounded-2xl p-6 flex flex-col items-center text-center mt-6">
                <div className="w-12 h-12 bg-teal-500/50 rounded-xl flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-white">100% Free</span>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to take control of your health?
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Join Digital Health Assistant today and get access to AI-powered health guidance, personalized meal plans, and comprehensive medical information — completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/auth/register">
                <Button size="lg" className="bg-teal-600 text-white hover:bg-teal-700">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
