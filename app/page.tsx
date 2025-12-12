
import { Suspense } from "react"
import { getDashboardData } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon, Wallet } from "lucide-react"
import { OverviewChart } from "@/components/dashboard/chart"
import Link from "next/link"
import Image from "next/image"
import { AiInsights, AiInsightsSkeleton } from "@/components/dashboard/ai-insights"

export default async function Dashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      {/* Header & Hero Section */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left: Hero Card (Profile + Balance) */}
        <div className="md:col-span-8">
          <Card className="relative overflow-hidden border-none h-full bg-[#171c2b] shadow-2xl">
            {/* Background Gradient Mesh */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full translate-y-1/3 -translate-x-1/4" />

            <CardContent className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-secondary to-pink-500 p-[2px]">
                  <div className="h-full w-full rounded-full bg-[#171c2b] flex items-center justify-center overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-800" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Hi, User</h2>
                  <p className="text-gray-400">Welcome back</p>
                </div>
              </div>

              <div className="flex gap-4 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 min-w-[140px]">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium">Income</span>
                  </div>
                  <div className="text-xl font-bold text-white">{formatCurrency(data.totals.income)}</div>
                </div>
                <div className="flex-1 sm:flex-none bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 min-w-[140px]">
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    <span className="text-xs font-medium">Outcome</span>
                  </div>
                  <div className="text-xl font-bold text-white">{formatCurrency(data.totals.expense)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Total Balance / Wallet */}
        <div className="md:col-span-4">
          <Card className="h-full bg-secondary/10 border-none relative overflow-hidden flex flex-col justify-center shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent" />
            <CardContent className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/20 rounded-xl text-secondary">
                  <Wallet className="h-6 w-6" />
                </div>
                <span className="font-medium text-secondary">Total Balance</span>
              </div>
              <div className="text-4xl font-bold tracking-tight text-white">{formatCurrency(data.totals.balance)}</div>
              <p className="text-sm text-gray-400 mt-2">Available Wallet Funds</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle Section: Spending Limit & Chart */}
      <div className="grid gap-6 md:grid-cols-12">

        {/* Spending Limit Card (with 3D Image) */}
        <div className="md:col-span-4">
          <Card className="h-full bg-[#131722] border-white/5 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-primary/50" />
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex-1 relative min-h-[180px] flex items-center justify-center">
                {/* 3D Image */}
                <div className="relative w-48 h-48 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                  <Image
                    src="/images/hero-3d.png"
                    alt="Savings Goal"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-4 mt-4 relative z-10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-400">Monthly Goal</p>
                    <p className="text-2xl font-bold text-white">LKR 42,000</p>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded bg-secondary/20 text-secondary">
                    45%
                  </div>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-pink-500 w-[45%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <div className="md:col-span-8">
          <Card className="h-full bg-[#171c2b] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <OverviewChart data={data.chart} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Transactions & AI */}
      <div className="grid gap-6 md:grid-cols-1 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="bg-[#171c2b] border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <Link href="/history" className="text-sm text-secondary hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={data.recent} />
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div>
          <Suspense fallback={<AiInsightsSkeleton />}>
            <AiInsights />
          </Suspense>
        </div>
      </div>

    </div>
  )
}

function RecentTransactions({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return <div className="text-sm text-gray-500 p-4 text-center">No recent transactions.</div>
  }
  return (
    <div className="space-y-4">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
              {t.type === 'income' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm sm:text-base text-white">{t.category}</span>
              <span className="text-xs text-gray-400">{new Date(t.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
          <div className={`font-bold ${t.type === 'income' ? 'text-primary' : 'text-white'}`}>
            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
          </div>
        </div>
      ))}
    </div>
  )
}
