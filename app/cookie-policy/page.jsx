import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Header from "../components/header"
import Footer from "../components/footer"

export const metadata = {
  title: "Cookie Policy | Connected",
  description: "Learn about how Connected uses cookies and similar technologies.",
}

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-white to-purple-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-4 font-syne">Cookie Policy</h1>
              <p className="text-xl text-muted-foreground">
                Learn about how Connected uses cookies and similar technologies
              </p>
              <p className="text-sm text-muted-foreground mt-2">Last updated: June 12, 2024</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a
                  website. They are widely used to make websites work more efficiently and to provide information to
                  website owners.
                </p>
                <p>
                  At Connected, we use cookies and similar technologies to enhance your browsing experience, analyze
                  website traffic, and personalize content and advertisements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are necessary for the website to function properly. They enable basic functions like
                    page navigation and access to secure areas of the website. The website cannot function properly
                    without these cookies.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies help us understand how visitors interact with our website by collecting and reporting
                    information anonymously. This helps us improve our website's performance and user experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies enable the website to provide enhanced functionality and personalization. They may be
                    set by us or by third-party providers whose services we have added to our pages.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Marketing Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are used to track visitors across websites. The intention is to display ads that are
                    relevant and engaging for the individual user and thereby more valuable for publishers and
                    third-party advertisers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We may use third-party services that place cookies on your device. These services include:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Google Analytics - for website analytics and performance monitoring</li>
                  <li>Google Ads - for advertising and remarketing purposes</li>
                  <li>Facebook Pixel - for social media advertising and analytics</li>
                  <li>LinkedIn Insight Tag - for professional network advertising</li>
                  <li>Hotjar - for user behavior analysis and feedback collection</li>
                </ul>
                <p>
                  These third parties have their own privacy policies and cookie policies, which we encourage you to
                  review.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managing Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You have several options for managing cookies:</p>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Browser Settings</h3>
                  <p className="text-muted-foreground mb-2">
                    Most web browsers allow you to control cookies through their settings preferences. You can:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Block all cookies</li>
                    <li>Allow only first-party cookies</li>
                    <li>Delete cookies when you close your browser</li>
                    <li>Have your browser notify you when a cookie is being set</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Cookie Banner</h3>
                  <p className="text-muted-foreground">
                    When you first visit our website, you'll see a cookie banner that allows you to accept or decline
                    non-essential cookies. You can change your preferences at any time by clicking the "Cookie Settings"
                    link in our website footer.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Opt-Out Links</h3>
                  <p className="text-muted-foreground mb-2">
                    You can opt out of certain third-party cookies by visiting:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Google Analytics: https://tools.google.com/dlpage/gaoptout</li>
                    <li>Google Ads: https://adssettings.google.com/</li>
                    <li>Facebook: https://www.facebook.com/settings?tab=ads</li>
                    <li>LinkedIn: https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact of Disabling Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  While you can browse our website with cookies disabled, please note that disabling cookies may affect
                  your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Some features of our website may not function properly</li>
                  <li>You may need to re-enter information more frequently</li>
                  <li>Personalized content and recommendations may not be available</li>
                  <li>We may not be able to remember your preferences</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                  operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                  updated policy on our website and updating the "Last updated" date.
                </p>
                <p>
                  We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies
                  and similar technologies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>If you have any questions about this Cookie Policy or our use of cookies, please contact us:</p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: privacy@connected.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>
                    Address: 123 Innovation Drive
                    <br />
                    Tech Valley, CA 94000
                    <br />
                    United States
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
