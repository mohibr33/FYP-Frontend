import { BookOpen, Pill, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: BookOpen,
    title: "Expert Medical Articles",
    description:
      "Access thousands of peer-reviewed articles written by healthcare professionals to stay informed about your health conditions.",
  },
  {
    icon: Pill,
    title: "Medicine Database",
    description:
      "Comprehensive information about common medications, including dosages, side effects, and interactions to keep you well-informed.",
  },
  {
    icon: Activity,
    title: "Health Tracking",
    description:
      "Monitor your health metrics, track medication schedules, and visualize your progress through intuitive dashboards.",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Comprehensive Healthcare Tools</h2>
          <p className="text-lg text-muted-foreground">Everything you need in one place</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-blue-100 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
