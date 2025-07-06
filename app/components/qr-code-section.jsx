"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode } from "lucide-react"

export default function QrCodeSection() {
  const [url, setUrl] = useState("https://connected.com")
  const [qrCodeUrl, setQrCodeUrl] = useState(
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://connected.com`,
  )

  const generateQrCode = () => {
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`)
  }

  return (
    <section className="w-full py-12 md:py-24 bg-lynx-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm font-medium text-primary">
              QR Code Generator
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Create Your QR Code</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Generate a custom QR code for your website, social media, or any URL.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Enter URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <Button onClick={generateQrCode} className="w-full">
                  <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Scan this QR code with your mobile device</p>
          </div>
        </div>
      </div>
    </section>
  )
}
