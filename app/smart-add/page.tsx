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
        formData.append("amount", result.amount.toString())
        formData.append("category", result.category)
        formData.append("note", result.note || input)
        formData.append("date", new Date().toISOString())

        try {
            if (result.type === 'INCOME') await addIncome(formData)
            else if (result.type === 'EXPENSE') await addExpense(formData)
            else if (result.type === 'DEBT') {
                formData.append("type", result.category || "Other")
                formData.append("lender", result.lender || "Unknown")
                await addDebt(formData)
            } else if (result.type === 'REPAYMENT') {
                await addRepayment(formData)
            }
            toast.success("Transaction saved successfully!")
            setResult(null); setInput("")
        } catch (e) {
            toast.error("Error saving: " + e)
        } finally {
            setProcessing(false)
        }
    }

    const CATEGORIES = {
        EXPENSE: ["Food & Groceries", "Transport & Fuel", "Housing & Utilities", "Health & Medical", "Shopping & Personal Care", "Entertainment & Leisure", "Education & Courses", "Work & Professional", "Family & Gifts", "Other / Miscellaneous"],
        INCOME: ["Salary", "Business / Freelance", "Investments", "Gifts / Allowances", "Other Income"],
        DEBT: ["Credit Card", "Loan", "Borrowed Money", "Other Debt"],
        REPAYMENT: ["Credit Card", "Loan", "Borrowed Money", "Other Debt"]
    }

    return (
        <div className="max-w-md mx-auto space-y-6 pt-10">
            <Card className="glass-card border-l-4 border-l-primary/50 relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none bg-primary/20 blur-3xl rounded-full w-32 h-32 -mr-10 -mt-10" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary font-bold text-xl">
                        <div className="p-2 rounded-lg bg-primary/10 ring-1 ring-primary/20 backdrop-blur-sm">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        Smart Add
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                    {!result ? (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground font-medium">
                                Describe your transaction naturally. <br />
                                <span className="opacity-70 font-normal">Ex: "Spent 2500 on fuel", "got 45000 salary"</span>
                            </p>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
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
                                    className="h-14 text-lg bg-background/80 backdrop-blur-sm relative border-transparent focus-visible:ring-primary/50 placeholder:text-muted-foreground/50 shadow-sm"
                                />
                            </div>
                            <Button onClick={handleAnalyze} disabled={processing || !input} className="w-full transition-all duration-300 h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5">
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
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="p-5 bg-background/40 backdrop-blur-md rounded-xl space-y-3 ring-1 ring-white/10 shadow-inner">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-sm text-muted-foreground font-medium">Type</span>
                                    {/* Allow changing type if AI got it wrong? Maybe too complex for now, user asked for category. */}
                                    <span className="font-bold text-primary tracking-wide bg-primary/10 px-3 py-1 rounded-full text-xs uppercase">{result.type}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground font-medium">Amount</span>
                                    <Input
                                        type="number"
                                        value={result.amount}
                                        onChange={(e) => setResult({ ...result, amount: e.target.value })}
                                        className="w-32 text-right h-8 bg-transparent border-none focus:ring-0 text-2xl font-bold tracking-tight p-0"
                                    />
                                </div>
                                <div className="flex justify-between items-center gap-4">
                                    <span className="text-sm text-muted-foreground font-medium">Category</span>
                                    {CATEGORIES[result.type as keyof typeof CATEGORIES] ? (
                                        <select
                                            value={result.category}
                                            onChange={(e) => setResult({ ...result, category: e.target.value })}
                                            className="font-medium text-right bg-transparent border-b border-white/10 focus:outline-none focus:border-primary text-sm max-w-[150px]"
                                        >
                                            {CATEGORIES[result.type as keyof typeof CATEGORIES].map((c) => (
                                                <option key={c} value={c} className="bg-background text-foreground">{c}</option>
                                            ))}
                                            <option value="Other" className="bg-background text-foreground">Other</option>
                                        </select>
                                    ) : (
                                        <Input
                                            value={result.category}
                                            onChange={(e) => setResult({ ...result, category: e.target.value })}
                                            className="w-40 text-right h-8 bg-transparent border-b border-white/10 focus:ring-0 p-0 text-sm font-medium rounded-none"
                                        />
                                    )}
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-sm text-muted-foreground font-medium">Note</span>
                                    <Input
                                        value={result.note || input}
                                        onChange={(e) => setResult({ ...result, note: e.target.value })}
                                        className="text-right h-8 bg-transparent border-b border-white/10 focus:ring-0 p-0 text-sm italic opacity-80"
                                    />
                                </div>
                                {result.lender && (
                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                        <span className="text-sm text-muted-foreground font-medium">Lender</span>
                                        <Input
                                            value={result.lender}
                                            onChange={(e) => setResult({ ...result, lender: e.target.value })}
                                            className="text-right h-8 bg-transparent border-b border-white/10 focus:ring-0 p-0 text-sm font-medium text-orange-500"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => setResult(null)} className="flex-1 hover:bg-muted/80">Back</Button>
                                <Button onClick={handleConfirm} disabled={processing} className="flex-1 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
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
