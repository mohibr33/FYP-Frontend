import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-blue-100">
            Join thousands of patients who trust Digital Health Assistant for their healthcare information needs. Start
            your journey to better health today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/articles">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/medicines">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600 bg-transparent">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
