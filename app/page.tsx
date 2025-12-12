
import { Suspense } from "react"
import { getDashboardData } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon, Bell } from "lucide-react"
import { OverviewChart, IncomeOutcomeChart, UtilityDonutChart } from "@/components/dashboard/chart"
import Link from "next/link"
import Image from "next/image"
import { AiInsights, AiInsightsSkeleton } from "@/components/dashboard/ai-insights"

export default async function Dashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full" />
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">Hi, Ferra</p>
              <p className="text-xs text-gray-400">UIX Designer</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-[2px]">
              <div className="bg-[#13151D] w-full h-full rounded-full flex items-center justify-center">
                {/* Avatar */}
                <div className="w-full h-full rounded-full bg-gray-700 hover:bg-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Hero Section: Profile + Bar Chart */}
      <Card className="relative overflow-hidden border-none bg-[#171c2b] shadow-2xl">
        {/* Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-10 w-[300px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-pink-600/10 blur-[100px] rounded-full" />
        </div>

        <CardContent className="relative z-10 p-6 md:p-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left: Profile & Key Stats */}
            <div className="md:col-span-5 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full border-4 border-white/5 shadow-xl bg-gray-700">
                  {/* Avatar Image Placeholder */}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Ferra Alexandra</h2>
                  <p className="text-gray-400">UIX Designer</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-1.5 bg-green-500/20 rounded-lg text-green-400">
                      <ArrowUpIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-400">Income</span>
                  </div>
                  <div className="text-xl font-bold text-white">{formatCurrency(data.totals.income)}</div>
                </div>
                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-1.5 bg-pink-500/20 rounded-lg text-pink-400">
                      <ArrowDownIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-400">Outcome</span>
                  </div>
                  <div className="text-xl font-bold text-white">{formatCurrency(data.totals.expense)}</div>
                </div>
              </div>
            </div>

            {/* Right: Income/Outcome Bar Chart */}
            <div className="md:col-span-7 h-[200px]">
              <p className="text-sm font-medium text-gray-400 mb-4">Graph</p>
              <IncomeOutcomeChart data={data.chart} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Middle: Expenses Line Graph */}
      <div>
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-lg font-semibold text-white">Expenses</h3>
        </div>
        <div className="h-[120px] w-full">
          <OverviewChart data={data.chart} />
        </div>
      </div>

      {/* Bottom Grid: Spending, Transactions, Donut */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">

        {/* 1. Spending Limit (3D) */}
        <Card className="bg-[#171c2b] border-none relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-500/5" />
          <CardContent className="p-6 h-full flex flex-col items-center text-center">
            <div className="relative w-40 h-40 mb-4 transition-transform duration-500 group-hover:scale-110">
              <Image
                src="/images/hero-3d.png"
                alt="3D Character"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-muted-foreground text-sm">Spending Limit</p>
            <p className="text-2xl font-bold text-white mt-1">LKR 42,000</p>

            <div className="w-full mt-6">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-pink-500 to-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Transaction List */}
        <Card className="bg-[#171c2b] border-none">
          <CardHeader>
            <CardTitle className="text-base text-white">Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recent.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-500'}`}>
                    {t.type === 'income' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-[100px]">{t.category}</p>
                    <p className="text-xs text-gray-500">{new Date(t.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                  {t.type === 'expense' && '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 3. Breakdown Donut */}
        <Card className="bg-[#171c2b] border-none relative">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="relative h-[180px] w-full flex items-center justify-center">
              <UtilityDonutChart />
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-bold text-white">$1,200</span>
                <span className="text-xs text-gray-400">Utility</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Utility 30%
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Entertainment 20%
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Groceries 50%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Streamed at bottom */}
      <Suspense fallback={<AiInsightsSkeleton />}>
        <AiInsights />
      </Suspense>

    </div>
  )
}
