import { Skeleton } from "@/components/ui/skeleton"

export default function CompareLoading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-[600px] w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="h-[600px] w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
