import { Suspense } from "react"
import Link from "next/link"
import { getDashboardData } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon, Bell, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { OverviewChart } from "@/components/dashboard/chart"
import { BreakdownChart } from "@/components/dashboard/breakdown-chart"
import { Button } from "@/components/ui/button"
import { MotionDiv, MotionList } from "@/components/ui/motion"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export default async function Dashboard() {
  const data = await getDashboardData()

  return (
    <MotionList className="space-y-8 pb-8">

      {/* Header */}
      <MotionDiv className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter gradient-text-animated">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 transition-all duration-300 icon-bounce pulse-ring text-primary">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </MotionDiv>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <MotionDiv delay={0.1}>
          <GlassCard variant="premium" glow="blue" className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Balance</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground stat-number">
                  <AnimatedCounter value={data.totals.balance} prefix="LKR " />
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center icon-bounce">
                <Wallet className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </GlassCard>
        </MotionDiv>

        <MotionDiv delay={0.2}>
          <GlassCard variant="premium" glow="pink" className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expenses</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground stat-number">
                  <AnimatedCounter value={data.totals.expense} prefix="LKR " />
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center icon-bounce">
                <TrendingDown className="w-6 h-6 text-pink-400" />
              </div>
            </div>
          </GlassCard>
        </MotionDiv>

        <MotionDiv delay={0.3}>
          <GlassCard variant="premium" glow="purple" className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Debt</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground stat-number">
                  <AnimatedCounter value={data.totals.debt} prefix="LKR " />
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center icon-bounce">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </GlassCard>
        </MotionDiv>
      </div>

      {/* Chart Area */}
      <MotionDiv delay={0.4}>
        <GlassCard variant="premium" hover={false} className="p-5 md:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold gradient-text">Financial Overview</h2>
              <div className="flex gap-2">
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full shimmer">30 Days</span>
              </div>
            </div>
            <div className="relative w-full h-[280px] sm:h-[320px]">
              <OverviewChart data={data.chart} />
            </div>
          </div>
        </GlassCard>
      </MotionDiv>

      {/* Recent Activity / Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MotionDiv delay={0.5} className="lg:col-span-2">
          <GlassCard variant="premium" hover={false} className="p-4 md:p-6 h-full">
            <CardHeader className="px-0 pt-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl gradient-text">Recent Transactions</CardTitle>
                <Link href="/history">
                  <Button variant="ghost" className="text-xs text-muted-foreground hover:text-primary transition-colors shimmer">
                    View All →
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0 space-y-3">
              {data.recent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent transactions</p>
                </div>
              ) : (
                data.recent.map((t: any, index: number) => (
                  <MotionDiv
                    key={t.id}
                    delay={0.6 + index * 0.05}
                    className="flex items-center justify-between group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/5 hover:border-white/10 card-shine"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${t.type === 'INCOME'
                          ? 'bg-emerald-500/20 text-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'bg-pink-500/20 text-pink-400 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                        }`}>
                        {t.type === 'INCOME' ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">{t.category}</p>
                        <p className="text-xs text-muted-foreground font-medium">{new Date(t.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`font-bold text-lg tracking-tight transition-all duration-300 ${t.type === 'INCOME'
                        ? 'text-emerald-400 text-glow-subtle'
                        : 'text-foreground group-hover:text-pink-400'
                      }`}>
                      {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                    </div>
                  </MotionDiv>
                ))
              )}
            </CardContent>
          </GlassCard>
        </MotionDiv>

        <MotionDiv delay={0.6} className="lg:col-span-1">
          <GlassCard variant="gradient-border" hover={false} className="p-6 h-full bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl gradient-text">Expense Breakdown</CardTitle>
            </CardHeader>
            <BreakdownChart data={data.breakdown} />
          </GlassCard>
        </MotionDiv>
      </div>
    </MotionList>
  )
}
