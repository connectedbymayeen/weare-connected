import Footer from "@/app/components/footer"
import Header from "@/app/components/header"

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-8 font-syne">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Introduction</h2>
                <p className="text-muted-foreground">
                  Connected ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, disclose, and safeguard your information when you visit our website or use our
                  services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                    <p>
                      We may collect personal information such as your name, email address, phone number, and company
                      information when you contact us or use our services.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Usage Information</h3>
                    <p>
                      We automatically collect information about how you interact with our website, including IP address,
                      browser type, pages visited, and time spent on our site.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 font-syne">How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>To provide and maintain our services</li>
                  <li>To communicate with you about our services</li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Information Sharing</h2>
                <p className="text-muted-foreground">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your
                  consent, except as described in this policy or as required by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Your Rights</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at privacy@connected.com or
                  through our contact form.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
