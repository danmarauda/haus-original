"use client"

import type React from "react"
import { useUser } from "@clerk/clerk-react"

const Dashboard: React.FC = () => {
  const { user } = useUser()

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-4 text-vercel-text-primary">Dashboard</h1>
      <p className="text-xl mb-6 text-vercel-text-secondary">
        Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress || "User"}!
      </p>

      <div className="bg-vercel-card-bg p-6 shadow-md border border-vercel-border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-vercel-text-primary">Your Data Insights</h2>
        <p className="text-vercel-text-secondary mb-4">
          This is where your personalized data from Supabase will be displayed. Connect to your Supabase instance to see
          live data, charts, and more.
        </p>
        <div className="aspect-video bg-gray-800 border border-vercel-border rounded flex items-center justify-center">
          <p className="text-vercel-text-secondary">Supabase Data Visualization Placeholder</p>
        </div>
      </div>

      {/* Example of how you might display user profile information from Clerk */}
      {user && (
        <div className="mt-8 bg-vercel-card-bg p-6 shadow-md border border-vercel-border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-vercel-text-primary">User Profile (from Clerk)</h2>
          <div className="space-y-2">
            <p className="text-vercel-text-secondary">
              <strong>Full Name:</strong> {user.fullName || "N/A"}
            </p>
            <p className="text-vercel-text-secondary">
              <strong>Primary Email:</strong> {user.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-vercel-text-secondary">
              <strong>User ID:</strong> {user.id}
            </p>
            <p className="text-vercel-text-secondary">
              <strong>Last Sign In:</strong> {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
