import { Suspense } from "react"
import { getDashboardData } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon, WalletIcon, CreditCardIcon } from "lucide-react"
import { OverviewChart } from "@/components/dashboard/chart"
import Link from "next/link"
import { AiInsights, AiInsightsSkeleton } from "@/components/dashboard/ai-insights"

export default async function Dashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={data.totals.balance}
          icon={WalletIcon}
          description="Net available funds"
        />
        <SummaryCard
          title="Total Income"
          value={data.totals.income}
          icon={ArrowUpIcon}
          className="text-[#00f2ff]" // Neon Cyan
          description="This month"
        />
        <SummaryCard
          title="Total Expense"
          value={data.totals.expense}
          icon={ArrowDownIcon}
          className="text-[#bd00ff]" // Neon Purple
          description="This month"
        />
        <Link href="/debts">
          <SummaryCard
            title="Total Debt"
            value={data.totals.debt}
            icon={CreditCardIcon}
            className="text-[#ff0099]" // Neon Pink/Red
            description="Outstanding"
          />
        </Link>
      </div>

      {/* Charts & Recent Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card border-none ring-1 ring-white/5">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={data.recent} />
          </CardContent>
        </Card>

        {/* Overview Chart */}
        <Card className="col-span-3 glass-card border-none ring-1 ring-white/5">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <OverviewChart data={data.chart} />

          </CardContent>
        </Card>
      </div>

      {/* AI Insights (Streamed) */}
      <Suspense fallback={<AiInsightsSkeleton />}>
        <AiInsights />
      </Suspense>
    </div>
  )
}

function SummaryCard({ title, value, icon: Icon, className, description }: any) {
  // Extract color from className or default to primary
  let glowColor = 'bg-primary';
  if (className?.includes('#00f2ff')) glowColor = 'bg-[#00f2ff]';
  if (className?.includes('#bd00ff')) glowColor = 'bg-[#bd00ff]';
  if (className?.includes('#ff0099')) glowColor = 'bg-[#ff0099]';

  return (
    <Card className="glass-card border-none ring-1 ring-white/5 relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 blur-2xl transition-transform duration-500 group-hover:scale-150 ${glowColor}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-sm text-foreground`}>
          <Icon className={`h-4 w-4 ${className || 'text-primary'}`} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className={`text-2xl font-bold tracking-tight ${className} text-glow`}>{formatCurrency(value)}</div>
        <p className="text-xs text-muted-foreground mt-1 font-medium opacity-80">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function RecentTransactions({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return <div className="text-sm text-muted-foreground">No recent transactions.</div>
  }
  return (
    <div className="space-y-4">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10">
          <div className="flex flex-col">
            <span className="font-medium group-hover:text-primary transition-colors">{t.category}</span>
            <span className="text-xs text-muted-foreground">{new Date(t.timestamp).toLocaleDateString()}</span>
          </div>
          <div className={`text-base font-bold ${t.type === 'income' ? 'text-[#00f2ff]' : 'text-[#ff0099]'}`}>
            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
          </div>
        </div>
      ))}
    </div>
  )
}
