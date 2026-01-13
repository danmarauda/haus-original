import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-minimal-border px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-minimal-accent"></div>
              <span className="text-sm text-minimal-text-primary tracking-widest uppercase font-medium">
                HAUS.COM.AI
              </span>
            </div>
            <p className="mt-4 text-sm text-minimal-text-secondary">
              Reimagining real estate search with AI-powered insights and immersive virtual experiences.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-widest mb-4">NAVIGATION</h4>
            <ul className="space-y-2 text-sm text-minimal-text-secondary">
              <li>
                <Link href="/" className="hover:text-minimal-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-minimal-accent">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-minimal-accent">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-minimal-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-widest mb-4">ACCOUNT</h4>
            <ul className="space-y-2 text-sm text-minimal-text-secondary">
              <li>
                <Link href="/login" className="hover:text-minimal-accent">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-minimal-accent">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-minimal-accent">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-minimal-accent">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-widest mb-4">LEGAL</h4>
            <ul className="space-y-2 text-sm text-minimal-text-secondary">
              <li>
                <Link href="/privacy" className="hover:text-minimal-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-minimal-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-minimal-accent">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between space-y-4 border-t border-minimal-border pt-8 md:flex-row md:space-y-0">
          <div className="text-xs text-minimal-text-muted uppercase tracking-wider">
            © {new Date().getFullYear()} HAUS.COM.AI. ALL RIGHTS RESERVED.
          </div>

          <div className="flex space-x-6 text-xs text-minimal-text-muted uppercase tracking-wider">
            <Link href="#" className="hover:text-minimal-accent">
              Instagram
            </Link>
            <Link href="#" className="hover:text-minimal-accent">
              Twitter
            </Link>
            <Link href="#" className="hover:text-minimal-accent">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
