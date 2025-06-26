"use client"

import Footer from "@/app/components/footer"
import Header from "@/app/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Calendar, Clock, Search, User } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

export default function BlogClientPage({ posts }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Get unique categories
  const categories = useMemo(() => {
    const cats = posts.map((post) => post.category).filter(Boolean)
    return ["all", ...new Set(cats)]
  }, [posts])

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [posts, searchTerm, selectedCategory])

  // Get featured post (first post)
  const featuredPost = filteredPosts[0]
  const regularPosts = filteredPosts.slice(1)

  return (
    <>
      <Header />
      <div className="relative min-h-[100vh] sm:min-h-[100vh] md:min-h-[100vh] flex items-center justify-center overflow-hidden -mt-[100px] sm:-mt-[120px] md:-mt-[140px] pt-[120px] sm:pt-[160px] md:pt-[200px]">
        {/* Hero section background that extends behind header */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-[#E9E6FF]/40 to-[#AA99FF]/30 -top-[120px] -mt-[120px] pt-[120px]">
          {/* Static decorative elements instead of animated particles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/30 rounded-full"></div>
            <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-primary/25 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary/20 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary/15 rounded-full"></div>
          </div>
          <div className="absolute inset-0 bg-primary/8" />

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(101,41,178,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(101,41,178,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="pt-2 pb-8 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 max-w-7xl">
            <div className="text-center mb-12 mx-auto max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pot-black mb-4 font-syne">Our Blog</h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Insights, stories, and updates from the Connected team. Discover the latest trends in technology,
                entrepreneurship, and innovation.
              </p>
            </div>
            <div className="py-2">
              <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-8xl">
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 bg-[#f0eeff] rounded-xl">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>

                    <div className="flex gap-2">
                      {categories.map((category) => {
                        const isSelected = selectedCategory === category

                        return (
                          <Button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`capitalize py-[23px] border transition-colors duration-200 ${isSelected
                              ? "bg-[#6529b2] text-white hover:bg-purple-700"
                              : "bg-[#f0eeff] text-black hover:bg-[#d9d7eb] "
                              }`}
                          >
                            {category}
                          </Button>
                        )
                      })}

                    </div>



                  </div>


                  {/* Results count */}
                  <p className="text-gray-600 mb-6">
                    {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
            </div>
            {/* Featured Post */}
            {featuredPost && (
              <section className="py-12 ">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Article</h2>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="md:flex">
                        <div className="md:w-1/2">
                          {featuredPost.image ? (
                            <img
                              src={featuredPost.image || "/placeholder.svg"}
                              alt={featuredPost.title}
                              className="w-full h-64 md:h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextElementSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full h-64 md:h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center"
                            style={{ display: featuredPost.image ? "none" : "flex" }}
                          >
                            <div className="text-center text-[#6529b2]">
                              <div className="w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl font-bold">{featuredPost.title.charAt(0)}</span>
                              </div>
                              <p className="text-sm">Featured Article</p>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-1/2 p-8">
                          <div className="flex items-center gap-2 mb-4">
                            <Badge variant="secondary" className="bg-[#a9f] text-black">
                              {featuredPost.category}
                            </Badge>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{featuredPost.readTime}</span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            {featuredPost.title}
                          </h3>
                          <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3 break-words">
                            {featuredPost.excerpt && featuredPost.excerpt.length > 150
                              ? featuredPost.excerpt.substring(0, 150) + "..."
                              : featuredPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {featuredPost.author?.image ? (
                                <img
                                  src={featuredPost.author.image || "/placeholder.svg"}
                                  alt={featuredPost.author?.name || "Author"}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none"
                                    e.target.nextElementSibling.style.display = "flex"
                                  }}
                                />
                              ) : null}
                              <div
                                className="w-10 h-10 bg-[#6529b2] text-white rounded-full flex items-center justify-center"
                                style={{ display: featuredPost.author?.image ? "none" : "flex" }}
                              >
                                <User className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 truncate">
                                  {featuredPost.author?.name || "Author"}
                                </p>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <Button asChild className="bg-[#6529b2] hover:bg-purple-700 flex-shrink-0">
                              <Link href={`/blog/${featuredPost.slug}`}>
                                Read More
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </section>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {regularPosts.map((post) => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                          {post.image && (
                            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt={post.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = "none"
                                }}
                              />
                            </div>
                          )}

                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="bg-[#a9f] text-black">
                                {post.category}
                              </Badge>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                {post.readTime}
                              </div>
                            </div>
                            <CardTitle className="text-xl hover:text-primary transition-colors">
                              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </CardTitle>
                            <CardDescription>{post.excerpt}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  {post.author?.image ? (
                                    <img
                                      src={post.author.image || "/placeholder.svg"}
                                      alt={post.author?.name || "Author"}
                                      className="h-4 w-4 mr-1 rounded-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none"
                                        e.target.nextSibling.style.display = "inline"
                                      }}
                                    />
                                  ) : null}
                                  <User
                                    className="h-4 w-4 mr-1"
                                    style={{ display: post.author?.image ? "none" : "inline" }}
                                  />
                                  {post.author?.name || "Author"}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(post.publishedAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center justify-center">
                                <Button asChild variant="outline" className="w-[60%]">
                                  <Link href={`/blog/${post.slug}`}>
                                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>
      </div>

      {/* Search and Filter Section */}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse all categories to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  )
}
