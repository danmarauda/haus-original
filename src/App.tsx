import { SignedIn, SignedOut } from "@clerk/clerk-react"
import Layout from "./components/Layout"
import Dashboard from "./components/Dashboard"
import LandingPage from "./components/LandingPage"

function App() {
  return (
    <Layout>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        {/* Render LandingPage first, then RedirectToSignIn if no interaction occurs */}
        <LandingPage />
        {/* <RedirectToSignIn /> */}
        {/* 
              Note: RedirectToSignIn immediately redirects. 
              If you want to show LandingPage content before redirect, 
              you might need a different strategy or rely on users clicking sign-in.
              For now, LandingPage will be shown, and users can click sign-in/sign-up.
              If you want an automatic redirect after a delay, or only if the path is protected,
              Clerk's routing components or custom logic would be needed.
              Keeping <RedirectToSignIn /> commented out to allow LandingPage to be visible.
              If you want an immediate redirect for any signed-out state, uncomment it.
              Alternatively, Clerk's <SignIn /> component can be used on a dedicated /sign-in route.
            */}
      </SignedOut>
    </Layout>
  )
}

export default App
