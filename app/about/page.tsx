import { BookOpen, Pill, Activity, Heart, Shield, Clock, Zap, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  },
  {
    icon: Zap,
    title: "Real-time",
    description: "Instant access to health information",
  },
  {
    icon: Heart,
    title: "Personalized",
    description: "Tailored to your unique health profile",
  },
  {
    icon: Clock,
    title: "Accessible",
    description: "Available wherever you need it",
  },
]

const services = [
  {
    icon: Pill,
    title: "Medicine Information Database",
    description: "Comprehensive coverage of detailed information on medicines, interactions, and usage guidelines.",
  },
  {
    icon: Activity,
    title: "AI-Powered Health Insights",
    description: "Advanced precision with personalized health recommendations powered by AI.",
  },
  {
    icon: Users,
    title: "Expert Medical Review",
    description: "Continuous verification - all content reviewed by licensed healthcare professionals.",
  },
  {
    icon: BookOpen,
    title: "24/7 Support",
    description: "Round-the-clock assistance for your healthcare needs through live chat with medical professionals.",
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Our Mission</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            To democratize healthcare by providing everyone with access to reliable, personalized medical information
            and tools that empower informed health decisions.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            We believe technology can bridge the gap between patients and healthcare providers, making medical knowledge
            more accessible while maintaining the highest standards of safety and accuracy.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">Our Core Values</h2>
            <p className="text-muted-foreground">Guiding principles that shape everything we do</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="border-blue-100 text-center">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-foreground text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">What We Offer</h2>
            <p className="text-muted-foreground">Trusted healthcare tools and information at your fingertips</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="border-blue-100 hover:border-blue-300 transition-colors">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-foreground">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">Advanced Healthcare Modules</h2>
            <p className="text-muted-foreground">Comprehensive tools for managing your health</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">AI Meal Planner</h3>
              <p className="text-sm text-muted-foreground">
                Personalized nutrition recommendations based on your health profile and dietary needs.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">Medicine Interaction Checker</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive drug interaction analysis to keep you safe while taking multiple medications.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">Medication Adherence Module</h3>
              <p className="text-sm text-muted-foreground">
                Stay on track with medication schedules and receive intelligent reminders for missed doses.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">Dosage Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Accurate dosage calculations based on patient demographics and medical conditions.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">Lab Test Analyzer</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered analysis of lab results with trend graphs and comprehensive health insights.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">Stress & Wellness Support</h3>
              <p className="text-sm text-muted-foreground">
                Mood tracking, anonymous journaling, meditation exercises, and wellness resources.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">Rehabilitation & Recovery</h3>
              <p className="text-sm text-muted-foreground">
                Physiotherapy guides, recovery checklists, FAQs, and post-surgery diet recommendations.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">24/7 Medical Support</h3>
              <p className="text-sm text-muted-foreground">
                Live chat with medical professionals available round-the-clock for your health questions.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-foreground mb-2">Multi-Format Support</h3>
              <p className="text-sm text-muted-foreground">
                Upload lab reports and medical documents in various formats for comprehensive analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Join Our Mission</h2>
          <p className="text-lg text-blue-100">
            Start your journey to better health today. Join thousands of patients who trust Digital Health Care
            Assistant for their healthcare information needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Get Started Free
            </a>
            <a
              href="/articles"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
