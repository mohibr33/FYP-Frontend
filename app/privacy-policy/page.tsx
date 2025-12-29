import { Shield, Lock, Eye, Database, UserCheck, Bell, FileText, Mail } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - Digital Health Assistant",
  description:
    "Learn how Digital Health Assistant collects, uses, and protects your personal and health information.",
}

const highlights = [
  {
    icon: Lock,
    title: "Data Encryption",
    description: "All data encrypted at rest and in transit using AES-256",
  },
  {
    icon: Eye,
    title: "No Data Selling",
    description: "We never sell your personal or health information",
  },
  {
    icon: UserCheck,
    title: "Your Control",
    description: "Access, export, or delete your data anytime",
  },
  {
    icon: Database,
    title: "Minimal Collection",
    description: "We only collect data essential for our services",
  },
]

export default function PrivacyPolicyPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-slate-300">
              <Shield className="w-4 h-4 text-teal-400" />
              Your Privacy Matters
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Privacy{" "}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal and health information.
            </p>
            <p className="text-sm text-slate-400">
              Last updated: December 29, 2025
            </p>
          </div>

          {/* Privacy Highlights */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Table of Contents */}
            <div className="bg-slate-50 border-b border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Table of Contents</h2>
              <nav className="grid sm:grid-cols-2 gap-2 text-sm">
                <a href="#information-we-collect" className="text-slate-600 hover:text-teal-600 transition">1. Information We Collect</a>
                <a href="#how-we-use" className="text-slate-600 hover:text-teal-600 transition">2. How We Use Your Information</a>
                <a href="#health-data" className="text-slate-600 hover:text-teal-600 transition">3. Health Information Protection</a>
                <a href="#data-sharing" className="text-slate-600 hover:text-teal-600 transition">4. Data Sharing & Disclosure</a>
                <a href="#data-security" className="text-slate-600 hover:text-teal-600 transition">5. Data Security</a>
                <a href="#your-rights" className="text-slate-600 hover:text-teal-600 transition">6. Your Rights & Choices</a>
                <a href="#cookies" className="text-slate-600 hover:text-teal-600 transition">7. Cookies & Tracking</a>
                <a href="#contact" className="text-slate-600 hover:text-teal-600 transition">8. Contact Us</a>
              </nav>
            </div>

            {/* Policy Sections */}
            <div className="p-6 md:p-8 space-y-10">
              {/* Section 1 */}
              <section id="information-we-collect">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">1. Information We Collect</h2>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>We collect information to provide you with personalized healthcare services:</p>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-slate-800">Personal Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>Name and email address when you create an account</li>
                      <li>Profile information such as age, gender, and contact details</li>
                      <li>Authentication data when using Google Sign-In</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-slate-800">Health Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>Health profile data (height, weight, medical conditions, allergies)</li>
                      <li>Dietary preferences and nutritional goals</li>
                      <li>Conversations with our AI health assistant</li>
                      <li>Medicine searches and interaction checks</li>
                      <li>Meal plans and health tracking data</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-slate-800">Technical Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>Device type, browser, and operating system</li>
                      <li>IP address and general location (country/region)</li>
                      <li>Usage patterns and feature interactions</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="how-we-use">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">2. How We Use Your Information</h2>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>Your information is used to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Provide Services:</strong> Deliver personalized health insights, meal plans, and medicine information</li>
                    <li><strong>AI Assistance:</strong> Power our AI chatbot to provide relevant health guidance based on your profile</li>
                    <li><strong>Improve Experience:</strong> Analyze usage patterns to enhance our platform and features</li>
                    <li><strong>Communication:</strong> Send important updates about your account and our services</li>
                    <li><strong>Safety:</strong> Detect and prevent fraudulent or harmful activities</li>
                    <li><strong>Support:</strong> Respond to your inquiries and support tickets</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section id="health-data">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">3. Health Information Protection</h2>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-emerald-800 font-medium mb-2">Special Protection for Health Data</p>
                    <p className="text-emerald-700">
                      We understand that health information is particularly sensitive. We apply additional safeguards to protect your health data in accordance with healthcare privacy best practices.
                    </p>
                  </div>
                  
                  <ul className="list-disc list-inside space-y-2">
                    <li>Health data is encrypted using industry-standard AES-256 encryption</li>
                    <li>Access to health information is strictly limited to essential personnel</li>
                    <li>We do not use your health data for advertising purposes</li>
                    <li>Health information is never sold to third parties</li>
                    <li>AI conversations are processed securely and not used to train external models</li>
                    <li>You can request deletion of all health data at any time</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section id="data-sharing">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">4. Data Sharing & Disclosure</h2>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>We may share your information only in limited circumstances:</p>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-slate-800">Service Providers</h4>
                    <p>We work with trusted partners who help us operate our services (hosting, analytics, AI processing). These providers are contractually bound to protect your data.</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-slate-800">Legal Requirements</h4>
                    <p>We may disclose information when required by law, court order, or to protect the rights, safety, or property of our users and the public.</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-slate-800">With Your Consent</h4>
                    <p>We will share your information with third parties when you explicitly authorize us to do so.</p>
                  </div>

                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                    <p className="text-rose-800 font-medium">We Never:</p>
                    <ul className="list-disc list-inside mt-2 text-rose-700 space-y-1">
                      <li>Sell your personal or health information</li>
                      <li>Share data with advertisers for targeted advertising</li>
                      <li>Provide data to insurance companies or employers</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="data-security">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">5. Data Security</h2>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>We implement comprehensive security measures to protect your data:</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-800 mb-2">Technical Safeguards</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>AES-256 encryption at rest</li>
                        <li>TLS 1.3 encryption in transit</li>
                        <li>Regular security audits</li>
                        <li>Secure cloud infrastructure</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-800 mb-2">Access Controls</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Role-based access control</li>
                        <li>Two-factor authentication</li>
                        <li>Session management</li>
                        <li>Activity logging</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="your-rights">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">6. Your Rights & Choices</h2>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>You have control over your personal information:</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-800 mb-2">Access & Portability</h4>
                      <p>Request a copy of all data we hold about you in a portable format.</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-800 mb-2">Correction</h4>
                      <p>Update or correct any inaccurate information in your profile.</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-800 mb-2">Deletion</h4>
                      <p>Request deletion of your account and associated data.</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-800 mb-2">Opt-Out</h4>
                      <p>Unsubscribe from marketing communications at any time.</p>
                    </div>
                  </div>

                  <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@digitalhealthassistant.com" className="text-teal-600 hover:underline">privacy@digitalhealthassistant.com</a> or through your account settings.</p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="cookies">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">7. Cookies & Tracking</h2>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Analytics Cookies:</strong> Understand how users interact with our platform</li>
                  </ul>
                  <p>You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect platform functionality.</p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="contact">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">8. Contact Us</h2>
                </div>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:privacy@digitalhealthassistant.com" className="text-teal-600 hover:underline">privacy@digitalhealthassistant.com</a></p>
                    <p><strong>Support:</strong> <Link href="/support" className="text-teal-600 hover:underline">Submit a Support Ticket</Link></p>
                  </div>

                  <p className="text-slate-500">
                    We will respond to your inquiry within 30 days. For urgent privacy concerns, please indicate so in your message subject line.
                  </p>
                </div>
              </section>

              {/* Policy Updates Notice */}
              <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Policy Updates</h4>
                    <p className="text-sm text-slate-600">
                      We may update this Privacy Policy periodically. We will notify you of significant changes via email or through a notice on our platform. Continued use of our services after changes constitutes acceptance of the updated policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-slate-800 to-slate-700">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Have Questions?</h2>
          <p className="text-slate-300">
            Our team is here to help you understand how we protect your privacy.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/support"
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-lg shadow-teal-500/25"
            >
              Contact Support
            </Link>
            <Link
              href="/about"
              className="border border-white/30 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-white/10 transition"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
