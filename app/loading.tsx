import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-48 bg-white/10" />
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
            </div>

            {/* Main Stats Card Skeleton */}
            <Skeleton className="w-full h-[400px] bg-white/5 rounded-3xl border border-white/5" />

            {/* Bottom Section Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-[300px] bg-white/5 rounded-3xl border border-white/5" />
                <Skeleton className="lg:col-span-1 h-[300px] bg-white/5 rounded-3xl border border-white/5" />
            </div>
        </div>
    )
}
