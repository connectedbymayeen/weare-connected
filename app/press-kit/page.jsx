"use client"

import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Building, Download, ExternalLink, FileText, Globe, ImageIcon, Palette, Video } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function PressKitPage() {
  const [pressKitData, setPressKitData] = useState({
    items: [],
    grouped: {},
  })
  const [loading, setLoading] = useState(true)
  const [downloadingItems, setDownloadingItems] = useState(new Set())

  const fallbackLinks = {
    "Primary Logo (SVG)": "https://drive.google.com/drive/folders/1Iaa5D4P7qzBBU13mrHmNhJpDO3wsN4lv?usp=drive_link",
    "Brand Guidelines (PDF)": "https://drive.google.com/drive/folders/1Iaa5D4P7qzBBU13mrHmNhJpDO3wsN4lv?usp=drive_link"
  }

  useEffect(() => {
    fetchPressKitData()
  }, [])

  const fetchPressKitData = async () => {
    try {
      const response = await fetch("/api/content/press-kit")
      if (response.ok) {
        const data = await response.json()
        setPressKitData(data)
      }
    } catch (error) {
      console.error("Error fetching press kit data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (item) => {
    if (!item.file) {
      alert("File not available for download")
      return
    }

    setDownloadingItems((prev) => new Set(prev).add(item._id))

    try {
      // Use the direct download API route
      window.open(`/api/content/press-kit/file/${item._id}`, "_blank")

      // Also track the download
      await fetch("/api/content/press-kit/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item._id }),
      })
    } catch (error) {
      console.error("Error downloading file:", error)
      alert("Error downloading file. Please try again or contact support.")
    } finally {
      setTimeout(() => {
        setDownloadingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(item._id)
          return newSet
        })
      }, 2000) // Reset loading state after 2 seconds
    }
  }

  // UPDATED: Open Google Drive link on full press kit button click
  const handleCompleteKitDownload = () => {
    window.open("https://drive.google.com/drive/folders/1Iaa5D4P7qzBBU13mrHmNhJpDO3wsN4lv?usp=drive_link", "_blank")
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "logos":
        return <ImageIcon className="h-6 w-6 text-[#6529b2]" />
      case "brand-guidelines":
        return <Palette className="h-6 w-6 text-blue-600" />
      case "company-info":
        return <Building className="h-6 w-6 text-red-600" />
      case "photos":
        return <ImageIcon className="h-6 w-6 text-green-600" />
      case "videos":
        return <Video className="h-6 w-6 text-orange-600" />
      case "web-assets":
        return <Globe className="h-6 w-6 text-indigo-600" />
      default:
        return <FileText className="h-6 w-6 text-gray-600" />
    }
  }

  const getCategoryTitle = (category) => {
    switch (category) {
      case "logos":
        return "Logos"
      case "brand-guidelines":
        return "Brand Guidelines"
      case "company-info":
        return "Company Info"
      case "photos":
        return "Photos"
      case "videos":
        return "Videos"
      case "web-assets":
        return "Web Assets"
      default:
        return category
    }
  }

  const getCategoryDescription = (category) => {
    switch (category) {
      case "logos":
        return "Official Connected logos in various formats"
      case "brand-guidelines":
        return "Official brand standards and usage guidelines"
      case "company-info":
        return "Official company information and fact sheets"
      case "photos":
        return "High-resolution company and team photos"
      case "videos":
        return "Company videos and promotional content"
      case "web-assets":
        return "Digital assets for online use"
      default:
        return "Download specific assets as needed"
    }
  }

  const getDefaultAssets = (category) => {
    switch (category) {
      case "logos":
        return [
          { name: "Primary Logo (SVG)", fileType: "svg" },
          { name: "Logo Mark (PNG)", fileType: "png" },
          { name: "White Version (SVG)", fileType: "svg" },
          { name: "Black Version (SVG)", fileType: "svg" },
        ]
      case "brand-guidelines":
        return [
          { name: "Brand Guidelines (PDF)", fileType: "pdf" },
          { name: "Color Palette (PDF)", fileType: "pdf" },
          { name: "Typography Guide (PDF)", fileType: "pdf" },
        ]
      case "company-info":
        return [
          { name: "Company Fact Sheet", fileType: "pdf" },
          { name: "Executive Bios", fileType: "pdf" },
          { name: "Company Timeline", fileType: "pdf" },
        ]
      case "photos":
        return [
          { name: "Office Photos (ZIP)", fileType: "zip" },
          { name: "Team Photos (ZIP)", fileType: "zip" },
          { name: "Event Photos (ZIP)", fileType: "zip" },
        ]
      case "videos":
        return [
          { name: "Company Overview", fileType: "mp4" },
          { name: "CEO Interview", fileType: "mp4" },
          { name: "Office Tour", fileType: "mp4" },
        ]
      case "web-assets":
        return [
          { name: "Social Media Kit", fileType: "zip" },
          { name: "Banner Images", fileType: "zip" },
          { name: "Favicon Package", fileType: "zip" },
        ]
      default:
        return []
    }
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <Header />
  //       <div className="flex justify-center items-center py-20">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6529b2] mx-auto mb-4"></div>
  //           <p className="text-gray-600">Loading press kit...</p>
  //         </div>
  //       </div>
  //       <Footer />
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="bg-[#f3f1fd] text-white py-20 h-90 relative  flex items-center justify-center -mt-[140px] pt-[200px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#6529b2]">Press Kit</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Download our official brand assets, logos, and company information for media use.
          </p>
        </div>
      </section>

      {/* Quick Downloads Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Downloads</h2>
            <p className="text-gray-600 text-lg">Get everything you need in one package</p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border border-gray-200 hover:border-purple-300 bg-white transition-colors">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Press Kit</h3>
                <p className="text-gray-600 mb-6">
                  Includes all logos, brand guidelines, company information, and high-resolution images
                </p>
                <Button
                  className="bg-[#6529b2] hover:bg-purple-700 text-white px-6 py-3"
                  onClick={handleCompleteKitDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Press Kit (25MB)
                </Button>
                <p className="text-sm text-gray-500 mt-4">Last updated: January 2024 • ZIP format</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Individual Assets Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Individual Assets</h2>
            <p className="text-gray-600 text-lg">Download specific assets as needed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Show categories with real data */}
            {Object.entries(pressKitData.grouped).map(([category, items]) => (
              <Card key={category} className="border-[1px] border-gray-50 hover:shadow-lg bg-white transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {getCategoryIcon(category)}
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">{getCategoryTitle(category)}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">{getCategoryDescription(category)}</p>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.fileType && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {item.fileType.toUpperCase()}
                              </span>
                            )}
                            {item.fileSize && <span className="text-xs text-gray-500">{item.fileSize}</span>}
                            {item.file ? (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Available</span>
                            ) : (
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                No File
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {item.file ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#6529b2] hover:text-purple-700 hover:bg-purple-50"
                                onClick={() => handleDownload(item)}
                                disabled={downloadingItems.has(item._id)}
                              >
                                {downloadingItems.has(item._id) ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#6529b2]"></div>
                                ) : (
                                  <Download className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                asChild
                              >
                                <a href={item.file} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-gray-400 cursor-not-allowed" disabled>
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Show default categories when no data or fill missing categories */}
            {["logos", "brand-guidelines", "company-info", "photos", "videos", "web-assets"].map((categoryKey) => {
              if (pressKitData.grouped[categoryKey]) return null // Skip if we have real data

              const defaultAssets = getDefaultAssets(categoryKey)
              return (
                <Card key={categoryKey} className="border border-gray-100 bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {getCategoryIcon(categoryKey)}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{getCategoryTitle(categoryKey)}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">{getCategoryDescription(categoryKey)}</p>

                    <div className="space-y-3">
                      {defaultAssets.map((asset, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">{asset.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                {asset.fileType.toUpperCase()}
                              </span>
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                Coming Soon
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 cursor-not-allowed" disabled>
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Usage Guidelines Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Usage Guidelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Do's */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Do
                </h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Use official logos and colors</li>
                  <li>• Maintain proper spacing around logos</li>
                  <li>• Use high-resolution images</li>
                  <li>• Follow brand guidelines</li>
                  <li>• Credit Connected appropriately</li>
                  <li>• Contact us for custom requests</li>
                </ul>
              </CardContent>
            </Card>

            {/* Don'ts */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <span className="text-red-600 mr-2">✗</span>
                  Don't
                </h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Modify or distort logos</li>
                  <li>• Use unauthorized colors</li>
                  <li>• Place logos on busy backgrounds</li>
                  <li>• Use low-resolution images</li>
                  <li>• Misrepresent our company</li>
                  <li>• Use assets for commercial purposes without permission</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Media Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Contact</h2>
          <p className="text-gray-600 text-lg mb-8">Need additional assets or have questions about usage?</p>

          <Card className="max-w-md mx-auto bg-white">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Press Relations</h3>
              <p className="text-gray-600 mb-2">press@connected.com</p>
              <p className="text-gray-600 mb-6">+1 (415) 555-0123</p>
              <Button className="bg-[#6529b2] hover:bg-purple-700 text-white" asChild>
                <Link href="mailto:press@connected.com">Contact Media Team</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  )
}
