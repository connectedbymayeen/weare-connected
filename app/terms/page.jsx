export default function TermsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8 font-syne">Terms of Service</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Connected's website and services, you accept and agree to be bound by the terms
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Use License</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Permission is granted to temporarily download one copy of the materials on Connected's website for
                  personal, non-commercial transitory viewing only.
                </p>
                <p>This license shall automatically terminate if you violate any of these restrictions.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Disclaimer</h2>
              <p className="text-muted-foreground">
                The materials on Connected's website are provided on an 'as is' basis. Connected makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Limitations</h2>
              <p className="text-muted-foreground">
                In no event shall Connected or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on Connected's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Accuracy of Materials</h2>
              <p className="text-muted-foreground">
                The materials appearing on Connected's website could include technical, typographical, or photographic
                errors. Connected does not warrant that any of the materials on its website are accurate, complete, or
                current.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Modifications</h2>
              <p className="text-muted-foreground">
                Connected may revise these terms of service for its website at any time without notice. By using this
                website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 font-syne">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at legal@connected.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
