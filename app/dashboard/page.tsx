"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Heart, Clock, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyCard } from "@/components/property-card"
import { useAuth } from "@/hooks/use-auth"
import { mockProperties } from "@/lib/mock-data"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [savedProperties, setSavedProperties] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }

    // Mock data for dashboard
    setSavedProperties(mockProperties.slice(0, 3))
    setRecentlyViewed(mockProperties.slice(3, 6))
    setRecentSearches([
      { id: 1, query: "Modern 3-bedroom house with garden", date: "2 days ago" },
      { id: 2, query: "Apartment in downtown with parking", date: "1 week ago" },
      { id: 3, query: "Waterfront property with 4+ bedrooms", date: "2 weeks ago" },
    ])
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-minimal-border border-t-minimal-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-minimal-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl font-bold">DASHBOARD</h1>
          <p className="mt-2 text-minimal-text-secondary">
            Welcome back, {user?.name}. Manage your saved properties and searches.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="flex flex-col space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 rounded-none bg-minimal-surface p-3 text-minimal-accent"
                >
                  <Home className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-wider">Dashboard</span>
                </Link>
                <Link
                  href="/saved"
                  className="flex items-center space-x-2 rounded-none p-3 text-minimal-text-secondary hover:bg-minimal-surface hover:text-minimal-text-primary"
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-wider">Saved Properties</span>
                </Link>
                <Link
                  href="/history"
                  className="flex items-center space-x-2 rounded-none p-3 text-minimal-text-secondary hover:bg-minimal-surface hover:text-minimal-text-primary"
                >
                  <Clock className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-wider">History</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center space-x-2 rounded-none p-3 text-minimal-text-secondary hover:bg-minimal-surface hover:text-minimal-text-primary"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-wider">Settings</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-4 text-lg font-medium uppercase tracking-wider">Quick Search</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-minimal-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    className="w-full rounded-none border border-minimal-border bg-minimal-surface py-2 pl-10 pr-4 text-sm text-minimal-text-primary focus:border-minimal-accent focus:outline-none"
                  />
                </div>
                <Link href="/search">
                  <Button className="w-full rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider">
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-none bg-minimal-surface">
                <TabsTrigger
                  value="saved"
                  className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                >
                  Saved Properties
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                >
                  Recently Viewed
                </TabsTrigger>
                <TabsTrigger
                  value="searches"
                  className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                >
                  Recent Searches
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-medium uppercase tracking-wider">Saved Properties</h3>
                  <Link href="/saved">
                    <Button
                      variant="outline"
                      className="rounded-none border-minimal-border text-minimal-text-secondary hover:border-minimal-accent hover:text-minimal-accent"
                    >
                      View All
                    </Button>
                  </Link>
                </div>

                {savedProperties.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {savedProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-none border border-dashed border-minimal-border bg-minimal-surface p-6 text-center">
                    <Heart className="mb-4 h-12 w-12 text-minimal-text-secondary" />
                    <h4 className="mb-2 text-lg font-medium uppercase tracking-wider">No Saved Properties</h4>
                    <p className="mb-4 text-minimal-text-secondary">
                      You haven't saved any properties yet. Start exploring to find your dream home.
                    </p>
                    <Link href="/search">
                      <Button className="rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90">
                        Explore Properties
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-medium uppercase tracking-wider">Recently Viewed</h3>
                  <Link href="/history">
                    <Button
                      variant="outline"
                      className="rounded-none border-minimal-border text-minimal-text-secondary hover:border-minimal-accent hover:text-minimal-accent"
                    >
                      View All
                    </Button>
                  </Link>
                </div>

                {recentlyViewed.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentlyViewed.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-none border border-dashed border-minimal-border bg-minimal-surface p-6 text-center">
                    <Clock className="mb-4 h-12 w-12 text-minimal-text-secondary" />
                    <h4 className="mb-2 text-lg font-medium uppercase tracking-wider">No Recent Views</h4>
                    <p className="mb-4 text-minimal-text-secondary">
                      You haven't viewed any properties recently. Start exploring to find your dream home.
                    </p>
                    <Link href="/search">
                      <Button className="rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90">
                        Explore Properties
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="searches" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-medium uppercase tracking-wider">Recent Searches</h3>
                  <Link href="/history">
                    <Button
                      variant="outline"
                      className="rounded-none border-minimal-border text-minimal-text-secondary hover:border-minimal-accent hover:text-minimal-accent"
                    >
                      View All
                    </Button>
                  </Link>
                </div>

                {recentSearches.length > 0 ? (
                  <div className="space-y-4">
                    {recentSearches.map((search) => (
                      <div
                        key={search.id}
                        className="flex items-center justify-between rounded-none border border-minimal-border bg-minimal-surface p-4"
                      >
                        <div>
                          <p className="font-medium">{search.query}</p>
                          <p className="text-sm text-minimal-text-secondary">{search.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/search?q=${encodeURIComponent(search.query)}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-none border-minimal-border hover:border-minimal-accent hover:text-minimal-accent"
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-none border border-dashed border-minimal-border bg-minimal-surface p-6 text-center">
                    <Search className="mb-4 h-12 w-12 text-minimal-text-secondary" />
                    <h4 className="mb-2 text-lg font-medium uppercase tracking-wider">No Recent Searches</h4>
                    <p className="mb-4 text-minimal-text-secondary">
                      You haven't performed any searches yet. Start exploring to find your dream home.
                    </p>
                    <Link href="/search">
                      <Button className="rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90">
                        Start Searching
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
