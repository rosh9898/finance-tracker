
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { generateInsights } from "@/lib/actions"

export async function AiInsights() {
    // This component handles its own data fetching
    const insights = await generateInsights()

    return (
        <Card className="glass-card relative overflow-hidden border-l-4 border-l-primary/50">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
            <CardHeader className="pb-2 flex flex-row items-center gap-3 relative z-10">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary shadow-inner ring-1 ring-primary/20 backdrop-blur-md">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                    <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        AI Insights
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
                <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed font-medium">
                    {insights}
                </div>
            </CardContent>
        </Card>
    )
}

export function AiInsightsSkeleton() {
    return (
        <Card className="glass-card relative overflow-hidden border-l-4 border-l-primary/50">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-30" />
            <CardHeader className="pb-2 flex flex-row items-center gap-3 relative z-10">
                <div className="p-2.5 rounded-xl bg-muted text-muted-foreground">
                    <Sparkles className="w-5 h-5 opacity-50" />
                </div>
                <div className="h-6 w-32 bg-muted/50 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="relative z-10 pt-2 space-y-2">
                <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
            </CardContent>
        </Card>
    )
}
