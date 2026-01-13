import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturesLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-black py-24 md:py-32">
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-12 w-3/4 max-w-xl bg-white/10" />
            <Skeleton className="mt-6 h-20 w-full max-w-2xl bg-white/10" />
            <div className="mt-10 flex gap-4">
              <Skeleton className="h-12 w-40 bg-white/10" />
              <Skeleton className="h-12 w-40 bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section Skeleton */}
      <section className="bg-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="mx-auto h-10 w-64 bg-neutral-800" />
          <Skeleton className="mx-auto mt-4 h-16 w-full max-w-2xl bg-neutral-800" />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-64 w-full bg-neutral-800" />
              ))}
          </div>
        </div>
      </section>

      {/* AI Showcase Section Skeleton */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Skeleton className="h-10 w-3/4 bg-neutral-800" />
              <Skeleton className="mt-6 h-32 w-full bg-neutral-800" />
              <div className="mt-6 space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Skeleton className="h-6 w-6 rounded-full bg-neutral-800" />
                      <Skeleton className="h-6 w-full bg-neutral-800" />
                    </div>
                  ))}
              </div>
            </div>
            <Skeleton className="aspect-video w-full bg-neutral-800" />
          </div>
        </div>
      </section>

      {/* Virtual Tours Section Skeleton */}
      <section className="bg-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <Skeleton className="aspect-video w-full bg-neutral-800" />
            <div>
              <Skeleton className="h-10 w-3/4 bg-neutral-800" />
              <Skeleton className="mt-6 h-32 w-full bg-neutral-800" />
              <div className="mt-6 space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Skeleton className="h-6 w-6 rounded-full bg-neutral-800" />
                      <Skeleton className="h-6 w-full bg-neutral-800" />
                    </div>
                  ))}
              </div>
              <Skeleton className="mt-8 h-10 w-40 bg-neutral-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Tools Section Skeleton */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Skeleton className="h-10 w-3/4 bg-neutral-800" />
              <Skeleton className="mt-6 h-32 w-full bg-neutral-800" />
              <div className="mt-6 space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Skeleton className="h-6 w-6 rounded-full bg-neutral-800" />
                      <Skeleton className="h-6 w-full bg-neutral-800" />
                    </div>
                  ))}
              </div>
              <Skeleton className="mt-8 h-10 w-40 bg-neutral-800" />
            </div>
            <Skeleton className="aspect-video w-full bg-neutral-800" />
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="mx-auto h-10 w-3/4 max-w-xl bg-white/10" />
          <Skeleton className="mx-auto mt-6 h-16 w-full max-w-2xl bg-white/10" />
          <Skeleton className="mx-auto mt-10 h-12 w-40 bg-white/10" />
        </div>
      </section>
    </div>
  )
}
