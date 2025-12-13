"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PlusCircle, Sparkles, History, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export function Navigation() {
    const pathname = usePathname()

    const links = [
        {
            href: "/",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            href: "/add",
            label: "Add Entry",
            icon: PlusCircle,
        },
        {
            href: "/smart-add",
            label: "Smart Add",
            icon: Sparkles,
            color: "text-primary", // Special color for Smart Add
        },
        {
            href: "/history",
            label: "History",
            icon: History,
        },
    ]

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground",
                                    link.color && !isActive && link.color
                                )}
                            >
                                <Icon className={cn("h-6 w-6", isActive && "animate-pulse")} />
                                <span className="text-xs font-medium">{link.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Desktop Sidebar Navigation */}
            <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r bg-background/95 backdrop-blur z-50 p-4">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <Logo />
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        NexaFlow
                    </h1>
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
