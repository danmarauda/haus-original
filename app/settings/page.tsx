"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newListings: true,
    priceChanges: true,
    savedSearches: true,
    marketing: false,
  })

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/")
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
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl font-bold">SETTINGS</h1>
          <p className="mt-2 text-minimal-text-secondary">Manage your account settings and preferences.</p>
        </motion.div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none bg-minimal-surface">
            <TabsTrigger
              value="account"
              className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
            >
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-xl font-medium uppercase tracking-wider">Account Information</h2>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm uppercase tracking-wider">Full Name</label>
                    <Input
                      defaultValue={user?.name}
                      className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm uppercase tracking-wider">Email Address</label>
                    <Input
                      defaultValue={user?.email}
                      className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm uppercase tracking-wider">Phone Number</label>
                  <Input
                    defaultValue="(555) 123-4567"
                    className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm uppercase tracking-wider">Address</label>
                  <Input
                    defaultValue="123 Main St, Seattle, WA 98101"
                    className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                  />
                </div>

                <div className="pt-4">
                  <Button className="rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-xl font-medium uppercase tracking-wider">Delete Account</h2>
              </div>

              <p className="mb-6 text-minimal-text-secondary">
                Once you delete your account, there is no going back. Please be certain.
              </p>

              <Button
                variant="outline"
                className="rounded-none border-red-500 text-red-500 hover:bg-red-500/10 uppercase tracking-wider"
              >
                Delete Account
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-xl font-medium uppercase tracking-wider">Change Password</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm uppercase tracking-wider">Current Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm uppercase tracking-wider">New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm uppercase tracking-wider">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                  />
                </div>

                <div className="pt-4">
                  <Button className="rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider">
                    Update Password
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-xl font-medium uppercase tracking-wider">Two-Factor Authentication</h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable two-factor authentication</p>
                  <p className="text-sm text-minimal-text-secondary">Add an extra layer of security to your account</p>
                </div>
                <Switch className="data-[state=checked]:bg-minimal-accent" />
              </div>
            </div>

            <div className="mt-8 rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-xl font-medium uppercase tracking-wider">Sessions</h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-none border border-minimal-border bg-minimal-surface p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-minimal-text-secondary">
                        Chrome on Windows • Seattle, WA • Active now
                      </p>
                    </div>
                    <div className="rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">Current</div>
                  </div>
                </div>

                <div className="rounded-none border border-minimal-border bg-minimal-surface p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-minimal-text-secondary">
                        iPhone • Seattle, WA • Last active 2 hours ago
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none border-minimal-border text-minimal-text-secondary hover:border-red-500 hover:text-red-500"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-xl font-medium uppercase tracking-wider">Notification Preferences</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-minimal-border pb-4">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-minimal-text-secondary">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    className="data-[state=checked]:bg-minimal-accent"
                  />
                </div>

                <div className="flex items-center justify-between border-b border-minimal-border pb-4">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-minimal-text-secondary">Receive notifications on your device</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    className="data-[state=checked]:bg-minimal-accent"
                  />
                </div>

                <div className="mb-6 flex items-center">
                  <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                  <h3 className="text-lg font-medium uppercase tracking-wider">Notification Types</h3>
                </div>

                <div className="flex items-center justify-between border-b border-minimal-border pb-4">
                  <div>
                    <p className="font-medium">New Listings</p>
                    <p className="text-sm text-minimal-text-secondary">
                      Get notified when new properties match your criteria
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newListings}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newListings: checked })}
                    className="data-[state=checked]:bg-minimal-accent"
                  />
                </div>

                <div className="flex items-center justify-between border-b border-minimal-border pb-4">
                  <div>
                    <p className="font-medium">Price Changes</p>
                    <p className="text-sm text-minimal-text-secondary">
                      Get notified when prices change on saved properties
                    </p>
                  </div>
                  <Switch
                    checked={notifications.priceChanges}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, priceChanges: checked })}
                    className="data-[state=checked]:bg-minimal-accent"
                  />
                </div>

                <div className="flex items-center justify-between border-b border-minimal-border pb-4">
                  <div>
                    <p className="font-medium">Saved Searches</p>
                    <p className="text-sm text-minimal-text-secondary">Get updates on your saved searches</p>
                  </div>
                  <Switch
                    checked={notifications.savedSearches}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, savedSearches: checked })}
                    className="data-[state=checked]:bg-minimal-accent"
                  />
                </div>

                <div className="flex items-center justify-between pb-4">
                  <div>
                    <p className="font-medium">Marketing</p>
                    <p className="text-sm text-minimal-text-secondary">Receive marketing and promotional emails</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    className="data-[state=checked]:bg-minimal-accent"
                  />
                </div>

                <div className="pt-4">
                  <Button className="rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-xl font-medium uppercase tracking-wider">Subscription</h2>
              </div>

              <div className="mb-6 rounded-none border border-minimal-border bg-minimal-surface p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Free Plan</p>
                    <p className="text-sm text-minimal-text-secondary">Basic access to property listings and search</p>
                  </div>
                  <div className="rounded-full bg-minimal-accent px-3 py-1 text-xs font-medium text-minimal-background">
                    Current Plan
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-none border border-minimal-border bg-minimal-surface p-6">
                  <h3 className="mb-2 text-lg font-medium uppercase tracking-wider">Free</h3>
                  <p className="mb-4 text-2xl font-bold">
                    $0<span className="text-sm font-normal text-minimal-text-secondary">/month</span>
                  </p>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> Basic property search
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> Save up to 5 properties
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-red-500">✗</span> AI-powered recommendations
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-red-500">✗</span> Virtual tours
                    </li>
                  </ul>
                  <Button
                    disabled
                    className="w-full rounded-none bg-minimal-text-secondary text-minimal-background uppercase tracking-wider"
                  >
                    Current Plan
                  </Button>
                </div>

                <div className="rounded-none border border-minimal-accent bg-minimal-surface p-6">
                  <h3 className="mb-2 text-lg font-medium uppercase tracking-wider text-minimal-accent">Premium</h3>
                  <p className="mb-4 text-2xl font-bold">
                    $19<span className="text-sm font-normal text-minimal-text-secondary">/month</span>
                  </p>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> Advanced property search
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> Unlimited saved properties
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> AI-powered recommendations
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> Virtual tours
                    </li>
                  </ul>
                  <Button className="w-full rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider">
                    Upgrade
                  </Button>
                </div>

                <div className="rounded-none border border-minimal-border bg-minimal-surface p-6">
                  <h3 className="mb-2 text-lg font-medium uppercase tracking-wider">Pro</h3>
                  <p className="mb-4 text-2xl font-bold">
                    $49<span className="text-sm font-normal text-minimal-text-secondary">/month</span>
                  </p>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> All Premium features
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> Priority access to new listings
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> Exclusive off-market properties
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> Dedicated agent support
                    </li>
                  </ul>
                  <Button className="w-full rounded-none bg-minimal-text-primary text-minimal-background hover:bg-minimal-text-primary/90 uppercase tracking-wider">
                    Upgrade
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-none border border-minimal-border bg-minimal-card p-6">
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-xl font-medium uppercase tracking-wider">Payment Methods</h2>
              </div>

              <p className="mb-6 text-minimal-text-secondary">No payment methods added yet.</p>

              <Button className="rounded-none border-minimal-accent bg-transparent text-minimal-accent hover:bg-minimal-accent/10 uppercase tracking-wider">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Add Payment Method</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 flex justify-end">
          <Button
            variant="outline"
            className="rounded-none border-red-500 text-red-500 hover:bg-red-500/10 flex items-center space-x-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="uppercase tracking-wider">Log Out</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
