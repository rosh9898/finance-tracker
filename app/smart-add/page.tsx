"use client"

import { useState, useEffect, useRef } from "react"
import { processSmartAdd, addIncome, addExpense, addDebt, addRepayment } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"

export default function SmartAddPage() {
    const [input, setInput] = useState("")
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState<any>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Focus input on mount
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (result && e.key === 'Enter') {
                handleConfirm();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [result]);

    async function handleAnalyze() {
        if (!input.trim()) return
        setProcessing(true)
        try {
            const data = await processSmartAdd(input)
            if (data) setResult(data)
            else toast.error("Could not understand. Try again.")
        } catch (e) {
            toast.error("Error: " + e)
        } finally {
            setProcessing(false)
        }
    }

    async function handleConfirm() {
        if (!result) return
        setProcessing(true)
        const formData = new FormData()
        // Ensure inputs are strings
        formData.append("amount", result.amount.toString())
        formData.append("category", result.category || "Other")
        formData.append("note", result.note || input)
        // Use current time
        formData.append("date", new Date().toISOString())

        try {
            if (result.type === 'INCOME') await addIncome(formData)
            else if (result.type === 'EXPENSE') await addExpense(formData)
            else if (result.type === 'DEBT') {
                formData.append("type", result.category || "Other") // Debt type usually matches category in simple parser
                formData.append("lender", result.lender || "Unknown")
                await addDebt(formData)
            } else if (result.type === 'REPAYMENT') {
                // Repayment needs debtId. For now, AI simple parser might not get debtId unless complex logic.
                // If ID missing, maybe error or ask user? 
                // For this turn, let's assume simple repayment isn't fully supported without ID context
                // Or try to addRepayment and see if backend handles it (it expects debtId)
                if (result.debtId) {
                    await addRepayment(formData)
                } else {
                    toast.error("Repayment requires selecting a specific debt. Feature coming soon.")
                    setProcessing(false)
                    return
                }
            }
            toast.success("Transaction saved successfully!")
            setResult(null); setInput("")
        } catch (e) {
            toast.error("Error saving: " + e)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="max-w-md mx-auto space-y-6 pt-10">
            <Card className="border-primary/50 shadow-lg shadow-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Sparkles className="w-5 h-5" />
                        Smart Add
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!result ? (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Describe your transaction naturally. <br />
                                Ex: "Spent 2500 on fuel", "got 45000 salary"
                            </p>
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAnalyze();
                                    }
                                }}
                                placeholder="Type here..."
                                className="h-14 text-lg"
                            />
                            <Button onClick={handleAnalyze} disabled={processing || !input} className="w-full transition-all duration-300">
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        Analyze with AI <Sparkles className="ml-2 w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Type</span>
                                    <span className="font-semibold">{result.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Amount</span>
                                    <span className="font-semibold text-xl">LKR {result.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Category</span>
                                    <span>{result.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Note</span>
                                    <span className="italic">{result.note || input}</span>
                                </div>
                                {result.lender && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Lender</span>
                                        <span>{result.lender}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setResult(null)} className="flex-1">Back</Button>
                                <Button onClick={handleConfirm} disabled={processing} className="flex-1 gap-2">
                                    Confirm <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
