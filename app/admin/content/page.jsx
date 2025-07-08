"use client"

import { useToast } from "@/app/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function ContentManagement() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/site")
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      }
    } catch (error) {
      console.error("Error fetching content:", error)
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Content saved successfully",
        })
      } else {
        throw new Error("Failed to save content")
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (path, value) => {
    setContent((prev) => {
      const newContent = { ...prev }
      const keys = path.split(".")
      let current = newContent

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newContent
    })
  }

  const addStat = () => {
    const newStat = { value: "", label: "" }
    const currentStats = content?.homepage?.hero?.stats || []
    updateContent("homepage.hero.stats", [...currentStats, newStat])
  }

  const removeStat = (index) => {
    const currentStats = content?.homepage?.hero?.stats || []
    const newStats = currentStats.filter((_, i) => i !== index)
    updateContent("homepage.hero.stats", newStats)
  }

  const updateStat = (index, field, value) => {
    const currentStats = content?.homepage?.hero?.stats || []
    const newStats = [...currentStats]
    newStats[index] = { ...newStats[index], [field]: value }
    updateContent("homepage.hero.stats", newStats)
  }

  const addValue = () => {
    const newValue = { number: "", title: "", description: "" }
    const currentValues = content?.homepage?.about?.values || []
    updateContent("homepage.about.values", [...currentValues, newValue])
  }

  const removeValue = (index) => {
    const currentValues = content?.homepage?.about?.values || []
    const newValues = currentValues.filter((_, i) => i !== index)
    updateContent("homepage.about.values", newValues)
  }

  const updateValue = (index, field, value) => {
    const currentValues = content?.homepage?.about?.values || []
    const newValues = [...currentValues]
    newValues[index] = { ...newValues[index], [field]: value }
    updateContent("homepage.about.values", newValues)
  }

  // About page functions
  const addAboutValue = () => {
    const newValue = { number: "", title: "", description: "" }
    const currentValues = content?.about?.values || []
    updateContent("about.values", [...currentValues, newValue])
  }

  const removeAboutValue = (index) => {
    const currentValues = content?.about?.values || []
    const newValues = currentValues.filter((_, i) => i !== index)
    updateContent("about.values", newValues)
  }

  const updateAboutValue = (index, field, value) => {
    const currentValues = content?.about?.values || []
    const newValues = [...currentValues]
    newValues[index] = { ...newValues[index], [field]: value }
    updateContent("about.values", newValues)
  }

  const addWhatWeDo = () => {
    const newItem = ""
    const currentItems = content?.about?.whatWeDo || []
    updateContent("about.whatWeDo", [...currentItems, newItem])
  }

  const removeWhatWeDo = (index) => {
    const currentItems = content?.about?.whatWeDo || []
    const newItems = currentItems.filter((_, i) => i !== index)
    updateContent("about.whatWeDo", newItems)
  }

  const updateWhatWeDo = (index, value) => {
    const currentItems = content?.about?.whatWeDo || []
    const newItems = [...currentItems]
    newItems[index] = value
    updateContent("about.whatWeDo", newItems)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage your website content across all pages</p>
        </div>
        <Button onClick={saveContent} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="offices">Offices</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
        </TabsList>

        {/* Homepage Content */}
        <TabsContent value="homepage" className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={content?.homepage?.hero?.title || ""}
                  onChange={(e) => updateContent("homepage.hero.title", e.target.value)}
                  placeholder="Enter hero title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={content?.homepage?.hero?.subtitle || ""}
                  onChange={(e) => updateContent("homepage.hero.subtitle", e.target.value)}
                  placeholder="Enter hero subtitle"
                  rows={3}
                />
              </div>

              {/* Hero Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Hero Statistics</Label>
                  <Button onClick={addStat} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stat
                  </Button>
                </div>
                {content?.homepage?.hero?.stats?.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Input
                      placeholder="Value (e.g., 5+)"
                      value={stat.value}
                      onChange={(e) => updateStat(index, "value", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Label (e.g., Ventures Built)"
                      value={stat.label}
                      onChange={(e) => updateStat(index, "label", e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => removeStat(index)} size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Title</Label>
                <Input
                  id="about-title"
                  value={content?.homepage?.about?.title || ""}
                  onChange={(e) => updateContent("homepage.about.title", e.target.value)}
                  placeholder="Enter about title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-description">Description</Label>
                <Textarea
                  id="about-description"
                  value={content?.homepage?.about?.description || ""}
                  onChange={(e) => updateContent("homepage.about.description", e.target.value)}
                  placeholder="Enter about description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-vision">Vision</Label>
                <Textarea
                  id="about-vision"
                  value={content?.homepage?.about?.vision || ""}
                  onChange={(e) => updateContent("homepage.about.vision", e.target.value)}
                  placeholder="Enter company vision"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-mission">Mission</Label>
                <Textarea
                  id="about-mission"
                  value={content?.homepage?.about?.mission || ""}
                  onChange={(e) => updateContent("homepage.about.mission", e.target.value)}
                  placeholder="Enter company mission"
                  rows={3}
                />
              </div>

              {/* Company Values */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Company Values</Label>
                  <Button onClick={addValue} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Value
                  </Button>
                </div>
                {content?.homepage?.about?.values?.map((value, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Number (e.g., 01)"
                        value={value.number}
                        onChange={(e) => updateValue(index, "number", e.target.value)}
                        className="w-20"
                      />
                      <Input
                        placeholder="Title (e.g., Innovation)"
                        value={value.title}
                        onChange={(e) => updateValue(index, "title", e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={() => removeValue(index)} size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Description"
                      value={value.description}
                      onChange={(e) => updateValue(index, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ventures Section */}
          <Card>
            <CardHeader>
              <CardTitle>Ventures Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ventures-title">Title</Label>
                <Input
                  id="ventures-title"
                  value={content?.homepage?.ventures?.title || ""}
                  onChange={(e) => updateContent("homepage.ventures.title", e.target.value)}
                  placeholder="Enter ventures title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ventures-subtitle">Subtitle</Label>
                <Textarea
                  id="ventures-subtitle"
                  value={content?.homepage?.ventures?.subtitle || ""}
                  onChange={(e) => updateContent("homepage.ventures.subtitle", e.target.value)}
                  placeholder="Enter ventures subtitle"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-title">Title</Label>
                <Input
                  id="contact-title"
                  value={content?.homepage?.contact?.title || ""}
                  onChange={(e) => updateContent("homepage.contact.title", e.target.value)}
                  placeholder="Enter contact title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-description">Description</Label>
                <Textarea
                  id="contact-description"
                  value={content?.homepage?.contact?.description || ""}
                  onChange={(e) => updateContent("homepage.contact.description", e.target.value)}
                  placeholder="Enter contact description"
                  rows={3}
                />
              </div>

              {/* Office Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="office-address">Office Address</Label>
                  <Input
                    id="office-address"
                    value={content?.homepage?.contact?.office?.address || ""}
                    onChange={(e) => updateContent("homepage.contact.office.address", e.target.value)}
                    placeholder="Enter office address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="office-city">City</Label>
                  <Input
                    id="office-city"
                    value={content?.homepage?.contact?.office?.city || ""}
                    onChange={(e) => updateContent("homepage.contact.office.city", e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="office-country">Country</Label>
                  <Input
                    id="office-country"
                    value={content?.homepage?.contact?.office?.country || ""}
                    onChange={(e) => updateContent("homepage.contact.office.country", e.target.value)}
                    placeholder="Enter country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    value={content?.homepage?.contact?.phone || ""}
                    onChange={(e) => updateContent("homepage.contact.phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Email Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email-general">General Email</Label>
                  <Input
                    id="email-general"
                    value={content?.homepage?.contact?.emails?.general || ""}
                    onChange={(e) => updateContent("homepage.contact.emails.general", e.target.value)}
                    placeholder="Enter general email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-business">Business Email</Label>
                  <Input
                    id="email-business"
                    value={content?.homepage?.contact?.emails?.business || ""}
                    onChange={(e) => updateContent("homepage.contact.emails.business", e.target.value)}
                    placeholder="Enter business email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-careers">Careers Email</Label>
                  <Input
                    id="email-careers"
                    value={content?.homepage?.contact?.emails?.careers || ""}
                    onChange={(e) => updateContent("homepage.contact.emails.careers", e.target.value)}
                    placeholder="Enter careers email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-hours">Business Hours</Label>
                <Input
                  id="contact-hours"
                  value={content?.homepage?.contact?.hours || ""}
                  onChange={(e) => updateContent("homepage.contact.hours", e.target.value)}
                  placeholder="Enter business hours"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Page Content */}
        <TabsContent value="about" className="space-y-6">
          {/* About Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Page Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-hero-title">Title</Label>
                <Input
                  id="about-hero-title"
                  value={content?.about?.hero?.title || ""}
                  onChange={(e) => updateContent("about.hero.title", e.target.value)}
                  placeholder="Enter about page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-hero-subtitle">Subtitle</Label>
                <Textarea
                  id="about-hero-subtitle"
                  value={content?.about?.hero?.subtitle || ""}
                  onChange={(e) => updateContent("about.hero.subtitle", e.target.value)}
                  placeholder="Enter about page subtitle"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* About Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>About Main Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-description">Main Description</Label>
                <Textarea
                  id="about-description"
                  value={content?.about?.description || ""}
                  onChange={(e) => updateContent("about.description", e.target.value)}
                  placeholder="Enter main about description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-tagline">Hero Tagline</Label>
                <Input
                  id="about-tagline"
                  value={content?.about?.tagline || ""}
                  onChange={(e) => updateContent("about.tagline", e.target.value)}
                  placeholder="Enter hero tagline"
                />
              </div>
            </CardContent>
          </Card>

          {/* Who We Are Section */}
          <Card>
            <CardHeader>
              <CardTitle>Who We Are Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="who-we-are-title">Title</Label>
                <Input
                  id="who-we-are-title"
                  value={content?.about?.whoWeAre?.title || ""}
                  onChange={(e) => updateContent("about.whoWeAre.title", e.target.value)}
                  placeholder="Enter who we are title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="who-we-are-desc1">Description 1</Label>
                <Textarea
                  id="who-we-are-desc1"
                  value={content?.about?.whoWeAre?.description1 || ""}
                  onChange={(e) => updateContent("about.whoWeAre.description1", e.target.value)}
                  placeholder="Enter first description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="who-we-are-desc2">Description 2 (Bold)</Label>
                <Input
                  id="who-we-are-desc2"
                  value={content?.about?.whoWeAre?.description2 || ""}
                  onChange={(e) => updateContent("about.whoWeAre.description2", e.target.value)}
                  placeholder="Enter bold description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="who-we-are-desc3">Description 3</Label>
                <Textarea
                  id="who-we-are-desc3"
                  value={content?.about?.whoWeAre?.description3 || ""}
                  onChange={(e) => updateContent("about.whoWeAre.description3", e.target.value)}
                  placeholder="Enter third description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <Card>
            <CardHeader>
              <CardTitle>Mission & Vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mission-title">Mission Title</Label>
                <Input
                  id="mission-title"
                  value={content?.about?.mission?.title || ""}
                  onChange={(e) => updateContent("about.mission.title", e.target.value)}
                  placeholder="Enter mission title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission-description">Mission Description</Label>
                <Textarea
                  id="mission-description"
                  value={content?.about?.mission?.description || ""}
                  onChange={(e) => updateContent("about.mission.description", e.target.value)}
                  placeholder="Enter mission description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision-title">Vision Title</Label>
                <Input
                  id="vision-title"
                  value={content?.about?.vision?.title || ""}
                  onChange={(e) => updateContent("about.vision.title", e.target.value)}
                  placeholder="Enter vision title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision-description">Vision Description</Label>
                <Textarea
                  id="vision-description"
                  value={content?.about?.vision?.description || ""}
                  onChange={(e) => updateContent("about.vision.description", e.target.value)}
                  placeholder="Enter vision description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* What We Do Section */}
          <Card>
            <CardHeader>
              <CardTitle>What We Do Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="what-we-do-title">Section Title</Label>
                <Input
                  id="what-we-do-title"
                  value={content?.about?.whatWeDo?.title || ""}
                  onChange={(e) => updateContent("about.whatWeDo.title", e.target.value)}
                  placeholder="Enter what we do title"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>What We Do Items</Label>
                  <Button
                    onClick={() => {
                      const currentItems = content?.about?.whatWeDo?.items || []
                      updateContent("about.whatWeDo.items", [...currentItems, ""])
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {(content?.about?.whatWeDo?.items || []).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Textarea
                      placeholder="Enter what we do item"
                      value={item}
                      onChange={(e) => {
                        const currentItems = content?.about?.whatWeDo?.items || []
                        const newItems = [...currentItems]
                        newItems[index] = e.target.value
                        updateContent("about.whatWeDo.items", newItems)
                      }}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={() => {
                        const currentItems = content?.about?.whatWeDo?.items || []
                        const newItems = currentItems.filter((_, i) => i !== index)
                        updateContent("about.whatWeDo.items", newItems)
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ecosystem Section */}
          <Card>
            <CardHeader>
              <CardTitle>Ecosystem Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ecosystem-title">Section Title</Label>
                <Input
                  id="ecosystem-title"
                  value={content?.about?.ecosystem?.title || ""}
                  onChange={(e) => updateContent("about.ecosystem.title", e.target.value)}
                  placeholder="Enter ecosystem title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ecosystem-subtitle">Section Subtitle</Label>
                <Textarea
                  id="ecosystem-subtitle"
                  value={content?.about?.ecosystem?.subtitle || ""}
                  onChange={(e) => updateContent("about.ecosystem.subtitle", e.target.value)}
                  placeholder="Enter ecosystem subtitle"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ecosystem-description">Bottom Description</Label>
                <Textarea
                  id="ecosystem-description"
                  value={content?.about?.ecosystem?.description || ""}
                  onChange={(e) => updateContent("about.ecosystem.description", e.target.value)}
                  placeholder="Enter ecosystem description"
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ecosystem Items</Label>
                  <Button
                    onClick={() => {
                      const currentItems = content?.about?.ecosystem?.items || []
                      updateContent("about.ecosystem.items", [...currentItems, { title: "", description: "" }])
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {(content?.about?.ecosystem?.items || []).map((item, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => {
                          const currentItems = content?.about?.ecosystem?.items || []
                          const newItems = [...currentItems]
                          newItems[index] = { ...newItems[index], title: e.target.value }
                          updateContent("about.ecosystem.items", newItems)
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          const currentItems = content?.about?.ecosystem?.items || []
                          const newItems = currentItems.filter((_, i) => i !== index)
                          updateContent("about.ecosystem.items", newItems)
                        }}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const currentItems = content?.about?.ecosystem?.items || []
                        const newItems = [...currentItems]
                        newItems[index] = { ...newItems[index], description: e.target.value }
                        updateContent("about.ecosystem.items", newItems)
                      }}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What Makes Us Different */}
          <Card>
            <CardHeader>
              <CardTitle>What Makes Us Different</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="different-title">Section Title</Label>
                <Input
                  id="different-title"
                  value={content?.about?.different?.title || ""}
                  onChange={(e) => updateContent("about.different.title", e.target.value)}
                  placeholder="Enter section title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="different-subtitle">Section Subtitle</Label>
                <Input
                  id="different-subtitle"
                  value={content?.about?.different?.subtitle || ""}
                  onChange={(e) => updateContent("about.different.subtitle", e.target.value)}
                  placeholder="Enter section subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="different-tagline">Bottom Tagline</Label>
                <Textarea
                  id="different-tagline"
                  value={content?.about?.different?.tagline || ""}
                  onChange={(e) => updateContent("about.different.tagline", e.target.value)}
                  placeholder="Enter bottom tagline"
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Different Items</Label>
                  <Button
                    onClick={() => {
                      const currentItems = content?.about?.different?.items || []
                      updateContent("about.different.items", [...currentItems, ""])
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {(content?.about?.different?.items || []).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Textarea
                      placeholder="Enter difference item"
                      value={item}
                      onChange={(e) => {
                        const currentItems = content?.about?.different?.items || []
                        const newItems = [...currentItems]
                        newItems[index] = e.target.value
                        updateContent("about.different.items", newItems)
                      }}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={() => {
                        const currentItems = content?.about?.different?.items || []
                        const newItems = currentItems.filter((_, i) => i !== index)
                        updateContent("about.different.items", newItems)
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle>Stats Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stats-title">Section Title</Label>
                <Input
                  id="stats-title"
                  value={content?.about?.stats?.title || ""}
                  onChange={(e) => updateContent("about.stats.title", e.target.value)}
                  placeholder="Enter stats title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stats-subtitle">Section Subtitle</Label>
                <Textarea
                  id="stats-subtitle"
                  value={content?.about?.stats?.subtitle || ""}
                  onChange={(e) => updateContent("about.stats.subtitle", e.target.value)}
                  placeholder="Enter stats subtitle"
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Stats Items</Label>
                  <Button
                    onClick={() => {
                      const currentItems = content?.about?.stats?.items || []
                      updateContent("about.stats.items", [...currentItems, { number: "", label: "", description: "" }])
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stat
                  </Button>
                </div>
                {(content?.about?.stats?.items || []).map((item, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Number (e.g., 16+)"
                        value={item.number}
                        onChange={(e) => {
                          const currentItems = content?.about?.stats?.items || []
                          const newItems = [...currentItems]
                          newItems[index] = { ...newItems[index], number: e.target.value }
                          updateContent("about.stats.items", newItems)
                        }}
                        className="w-24"
                      />
                      <Input
                        placeholder="Label"
                        value={item.label}
                        onChange={(e) => {
                          const currentItems = content?.about?.stats?.items || []
                          const newItems = [...currentItems]
                          newItems[index] = { ...newItems[index], label: e.target.value }
                          updateContent("about.stats.items", newItems)
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          const currentItems = content?.about?.stats?.items || []
                          const newItems = currentItems.filter((_, i) => i !== index)
                          updateContent("about.stats.items", newItems)
                        }}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const currentItems = content?.about?.stats?.items || []
                        const newItems = [...currentItems]
                        newItems[index] = { ...newItems[index], description: e.target.value }
                        updateContent("about.stats.items", newItems)
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Culture Section */}
          <Card>
            <CardHeader>
              <CardTitle>Culture Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="culture-title">Section Title</Label>
                <Input
                  id="culture-title"
                  value={content?.about?.culture?.title || ""}
                  onChange={(e) => updateContent("about.culture.title", e.target.value)}
                  placeholder="Enter culture title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="culture-subtitle">Section Subtitle</Label>
                <Input
                  id="culture-subtitle"
                  value={content?.about?.culture?.subtitle || ""}
                  onChange={(e) => updateContent("about.culture.subtitle", e.target.value)}
                  placeholder="Enter culture subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="culture-description">Description</Label>
                <Textarea
                  id="culture-description"
                  value={content?.about?.culture?.description || ""}
                  onChange={(e) => updateContent("about.culture.description", e.target.value)}
                  placeholder="Enter culture description"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="culture-tagline">Tagline</Label>
                <Input
                  id="culture-tagline"
                  value={content?.about?.culture?.tagline || ""}
                  onChange={(e) => updateContent("about.culture.tagline", e.target.value)}
                  placeholder="Enter culture tagline"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Culture Items</Label>
                  <Button
                    onClick={() => {
                      const currentItems = content?.about?.culture?.items || []
                      updateContent("about.culture.items", [...currentItems, ""])
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {(content?.about?.culture?.items || []).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Input
                      placeholder="Enter culture item"
                      value={item}
                      onChange={(e) => {
                        const currentItems = content?.about?.culture?.items || []
                        const newItems = [...currentItems]
                        newItems[index] = e.target.value
                        updateContent("about.culture.items", newItems)
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const currentItems = content?.about?.culture?.items || []
                        const newItems = currentItems.filter((_, i) => i !== index)
                        updateContent("about.culture.items", newItems)
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardHeader>
              <CardTitle>CTA Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta-title">CTA Title</Label>
                <Input
                  id="cta-title"
                  value={content?.about?.cta?.title || ""}
                  onChange={(e) => updateContent("about.cta.title", e.target.value)}
                  placeholder="Enter CTA title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-description">CTA Description</Label>
                <Textarea
                  id="cta-description"
                  value={content?.about?.cta?.description || ""}
                  onChange={(e) => updateContent("about.cta.description", e.target.value)}
                  placeholder="Enter CTA description"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-tagline">CTA Tagline</Label>
                <Input
                  id="cta-tagline"
                  value={content?.about?.cta?.tagline || ""}
                  onChange={(e) => updateContent("about.cta.tagline", e.target.value)}
                  placeholder="Enter CTA tagline"
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Section Settings - Update existing */}
          <Card>
            <CardHeader>
              <CardTitle>Team Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-title">Team Title</Label>
                <Input
                  id="team-title"
                  value={content?.about?.team?.title || ""}
                  onChange={(e) => updateContent("about.team.title", e.target.value)}
                  placeholder="Enter team section title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-subtitle">Team Subtitle</Label>
                <Input
                  id="team-subtitle"
                  value={content?.about?.team?.subtitle || ""}
                  onChange={(e) => updateContent("about.team.subtitle", e.target.value)}
                  placeholder="Enter team section subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-tagline">Team Tagline</Label>
                <Input
                  id="team-tagline"
                  value={content?.about?.team?.tagline || ""}
                  onChange={(e) => updateContent("about.team.tagline", e.target.value)}
                  placeholder="Enter team section tagline"
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Team members are managed separately in the Team Management section. This
                  section only controls the team section titles and tagline.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offices Content */}
        <TabsContent value="offices" className="space-y-6">
          {/* Offices Section */}
          <Card>
            <CardHeader>
              <CardTitle>Offices Gallery Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="offices-title">Section Title</Label>
                <Input
                  id="offices-title"
                  value={content?.offices?.title || ""}
                  onChange={(e) => updateContent("offices.title", e.target.value)}
                  placeholder="Enter offices section title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offices-subtitle">Section Subtitle</Label>
                <Textarea
                  id="offices-subtitle"
                  value={content?.offices?.subtitle || ""}
                  onChange={(e) => updateContent("offices.subtitle", e.target.value)}
                  placeholder="Enter offices section subtitle"
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-category-filter"
                  checked={content?.offices?.showCategoryFilter !== false}
                  onChange={(e) => updateContent("offices.showCategoryFilter", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="show-category-filter" className="text-sm font-medium">
                  Show Category Filter Buttons
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Toggle to show/hide the category filter buttons (All, Headquarters, Regional Office, etc.)
              </p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Individual office locations and galleries are managed in the Offices Management
                  section. This section only controls the main title and subtitle for the offices gallery section.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Page Content */}
        <TabsContent value="contact" className="space-y-6">
          {/* Contact Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Page Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-hero-title">Title</Label>
                <Input
                  id="contact-hero-title"
                  value={content?.contact?.hero?.title || ""}
                  onChange={(e) => updateContent("contact.hero.title", e.target.value)}
                  placeholder="Enter contact page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-hero-subtitle">Subtitle</Label>
                <Textarea
                  id="contact-hero-subtitle"
                  value={content?.contact?.hero?.subtitle || ""}
                  onChange={(e) => updateContent("contact.hero.subtitle", e.target.value)}
                  placeholder="Enter contact page subtitle"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Main Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Main Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-main-title">Main Title</Label>
                <Input
                  id="contact-main-title"
                  value={content?.contact?.title || ""}
                  onChange={(e) => updateContent("contact.title", e.target.value)}
                  placeholder="Enter contact main title (e.g., Get in Touch)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-main-description">Main Description</Label>
                <Textarea
                  id="contact-main-description"
                  value={content?.contact?.description || ""}
                  onChange={(e) => updateContent("contact.description", e.target.value)}
                  placeholder="Enter contact main description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Office Information */}
              <div className="space-y-4">
                <h4 className="font-semibold">Office Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-office-address">Office Address</Label>
                    <Input
                      id="contact-office-address"
                      value={content?.contact?.office?.address || ""}
                      onChange={(e) => updateContent("contact.office.address", e.target.value)}
                      placeholder="Enter office address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-office-city">City</Label>
                    <Input
                      id="contact-office-city"
                      value={content?.contact?.office?.city || ""}
                      onChange={(e) => updateContent("contact.office.city", e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-office-country">Country</Label>
                    <Input
                      id="contact-office-country"
                      value={content?.contact?.office?.country || ""}
                      onChange={(e) => updateContent("contact.office.country", e.target.value)}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>

              {/* Email Addresses */}
              <div className="space-y-4">
                <h4 className="font-semibold">Email Addresses</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email-general">General Email</Label>
                    <Input
                      id="contact-email-general"
                      value={content?.contact?.emails?.general || ""}
                      onChange={(e) => updateContent("contact.emails.general", e.target.value)}
                      placeholder="Enter general email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email-business">Business Email</Label>
                    <Input
                      id="contact-email-business"
                      value={content?.contact?.emails?.business || ""}
                      onChange={(e) => updateContent("contact.emails.business", e.target.value)}
                      placeholder="Enter business email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email-careers">Careers Email</Label>
                    <Input
                      id="contact-email-careers"
                      value={content?.contact?.emails?.careers || ""}
                      onChange={(e) => updateContent("contact.emails.careers", e.target.value)}
                      placeholder="Enter careers email"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Hours */}
              <div className="space-y-4">
                <h4 className="font-semibold">Phone & Hours</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone-number">Phone Number</Label>
                    <Input
                      id="contact-phone-number"
                      value={content?.contact?.phone || ""}
                      onChange={(e) => updateContent("contact.phone", e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-business-hours">Business Hours</Label>
                    <Input
                      id="contact-business-hours"
                      value={content?.contact?.hours || ""}
                      onChange={(e) => updateContent("contact.hours", e.target.value)}
                      placeholder="Enter business hours"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
