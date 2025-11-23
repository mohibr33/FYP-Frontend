import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-background via-background to-blue-50/30 py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
                Everything You Need for
                <span className="text-blue-600"> Better Health</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our comprehensive platform brings together all the tools and information you need to take control of
                your healthcare journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/articles">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/medicines">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50 bg-transparent w-full sm:w-auto"
                >
                  Explore Medicines
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-sm">
              <Image
                src="/healthcare-medical-professional-consulting-patient.jpg"
                alt="Healthcare professional consulting with patient"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
