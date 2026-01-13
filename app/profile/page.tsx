"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Edit, Mail, MapPin, Calendar, Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { PropertyCard } from "@/components/property-card"
import { mockProperties } from "@/lib/mock-data"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "Real estate enthusiast looking for the perfect property.",
    location: "Seattle, WA",
    phone: "(555) 123-4567",
    joinDate: "January 2023",
  })
  const [savedProperties, setSavedProperties] = useState<any[]>([])

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }))
    }

    // Mock saved properties
    setSavedProperties(mockProperties.slice(0, 4))
  }, [isAuthenticated, isLoading, router, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
  }

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
          <h1 className="text-3xl font-bold">MY PROFILE</h1>
          <p className="mt-2 text-minimal-text-secondary">Manage your personal information and preferences.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-minimal-accent">
                    <Image
                      src={
                        user?.avatar || "/placeholder.svg?height=200&width=200&query=australian+person+profile+picture"
                      }
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 rounded-full bg-minimal-accent p-2 text-minimal-background">
                      <Upload className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <>
                    <h2 className="text-xl font-bold">{profileData.name}</h2>
                    <p className="mt-1 text-minimal-text-secondary">{profileData.bio}</p>

                    <div className="mt-6 w-full space-y-4">
                      <div className="flex items-center">
                        <Mail className="mr-3 h-5 w-5 text-minimal-text-secondary" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-3 h-5 w-5 text-minimal-text-secondary" />
                        <span>{profileData.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-3 h-5 w-5 text-minimal-text-secondary" />
                        <span>Member since {profileData.joinDate}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsEditing(true)}
                      className="mt-6 w-full rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 flex items-center justify-center"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  </>
                ) : (
                  <div className="mt-4 w-full">
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm uppercase tracking-wider">Name</label>
                        <Input
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm uppercase tracking-wider">Email</label>
                        <Input
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm uppercase tracking-wider">Bio</label>
                        <Textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm uppercase tracking-wider">Location</label>
                        <Input
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm uppercase tracking-wider">Phone</label>
                        <Input
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        />
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 rounded-none border-minimal-border text-minimal-text-secondary hover:border-minimal-accent hover:text-minimal-accent"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          className="flex-1 rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 flex items-center justify-center"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          <span>Save</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-none bg-minimal-surface">
                <TabsTrigger
                  value="saved"
                  className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                >
                  Saved Properties
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                >
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-medium uppercase tracking-wider">Saved Properties</h3>
                </div>

                {savedProperties.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {savedProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-none border border-dashed border-minimal-border bg-minimal-surface p-6 text-center">
                    <h4 className="mb-2 text-lg font-medium uppercase tracking-wider">No Saved Properties</h4>
                    <p className="mb-4 text-minimal-text-secondary">You haven't saved any properties yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-medium uppercase tracking-wider">Recent Activity</h3>
                </div>

                <div className="space-y-4">
                  <div className="rounded-none border border-minimal-border bg-minimal-surface p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Viewed Modern Lakeside Villa</p>
                        <p className="text-sm text-minimal-text-secondary">2 days ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-none border border-minimal-border bg-minimal-surface p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Saved Downtown Luxury Apartment</p>
                        <p className="text-sm text-minimal-text-secondary">3 days ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-none border border-minimal-border bg-minimal-surface p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Searched for "Waterfront properties"</p>
                        <p className="text-sm text-minimal-text-secondary">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-medium uppercase tracking-wider">Search Preferences</h3>
                  <p className="mt-1 text-minimal-text-secondary">
                    Customize your search preferences to get more relevant results.
                  </p>
                </div>

                <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm uppercase tracking-wider">Preferred Locations</label>
                      <Input
                        placeholder="e.g., Seattle, Bellevue, Kirkland"
                        className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm uppercase tracking-wider">Property Types</label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div className="rounded-none border border-minimal-accent bg-minimal-surface p-3 text-center text-minimal-accent">
                          House
                        </div>
                        <div className="rounded-none border border-minimal-border bg-minimal-surface p-3 text-center">
                          Apartment
                        </div>
                        <div className="rounded-none border border-minimal-border bg-minimal-surface p-3 text-center">
                          Condo
                        </div>
                        <div className="rounded-none border border-minimal-border bg-minimal-surface p-3 text-center">
                          Townhouse
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm uppercase tracking-wider">Price Range</label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Min"
                          className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        />
                        <Input
                          placeholder="Max"
                          className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm uppercase tracking-wider">Bedrooms</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, "5+"].map((num) => (
                          <div
                            key={num}
                            className={`flex-1 rounded-none border p-2 text-center ${
                              num === 3
                                ? "border-minimal-accent bg-minimal-accent/10 text-minimal-accent"
                                : "border-minimal-border bg-minimal-surface"
                            }`}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm uppercase tracking-wider">Bathrooms</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, "4+"].map((num) => (
                          <div
                            key={num}
                            className={`flex-1 rounded-none border p-2 text-center ${
                              num === 2
                                ? "border-minimal-accent bg-minimal-accent/10 text-minimal-accent"
                                : "border-minimal-border bg-minimal-surface"
                            }`}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider">
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
