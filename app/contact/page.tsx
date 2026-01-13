"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-minimal-background">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-b from-minimal-background via-minimal-background to-minimal-surface opacity-50"></div>
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">GET IN TOUCH</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-minimal-text-secondary">
            Have questions about OpenHaus.ai? We're here to help. Reach out to our team for support, feedback, or
            partnership inquiries.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-minimal-surface px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Contact Information */}
            <div>
              <div className="mb-8 flex items-center">
                <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
                <h2 className="text-3xl font-medium uppercase tracking-wider">CONTACT US</h2>
              </div>

              <p className="mb-8 text-minimal-text-secondary">
                Our team is available Monday through Friday, 9am to 6pm PST. We strive to respond to all inquiries
                within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 rounded-none bg-minimal-card p-3 text-minimal-accent">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium uppercase tracking-wider">Email</h3>
                    <p className="text-minimal-text-secondary">info@openhaus.ai</p>
                    <p className="text-minimal-text-secondary">support@openhaus.ai</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-none bg-minimal-card p-3 text-minimal-accent">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium uppercase tracking-wider">Phone</h3>
                    <p className="text-minimal-text-secondary">+1 (555) 123-4567</p>
                    <p className="text-minimal-text-secondary">Mon-Fri, 9am-6pm PST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-none bg-minimal-card p-3 text-minimal-accent">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium uppercase tracking-wider">Office</h3>
                    <p className="text-minimal-text-secondary">123 Tech Plaza</p>
                    <p className="text-minimal-text-secondary">Seattle, WA 98101</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="mb-4 text-lg font-medium uppercase tracking-wider">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="rounded-none border border-minimal-border bg-minimal-card p-3 text-minimal-text-secondary hover:border-minimal-accent hover:text-minimal-accent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="rounded-none border border-minimal-border bg-minimal-card p-3 text-minimal-text-secondary hover:border-minimal-accent hover:text-minimal-accent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="rounded-none border border-minimal-border bg-minimal-card p-3 text-minimal-text-secondary hover:border-minimal-accent hover:text-minimal-accent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="rounded-none border border-minimal-border bg-minimal-card p-3 text-minimal-text-secondary hover:border-minimal-accent hover:text-minimal-accent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="rounded-none border border-minimal-border bg-minimal-card p-8">
                {!isSubmitted ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-medium uppercase tracking-wider">Send Us a Message</h3>

                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm uppercase tracking-wider">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm uppercase tracking-wider">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="mb-2 block text-sm uppercase tracking-wider">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm uppercase tracking-wider">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-minimal-background border-t-transparent"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="mb-6 rounded-full bg-minimal-accent/20 p-4">
                      <CheckCircle className="h-12 w-12 text-minimal-accent" />
                    </div>
                    <h3 className="mb-2 text-2xl font-medium uppercase tracking-wider">Message Sent!</h3>
                    <p className="mb-6 text-minimal-text-secondary">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false)
                        setFormData({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        })
                      }}
                      className="rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-6 flex items-center justify-center">
              <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
              <h2 className="text-3xl font-medium uppercase tracking-wider">FREQUENTLY ASKED QUESTIONS</h2>
              <div className="ml-4 h-px w-12 bg-minimal-accent"></div>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What makes OpenHaus.ai different from other real estate platforms?",
                answer:
                  "OpenHaus.ai leverages advanced AI to understand your unique preferences and needs, providing truly personalized property recommendations. We also offer access to exclusive off-market properties and immersive virtual tours that give you a realistic feel for each space.",
              },
              {
                question: "Is OpenHaus.ai available in my area?",
                answer:
                  "We're currently available in select major metropolitan areas across the United States, with plans to expand rapidly. Contact us to check availability in your specific location.",
              },
              {
                question: "How does the AI-powered search work?",
                answer:
                  "Our AI analyzes your natural language descriptions, past interactions, and implicit preferences to understand what you're truly looking for in a property. It goes beyond basic filters to match you with homes that align with your lifestyle and aesthetic preferences.",
              },
              {
                question: "Are there any fees to use OpenHaus.ai?",
                answer:
                  "Basic access to OpenHaus.ai is free. We offer premium subscription tiers for enhanced features like AI-powered recommendations, virtual tours, and access to exclusive listings.",
              },
              {
                question: "How can I list my property on OpenHaus.ai?",
                answer:
                  "If you're a property owner or agent interested in listing with us, please contact our partnerships team at partners@openhaus.ai for more information.",
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-none border border-minimal-border bg-minimal-card">
                <div className="border-b border-minimal-border p-6">
                  <h3 className="text-lg font-medium uppercase tracking-wider">{faq.question}</h3>
                </div>
                <div className="p-6">
                  <p className="text-minimal-text-secondary">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
