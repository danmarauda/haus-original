import { Skeleton } from "@/components/ui/skeleton"

export default function EarlyAccessLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-black py-24 md:py-32">
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-12 w-3/4 max-w-xl bg-white/10" />
            <Skeleton className="mt-6 h-20 w-full max-w-2xl bg-white/10" />
            <Skeleton className="mt-10 h-12 w-full max-w-md bg-white/10" />
          </div>
        </div>
      </section>

      {/* Benefits Section Skeleton */}
      <section className="bg-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="mx-auto h-10 w-64 bg-neutral-800" />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-32 w-full bg-neutral-800" />
              ))}
          </div>
        </div>
      </section>

      {/* Timeline Section Skeleton */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="mx-auto h-10 w-64 bg-neutral-800" />

          <div className="mx-auto mt-12 max-w-3xl space-y-12">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex gap-4">
                  <Skeleton className="h-6 w-6 rounded-full bg-neutral-800" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-48 bg-neutral-800" />
                    <Skeleton className="mt-2 h-4 w-full bg-neutral-800" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section Skeleton */}
      <section className="bg-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="mx-auto h-10 w-64 bg-neutral-800" />

          <div className="mx-auto mt-12 max-w-3xl space-y-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-32 w-full bg-neutral-800" />
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
