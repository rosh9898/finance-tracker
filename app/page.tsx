import { Suspense } from "react"
import Link from "next/link"
import { getDashboardData } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon, Bell } from "lucide-react"
import { OverviewChart } from "@/components/dashboard/chart"
import { BreakdownChart } from "@/components/dashboard/breakdown-chart"
import { Button } from "@/components/ui/button"
import { MotionDiv, MotionList } from "@/components/ui/motion"

export default async function Dashboard() {
  const data = await getDashboardData()

  return (
    <MotionList className="space-y-8 pb-8">

      {/* Header */}
      <MotionDiv className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 dark:from-white dark:via-gray-200 dark:to-gray-500">
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>
      </MotionDiv>

      {/* Main Stats Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MotionDiv className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border dark:border-white/5 shadow-2xl flex flex-col justify-between h-full group">
            {/* Background Gradient Mesh */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-100/50 via-background to-background dark:from-indigo-900/40 dark:via-background dark:to-background z-0" />
            <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-pink-500/10 dark:bg-pink-600/20 rounded-full blur-[100px] z-0 pointer-events-none" />

            <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
                <div className="space-y-1 w-full md:w-auto">
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium tracking-wide uppercase text-[10px]"><div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" /> Balance</div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{formatCurrency(data.totals.balance)}</p>
                </div>
                <div className="space-y-1 w-full md:w-auto">
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium tracking-wide uppercase text-[10px]"><div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" /> Expenses</div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{formatCurrency(data.totals.expense)}</p>
                </div>
                <div className="space-y-1 w-full md:w-auto">
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium tracking-wide uppercase text-[10px]"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" /> Total Debt</div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{formatCurrency(data.totals.debt)}</p>
                </div>
              </div>

              {/* Chart Container within the card */}
              <div className="relative w-full h-[300px] mt-8">
                <OverviewChart data={data.chart} />
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>

      {/* Recent Activity / Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MotionDiv delay={0.2} className="lg:col-span-2">
          <Card className="rounded-3xl border-border dark:border-white/5 bg-card/40 backdrop-blur-md p-4 md:p-6 h-full transition-colors hover:bg-card/60">
            <CardHeader className="px-0 pt-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-900 dark:text-white">Recent Transactions</CardTitle>
                <Link href="/history">
                  <Button variant="ghost" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              {data.recent.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer border border-transparent hover:border-black/5 dark:hover:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-pink-500/10 text-pink-500'}`}>
                      {t.type === 'INCOME' ? <ArrowUpIcon className="w-6 h-6" /> : <ArrowDownIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-semibold text-base text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">{t.category}</p>
                      <p className="text-xs text-gray-500 font-medium">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg tracking-tight ${t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </MotionDiv>

        <MotionDiv delay={0.3} className="lg:col-span-1">
          <Card className="rounded-3xl border-border dark:border-white/5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 h-full">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl text-gray-900 dark:text-white">Expense Breakdown</CardTitle>
            </CardHeader>
            <BreakdownChart data={data.breakdown} />
          </Card>
        </MotionDiv>
      </div>
    </MotionList>
  )
}
