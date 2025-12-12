
import { Sidebar } from "@/components/sidebar";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { StatsBarChart } from "@/components/dashboard/stats-chart";
import { ExpenseLineChart } from "@/components/dashboard/expense-chart";
import { SpendingLimitCard } from "@/components/dashboard/spending-card";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen bg-background">
      {/* 1. Fixed Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 ml-[250px] p-8">

        {/* Top Header Row (Title + Profile Actions) */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell className="w-6 h-6 text-muted hover:text-white transition-colors" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">Hi, Ferra</span>
              <div className="w-10 h-10 rounded-full bg-surface bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Ferra')] bg-cover border border-white/10" />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="space-y-6">

          {/* Row 1: Profile + Bar Chart */}
          <div className="grid grid-cols-12 gap-6 h-[220px]">
            <div className="col-span-8 h-full">
              <ProfileCard />
            </div>
            <div className="col-span-4 h-full">
              <StatsBarChart />
            </div>
          </div>

          {/* Row 2: Expenses Line Graph */}
          <div className="w-full">
            <ExpenseLineChart />
          </div>

          {/* Row 3: Detail Widgets */}
          <div className="grid grid-cols-12 gap-6 h-[260px]">
            <div className="col-span-4 h-full">
              <SpendingLimitCard />
            </div>
            <div className="col-span-4 h-full">
              <TransactionList />
            </div>
            <div className="col-span-4 h-full">
              <DonutChart />
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
