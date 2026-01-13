"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, Plus, Search, ChevronRight, Info, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DesignSystemPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-minimal-background text-minimal-text-primary">
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-minimal-background p-6"
        >
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="text-minimal-text-primary"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8 pt-20">
            <Link href="/" className="text-xl uppercase tracking-widest hover:text-minimal-accent">
              HOME
            </Link>
            <Link href="/design-system" className="text-xl uppercase tracking-widest text-minimal-accent">
              DESIGN SYSTEM
            </Link>
            <Link href="/search" className="text-xl uppercase tracking-widest hover:text-minimal-accent">
              SEARCH
            </Link>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between border-b border-minimal-border p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-minimal-accent"></div>
          <span className="font-medium tracking-widest uppercase">OPENHAUS.AI</span>
        </Link>
        <div className="hidden items-center space-x-8 md:flex">
          <Link href="/" className="text-sm uppercase tracking-wider hover:text-minimal-accent">
            HOME
          </Link>
          <Link href="/design-system" className="text-sm uppercase tracking-wider text-minimal-accent">
            DESIGN SYSTEM
          </Link>
          <Link href="/search" className="text-sm uppercase tracking-wider hover:text-minimal-accent">
            SEARCH
          </Link>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-16 text-center">
          <h1 className="mb-4">DESIGN SYSTEM</h1>
          <p className="mx-auto max-w-2xl text-minimal-text-secondary">
            A comprehensive guide to the OpenHaus.ai design system, showcasing typography, colors, and UI components
            with the minimal, ultra-sharp aesthetic.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-16 rounded-none border border-minimal-border bg-minimal-card p-6">
          <h2 className="mb-6">CONTENTS</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="#typography"
              className="group flex items-center space-x-2 text-minimal-text-secondary transition-colors hover:text-minimal-accent"
            >
              <span className="text-minimal-accent">01</span>
              <span className="uppercase tracking-wider">Typography</span>
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="#colors"
              className="group flex items-center space-x-2 text-minimal-text-secondary transition-colors hover:text-minimal-accent"
            >
              <span className="text-minimal-accent">02</span>
              <span className="uppercase tracking-wider">Colors</span>
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="#buttons"
              className="group flex items-center space-x-2 text-minimal-text-secondary transition-colors hover:text-minimal-accent"
            >
              <span className="text-minimal-accent">03</span>
              <span className="uppercase tracking-wider">Buttons</span>
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="#forms"
              className="group flex items-center space-x-2 text-minimal-text-secondary transition-colors hover:text-minimal-accent"
            >
              <span className="text-minimal-accent">04</span>
              <span className="uppercase tracking-wider">Form Elements</span>
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="#cards"
              className="group flex items-center space-x-2 text-minimal-text-secondary transition-colors hover:text-minimal-accent"
            >
              <span className="text-minimal-accent">05</span>
              <span className="uppercase tracking-wider">Cards</span>
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="#components"
              className="group flex items-center space-x-2 text-minimal-text-secondary transition-colors hover:text-minimal-accent"
            >
              <span className="text-minimal-accent">06</span>
              <span className="uppercase tracking-wider">Components</span>
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>
        </div>

        {/* Typography Section */}
        <section id="typography" className="mb-24 scroll-mt-24">
          <div className="mb-8 flex items-center">
            <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
            <h2 className="text-3xl">TYPOGRAPHY</h2>
          </div>

          <div className="space-y-12">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">HEADINGS</h3>
              <div className="space-y-8">
                <div className="flex flex-col space-y-2 border-b border-minimal-border pb-6">
                  <h1>HEADING 1</h1>
                  <p className="text-minimal-text-secondary">Font: Geist Sans, 600 weight, tracking-ultra</p>
                </div>
                <div className="flex flex-col space-y-2 border-b border-minimal-border pb-6">
                  <h2>HEADING 2</h2>
                  <p className="text-minimal-text-secondary">Font: Geist Sans, 500 weight, tracking-wider</p>
                </div>
                <div className="flex flex-col space-y-2 border-b border-minimal-border pb-6">
                  <h3>HEADING 3</h3>
                  <p className="text-minimal-text-secondary">Font: Geist Sans, 500 weight, tracking-wide</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <h4>HEADING 4</h4>
                  <p className="text-minimal-text-secondary">Font: Geist Sans, 500 weight, tracking-wide</p>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">BODY TEXT</h3>
              <div className="space-y-8">
                <div className="flex flex-col space-y-2 border-b border-minimal-border pb-6">
                  <p className="text-lg">Large Text - The quick brown fox jumps over the lazy dog.</p>
                  <p className="text-minimal-text-secondary">Font: Geist Sans, Regular, text-lg</p>
                </div>
                <div className="flex flex-col space-y-2 border-b border-minimal-border pb-6">
                  <p>Body Text - The quick brown fox jumps over the lazy dog.</p>
                  <p className="text-minimal-text-secondary">Font: Geist Sans, Regular, text-base</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm">Small Text - The quick brown fox jumps over the lazy dog.</p>
                  <p className="text-minimal-text-secondary">Font: Geist Sans, Regular, text-sm</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section id="colors" className="mb-24 scroll-mt-24">
          <div className="mb-8 flex items-center">
            <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
            <h2 className="text-3xl">COLORS</h2>
          </div>

          <div className="space-y-12">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">PRIMARY PALETTE</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="h-24 rounded-none bg-minimal-background"></div>
                  <p className="font-medium uppercase tracking-wider">Background</p>
                  <p className="font-mono text-sm text-minimal-text-secondary">#0A0A0A</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-none bg-minimal-surface"></div>
                  <p className="font-medium uppercase tracking-wider">Surface</p>
                  <p className="font-mono text-sm text-minimal-text-secondary">#141414</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-none bg-minimal-card"></div>
                  <p className="font-medium uppercase tracking-wider">Card</p>
                  <p className="font-mono text-sm text-minimal-text-secondary">#1A1A1A</p>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">ACCENT & TEXT</h3>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="h-24 rounded-none bg-minimal-accent"></div>
                  <p className="font-medium uppercase tracking-wider">Accent</p>
                  <p className="font-mono text-sm text-minimal-text-secondary">#FFD166</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-none bg-minimal-text-primary"></div>
                  <p className="font-medium uppercase tracking-wider">Text Primary</p>
                  <p className="font-mono text-sm text-minimal-text-secondary">#FFFFFF</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-none bg-minimal-text-secondary"></div>
                  <p className="font-medium uppercase tracking-wider">Text Secondary</p>
                  <p className="font-mono text-sm text-minimal-text-secondary">#AAAAAA</p>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-none bg-minimal-text-muted"></div>
                  <p className="font-medium uppercase tracking-wider">Text Muted</p>
                  <p className="font-mono text-sm text-minimal-text-secondary">#777777</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section id="buttons" className="mb-24 scroll-mt-24">
          <div className="mb-8 flex items-center">
            <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
            <h2 className="text-3xl">BUTTONS</h2>
          </div>

          <div className="space-y-12">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">BUTTON VARIANTS</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Button className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider">
                    Primary
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Primary</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button variant="outline" className="rounded-none border-minimal-border uppercase tracking-wider">
                    Outline
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Outline</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button variant="ghost" className="rounded-none uppercase tracking-wider">
                    Ghost
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Ghost</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button variant="link" className="uppercase tracking-wider">
                    Link
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Link</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant="outline"
                    className="rounded-none border-minimal-accent text-minimal-accent uppercase tracking-wider"
                  >
                    Accent
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Accent</p>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">BUTTON SIZES</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    size="sm"
                    className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider"
                  >
                    Small
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Small</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider">
                    Default
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Default</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    size="lg"
                    className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider"
                  >
                    Large
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Large</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button size="icon" className="rounded-none bg-minimal-accent text-minimal-background">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Icon</p>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">BUTTON STATES</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Button className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider">
                    Default
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Default</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider hover:bg-minimal-accent/90">
                    Hover
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Hover</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button className="rounded-none bg-minimal-accent/80 text-minimal-background uppercase tracking-wider">
                    Pressed
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Pressed</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    disabled
                    className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider"
                  >
                    Disabled
                  </Button>
                  <p className="text-sm text-minimal-text-secondary">Disabled</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements Section */}
        <section id="forms" className="mb-24 scroll-mt-24">
          <div className="mb-8 flex items-center">
            <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
            <h2 className="text-3xl">FORM ELEMENTS</h2>
          </div>

          <div className="space-y-12">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">TEXT INPUTS</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-wider">Default Input</label>
                  <Input
                    placeholder="Enter text here"
                    className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-wider">With Icon</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-minimal-text-secondary" />
                    <Input
                      placeholder="Search..."
                      className="rounded-none bg-minimal-surface border-minimal-border pl-10 focus:border-minimal-accent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-wider">Disabled</label>
                  <Input
                    placeholder="Disabled input"
                    disabled
                    className="rounded-none bg-minimal-surface border-minimal-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-wider">Textarea</label>
                  <Textarea
                    placeholder="Enter multiple lines of text"
                    className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">SELECTION CONTROLS</h3>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-lg uppercase tracking-wider">Checkboxes</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        className="rounded-none border-minimal-border data-[state=checked]:bg-minimal-accent data-[state=checked]:border-minimal-accent"
                      />
                      <label htmlFor="terms" className="text-sm">
                        Accept terms and conditions
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        defaultChecked
                        className="rounded-none border-minimal-border data-[state=checked]:bg-minimal-accent data-[state=checked]:border-minimal-accent"
                      />
                      <label htmlFor="newsletter" className="text-sm">
                        Subscribe to newsletter
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="disabled" disabled className="rounded-none border-minimal-border" />
                      <label htmlFor="disabled" className="text-sm text-minimal-text-muted">
                        Disabled option
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg uppercase tracking-wider">Radio Buttons</h4>
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="option-one"
                        id="option-one"
                        className="border-minimal-border text-minimal-accent"
                      />
                      <label htmlFor="option-one" className="text-sm">
                        Option One
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="option-two"
                        id="option-two"
                        className="border-minimal-border text-minimal-accent"
                      />
                      <label htmlFor="option-two" className="text-sm">
                        Option Two
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="option-three"
                        id="option-three"
                        disabled
                        className="border-minimal-border"
                      />
                      <label htmlFor="option-three" className="text-sm text-minimal-text-muted">
                        Disabled Option
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg uppercase tracking-wider">Switches</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="airplane-mode" className="text-sm">
                        Airplane Mode
                      </label>
                      <Switch id="airplane-mode" className="data-[state=checked]:bg-minimal-accent" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="wifi" className="text-sm">
                        Wi-Fi
                      </label>
                      <Switch id="wifi" defaultChecked className="data-[state=checked]:bg-minimal-accent" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="disabled-switch" className="text-sm text-minimal-text-muted">
                        Disabled
                      </label>
                      <Switch id="disabled-switch" disabled />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg uppercase tracking-wider">Select</h4>
                  <Select>
                    <SelectTrigger className="rounded-none bg-minimal-surface border-minimal-border focus:border-minimal-accent">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none bg-minimal-card border-minimal-border">
                      <SelectItem value="option1" className="focus:bg-minimal-surface focus:text-minimal-text-primary">
                        Option 1
                      </SelectItem>
                      <SelectItem value="option2" className="focus:bg-minimal-surface focus:text-minimal-text-primary">
                        Option 2
                      </SelectItem>
                      <SelectItem value="option3" className="focus:bg-minimal-surface focus:text-minimal-text-primary">
                        Option 3
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">SLIDERS</h3>
              <div className="space-y-8">
                <div>
                  <label className="mb-2 block text-sm uppercase tracking-wider">Default Slider</label>
                  <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
                </div>
                <div>
                  <label className="mb-2 block text-sm uppercase tracking-wider">Range Slider</label>
                  <Slider defaultValue={[25, 75]} max={100} step={1} className="py-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section id="cards" className="mb-24 scroll-mt-24">
          <div className="mb-8 flex items-center">
            <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
            <h2 className="text-3xl">CARDS</h2>
          </div>

          <div className="space-y-12">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">CARD VARIANTS</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-none border-minimal-border bg-minimal-card">
                  <CardHeader>
                    <CardTitle className="uppercase tracking-wider">Basic Card</CardTitle>
                    <CardDescription>A simple card with header and content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the main content area of the card. It can contain text, images, or other elements.</p>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-minimal-border bg-minimal-card">
                  <CardHeader>
                    <CardTitle className="uppercase tracking-wider">Card With Footer</CardTitle>
                    <CardDescription>Includes actions in the footer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This card includes a footer with action buttons.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="rounded-none border-minimal-border uppercase tracking-wider">
                      Cancel
                    </Button>
                    <Button className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider">
                      Submit
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="rounded-none border-minimal-accent bg-minimal-card">
                  <CardHeader>
                    <CardTitle className="uppercase tracking-wider text-minimal-accent">Accent Card</CardTitle>
                    <CardDescription>With accent border</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This card has an accent border to highlight important information.</p>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-minimal-border bg-minimal-surface">
                  <CardHeader>
                    <CardTitle className="uppercase tracking-wider">Alternative Card</CardTitle>
                    <CardDescription>With different background</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This card uses a different background color for visual distinction.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section id="components" className="mb-24 scroll-mt-24">
          <div className="mb-8 flex items-center">
            <div className="mr-4 h-px w-12 bg-minimal-accent"></div>
            <h2 className="text-3xl">COMPONENTS</h2>
          </div>

          <div className="space-y-12">
            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">TABS</h3>
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-none bg-minimal-surface">
                  <TabsTrigger
                    value="tab1"
                    className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                  >
                    Tab 1
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab2"
                    className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                  >
                    Tab 2
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab3"
                    className="rounded-none uppercase tracking-wider data-[state=active]:bg-minimal-card data-[state=active]:text-minimal-accent"
                  >
                    Tab 3
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="tab1"
                  className="mt-6 rounded-none border border-minimal-border bg-minimal-card p-4"
                >
                  <h4 className="mb-2 uppercase tracking-wider">Tab Content 1</h4>
                  <p className="text-minimal-text-secondary">This is the content for the first tab.</p>
                </TabsContent>
                <TabsContent
                  value="tab2"
                  className="mt-6 rounded-none border border-minimal-border bg-minimal-card p-4"
                >
                  <h4 className="mb-2 uppercase tracking-wider">Tab Content 2</h4>
                  <p className="text-minimal-text-secondary">This is the content for the second tab.</p>
                </TabsContent>
                <TabsContent
                  value="tab3"
                  className="mt-6 rounded-none border border-minimal-border bg-minimal-card p-4"
                >
                  <h4 className="mb-2 uppercase tracking-wider">Tab Content 3</h4>
                  <p className="text-minimal-text-secondary">This is the content for the third tab.</p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">ACCORDION</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-minimal-border">
                  <AccordionTrigger className="uppercase tracking-wider hover:text-minimal-accent">
                    Accordion Item 1
                  </AccordionTrigger>
                  <AccordionContent className="text-minimal-text-secondary">
                    This is the content for accordion item 1. It can contain text, images, or other elements.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-minimal-border">
                  <AccordionTrigger className="uppercase tracking-wider hover:text-minimal-accent">
                    Accordion Item 2
                  </AccordionTrigger>
                  <AccordionContent className="text-minimal-text-secondary">
                    This is the content for accordion item 2. Accordions are useful for organizing content in a
                    collapsible format.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-minimal-border">
                  <AccordionTrigger className="uppercase tracking-wider hover:text-minimal-accent">
                    Accordion Item 3
                  </AccordionTrigger>
                  <AccordionContent className="text-minimal-text-secondary">
                    This is the content for accordion item 3. Users can expand and collapse sections as needed.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">DROPDOWN MENU</h3>
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-none bg-minimal-accent text-minimal-background uppercase tracking-wider">
                      Open Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-none border-minimal-border bg-minimal-card">
                    <DropdownMenuLabel className="uppercase tracking-wider">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-minimal-border" />
                    <DropdownMenuItem className="focus:bg-minimal-surface focus:text-minimal-text-primary">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-minimal-surface focus:text-minimal-text-primary">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-minimal-surface focus:text-minimal-text-primary">
                      Help
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-minimal-border" />
                    <DropdownMenuItem className="focus:bg-minimal-surface focus:text-minimal-text-primary text-red-500">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-none border border-minimal-border bg-minimal-card p-6">
              <h3 className="mb-6 text-xl">ALERTS</h3>
              <div className="space-y-6">
                <Alert className="rounded-none border-minimal-accent bg-minimal-surface">
                  <Info className="h-4 w-4 text-minimal-accent" />
                  <AlertTitle className="uppercase tracking-wider">Information</AlertTitle>
                  <AlertDescription>This is an informational alert to provide context to the user.</AlertDescription>
                </Alert>

                <Alert className="rounded-none border-green-500 bg-minimal-surface">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle className="uppercase tracking-wider">Success</AlertTitle>
                  <AlertDescription>Your action was completed successfully.</AlertDescription>
                </Alert>

                <Alert className="rounded-none border-yellow-500 bg-minimal-surface">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertTitle className="uppercase tracking-wider">Warning</AlertTitle>
                  <AlertDescription>Please be aware of this important information.</AlertDescription>
                </Alert>

                <Alert className="rounded-none border-red-500 bg-minimal-surface">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <AlertTitle className="uppercase tracking-wider">Error</AlertTitle>
                  <AlertDescription>There was a problem with your request.</AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-minimal-border px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-minimal-text-secondary"></div>
              <span className="text-sm text-minimal-text-secondary tracking-widest uppercase">OPENHAUS.AI</span>
            </div>

            <div className="flex space-x-6 text-xs text-minimal-text-muted uppercase tracking-wider">
              <Link href="#" className="hover:text-minimal-accent">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-minimal-accent">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-minimal-accent">
                Contact Us
              </Link>
            </div>

            <div className="text-xs text-minimal-text-muted uppercase tracking-wider">
              © {new Date().getFullYear()} OPENHAUS.AI. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
