"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { Plus, Target, Trophy, Trash2, ArrowRight } from "lucide-react"
import { addGoal, contributeToGoal, deleteGoal } from "@/lib/actions"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Simple Progress Bar
function ProgressBar({ current, target }: { current: number, target: number }) {
    const percentage = Math.min(100, Math.max(0, (current / target) * 100))
    return (
        <div className="h-4 w-full bg-secondary/50 rounded-full overflow-hidden mt-2 border border-white/5">
            <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out relative"
                style={{ width: `${percentage}%` }}
            >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
        </div>
    )
}

function ContributeDialog({ goalId, goalName }: { goalId: string, goalName: string }) {
    const [amount, setAmount] = useState("")
    const [open, setOpen] = useState(false)
    const [pending, startTransition] = useTransition()


    function handleSubmit() {
        if (!amount) return
        startTransition(async () => {
            try {
                await contributeToGoal(goalId, parseFloat(amount))
                toast.success(`Contributed to ${goalName}!`)
                setOpen(false)
                setAmount("")
            } catch (e) {
                toast.error("Failed: " + e)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Add Funds
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 text-foreground">
                <DialogHeader>
                    <DialogTitle>Add funds to {goalName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <Input
                        type="number"
                        placeholder="Amount (LKR)"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="bg-black/20 border-white/10"
                    />
                    <Button onClick={handleSubmit} disabled={pending} className="w-full bg-primary hover:bg-primary/80">
                        {pending ? "Transferring..." : "Confirm Transfer"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        This involves adding an Expense record to simulate money leaving your wallet.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function GoalsDashboard({ initialGoals }: { initialGoals: any[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setIsAddOpen(false)

        startTransition(async () => {
            try {
                await addGoal(formData)
                toast.success("Goal created successfully!")
            } catch (e) {
                toast.error("Failed to create goal: " + e)
            }
        })
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this goal?")) return;
        startTransition(async () => {
            await deleteGoal(id)
            toast.success("Goal deleted")
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-glow">Financial Goals</h1>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                            <Plus className="w-4 h-4 mr-2" /> New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/10 text-foreground">
                        <DialogHeader>
                            <DialogTitle>Set a New Goal</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Goal Name</label>
                                <Input name="name" placeholder="e.g. New Car, Europe Trip" required className="bg-black/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Amount (LKR)</label>
                                <Input name="targetAmount" type="number" placeholder="500000" required className="bg-black/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Starting Balance (Optional)</label>
                                <Input name="initialAmount" type="number" placeholder="0" className="bg-black/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Date (Optional)</label>
                                <Input name="deadline" type="date" className="bg-black/20" />
                            </div>
                            <Button type="submit" disabled={pending} className="w-full">Create Goal</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {initialGoals.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center opacity-70">
                    <Trophy className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold">No Goals Set Yet</h3>
                    <p className="text-muted-foreground">Start saving for your dreams today.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {initialGoals.map((goal) => {
                        const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100)
                        return (
                            <Card key={goal.id} className="glass-card border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 bg-primary/30 blur-3xl rounded-full -mr-10 -mt-10 transition-opactiy group-hover:opacity-20" />

                                <CardHeader className="pb-2 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                <Target className="w-4 h-4 text-primary" />
                                                {goal.name}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {goal.deadline ? `Target: ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline'}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(goal.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-2xl font-bold text-glow">{formatCurrency(goal.currentAmount)}</span>
                                        <span className="text-xs font-medium text-muted-foreground">of {formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                    <ProgressBar current={goal.currentAmount} target={goal.targetAmount} />
                                    <div className="mt-2 text-right">
                                        <span className="text-xs font-bold text-primary">{percent}% Achieved</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="relative z-10 pt-0">
                                    <div className="w-full flex gap-2">
                                        <ContributeDialog goalId={goal.id} goalName={goal.name} />
                                    </div>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
