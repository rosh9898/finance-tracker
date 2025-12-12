
import { Sidebar } from "@/components/sidebar";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { StatsBarChart } from "@/components/dashboard/stats-chart";
import { ExpenseLineChart } from "@/components/dashboard/expense-chart";
import { SpendingLimitCard } from "@/components/dashboard/spending-card";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { Bell, Menu } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
      {/* 1. Sidebar (Hidden on Mobile) */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 w-full md:ml-[250px] p-4 md:p-8 overflow-x-hidden">

        {/* Top Header Row */}
        <header className="flex justify-between items-center mb-8 md:mb-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger (Visual Only for now) */}
            <button className="md:hidden p-2 rounded-xl bg-surface border border-white/5 text-muted hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="relative cursor-pointer group">
              <div className="p-2 rounded-xl bg-surface border border-transparent group-hover:border-white/5 transition-colors">
                <Bell className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
              </div>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-background" />
            </div>
            <div className="hidden md:flex items-center gap-4 pl-8 border-l border-white/5">
              <div className="text-right">
                <p className="text-sm font-bold text-white">Ferra Alexandra</p>
                <p className="text-xs text-muted">UIX Designer</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-surface bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Ferra')] bg-cover border-2 border-surface ring-2 ring-white/5" />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto">

          {/* Row 1: Profile + Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            <div className="lg:col-span-8 w-full">
              <ProfileCard />
            </div>
            <div className="lg:col-span-4 w-full">
              <StatsBarChart />
            </div>
          </div>

          {/* Row 2: Expenses Line Graph */}
          <div className="w-full">
            <ExpenseLineChart />
          </div>

          {/* Row 3: Detail Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
            <div className="w-full">
              <SpendingLimitCard />
            </div>
            <div className="w-full">
              <TransactionList />
            </div>
            <div className="w-full md:col-span-2 xl:col-span-1">
              <DonutChart />
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
