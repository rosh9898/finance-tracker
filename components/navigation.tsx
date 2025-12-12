"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PlusCircle, Sparkles, History, Settings, Calendar, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navigation() {
    const pathname = usePathname()

    const links = [
        {
            href: "/",
            label: "Dashboard",
            mobileLabel: "Home",
            icon: LayoutDashboard,
        },
        {
            href: "/add",
            label: "Add Entry",
            mobileLabel: "Add",
            icon: PlusCircle,
        },
        {
            href: "/smart-add",
            label: "Smart Add",
            mobileLabel: "AI Add",
            icon: Sparkles,
            color: "text-primary", // Special color for Smart Add
        },
        {
            href: "/history",
            label: "History",
            mobileLabel: "History",
            icon: History,
        },
        {
            href: "/subscriptions",
            label: "Subscriptions",
            mobileLabel: "Subs",
            icon: Calendar,
        },
        {
            href: "/goals",
            label: "Goals",
            mobileLabel: "Goals",
            icon: Target,
        },
    ]

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 pb-safe">
                <div className="flex justify-around items-center h-16 px-1">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full min-w-[50px] transition-colors",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground",
                                    link.color && !isActive && link.color
                                )}
                            >
                                <Icon className={cn("h-5 w-5 mb-0.5", isActive && "animate-pulse")} />
                                <span className="text-[10px] font-medium leading-none">{link.mobileLabel}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Desktop Sidebar Navigation */}
            <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r bg-background/95 backdrop-blur z-50 p-4">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">FT</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">FinanceTrack</h1>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                            >
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        isActive && "bg-secondary font-semibold",
                                        link.color
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Button>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-auto">
                    <Link href="/settings">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Settings className="h-5 w-5" />
                            Settings
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Spacer for desktop sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0" />
            {/* Wait, the layout wrapper handles the content area, I should adjust layout.tsx or handle margin here. 
         My layout.tsx has "max-w-7xl mx-auto". If I put sidebar fixed, I need to push content. 
         Actually, I put Navigation *after* main in layout.tsx? 
         Only for mobile bottom bar that works. 
         For desktop sidebar, it needs to be alongside.
         I'll adjust layout.tsx later or use 'md:pl-64' on main.
      */}
        </>
    )
}
