"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { Calendar, Plus, Sparkles, Loader2, Check, X, AlertTriangle } from "lucide-react"
import { detectRecurringExpenses, addSubscription } from "@/lib/actions"
import { toast } from "sonner"

interface Subscription {
    id?: string
    name: string
    amount: number
    category: string
    frequency: string
    nextDueDate: string | Date // Allow string from JSON
    provider?: string | null
    status?: string // ACTIVE, CANCELLED
}

export function SubscriptionDashboard({ initialSubscriptions }: { initialSubscriptions: any[] }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions)
    const [isScanning, setIsScanning] = useState(false)
    const [candidates, setCandidates] = useState<any[]>([])
    const [isManualAddOpen, setIsManualAddOpen] = useState(false)

    // Manual Add State
    const [newSub, setNewSub] = useState({ name: "", amount: "", date: "" })

    const totalMonthly = subscriptions.reduce((acc, sub) => {
        if (sub.status === 'CANCELLED') return acc;
        return acc + (sub.frequency === 'YEARLY' ? sub.amount / 12 : sub.amount)
    }, 0)

    async function handleScan() {
        setIsScanning(true)
        setCandidates([])
        try {
            const results = await detectRecurringExpenses()
            if (results && results.length > 0) {
                setCandidates(results)
                toast.success(`Found ${results.length} potential subscriptions!`)
            } else {
                toast.info("No obvious recurring subscriptions found.")
            }
        } catch (e) {
            toast.error("Failed to scan: " + e)
        } finally {
            setIsScanning(false)
        }
    }

    async function handleApproveCandidate(candidate: any) {
        try {
            const formData = new FormData()
            formData.append("name", candidate.name)
            formData.append("amount", candidate.amount.toString())
            formData.append("category", candidate.category || "Subscription")
            formData.append("frequency", candidate.frequency || "MONTHLY")
            // Default to 1st of next month if logic is complex
            const nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + 1);
            nextDate.setDate(1);
            formData.append("nextDueDate", nextDate.toISOString())
            formData.append("provider", candidate.name)

            await addSubscription(formData)

            // Optimistic update
            setSubscriptions(prev => [...prev, {
                ...candidate,
                nextDueDate: nextDate,
                status: "ACTIVE"
            }])
            setCandidates(prev => prev.filter(c => c !== candidate))
            toast.success(`Added ${candidate.name}`)
        } catch (e) {
            toast.error("Error adding: " + e)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-glow">Subscriptions</h1>
                <Button onClick={handleScan} disabled={isScanning} className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {isScanning ? "Scanning..." : "AI Scan"}
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="glass-card ring-1 ring-white/10 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/20 blur-2xl" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-glow">{formatCurrency(totalMonthly)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Estimated recurring spend</p>
                    </CardContent>
                </Card>

                <Card className="glass-card ring-1 ring-white/10 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-purple-500/20 blur-2xl" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-glow text-purple-400">{subscriptions.filter(s => s.status !== 'CANCELLED').length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Service providers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Candidates Section (AI Results) */}
            {candidates.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" /> Failed to find? Review suggestions:
                    </h3>
                    <div className="grid gap-3">
                        {candidates.map((cand, idx) => (
                            <Card key={idx} className="glass-card border-l-4 border-l-primary/50">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-bold flex items-center gap-2">
                                            {cand.name}
                                            <span className="text-[10px] uppercase bg-primary/20 px-2 py-0.5 rounded-full text-primary">{cand.confidence} Confidence</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(cand.amount)} / {cand.frequency}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => setCandidates(prev => prev.filter(c => c !== cand))}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" onClick={() => handleApproveCandidate(cand)}>
                                            <Check className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Subscription List */}
            <Card className="glass-card border-none ring-1 ring-white/5">
                <CardHeader>
                    <CardTitle>Your Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                    {subscriptions.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>No subscriptions tracked yet.</p>
                            <p className="text-sm">Use "AI Scan" to detect them from your expenses.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {subscriptions.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                            {sub.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold group-hover:text-primary transition-colors">{sub.name}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                {sub.frequency} &bull; Next Bill: {new Date(sub.nextDueDate).toLocaleDateString()}
                                                {/* Logic for "Due Soon" could go here */}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{formatCurrency(sub.amount)}</p>
                                        {/* <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">Edit</Button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
