"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Moon, Sun, Monitor } from "lucide-react"

import { seedDatabase, clearDatabase } from "@/lib/actions"

export default function SettingsPage() {
    const { setTheme, theme } = useTheme()

    return (
        <div className="space-y-6 pt-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how the app looks on your device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Theme</span>
                        <div className="flex gap-2 bg-muted p-1 rounded-full">
                            <Button
                                variant={theme === 'light' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setTheme('light')}
                                className="rounded-full w-8 h-8"
                            >
                                <Sun className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={theme === 'dark' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setTheme('dark')}
                                className="rounded-full w-8 h-8"
                            >
                                <Moon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={theme === 'system' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setTheme('system')}
                                className="rounded-full w-8 h-8"
                            >
                                <Monitor className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Manage your application data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Demo Data</span>
                            <form action={seedDatabase}>
                                <Button variant="outline" type="submit">
                                    Load Simulated Data
                                </Button>
                            </form>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="font-medium text-destructive">Danger Zone</span>
                            <form action={clearDatabase}>
                                <Button variant="destructive" type="submit">
                                    Clear All Data
                                </Button>
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Personal Finance Tracker v1.0<br />
                        Built with Next.js, Prisma, Tailwind, and Gemini AI.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
