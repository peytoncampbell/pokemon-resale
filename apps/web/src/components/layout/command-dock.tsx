"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    LayoutDashboard,
    Package,
    ArrowLeftRight,
    Settings,
    LogOut,
    Menu,
    Bell,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";

interface CommandDockProps {
    onMobileMenuToggle: () => void;
}

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Alerts", href: "/alerts", icon: Bell },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Organization", href: "/organization", icon: Building2 },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function CommandDock({ onMobileMenuToggle }: CommandDockProps) {
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);
    const { signOut } = useAuthContext();

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-vision-navy/90 border-b border-white/10 flex items-center justify-between px-4 z-50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg icon-bg-blue flex items-center justify-center text-white font-bold shadow-lg shadow-vision-blue/30">
                        P
                    </div>
                    <span className="font-bold text-lg text-white">Pokemon Resale</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onMobileMenuToggle}>
                    <Menu className="h-6 w-6 text-white" />
                </Button>
            </div>

            {/* Desktop Dock - flows in grid layout */}
            <motion.aside
                initial={false}
                animate={{ width: isHovered ? 240 : 80 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="hidden md:flex flex-col glass-card-gradient overflow-hidden transition-all duration-300 rounded-3xl h-[calc(100vh-2.5rem)] sticky top-4"
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-5 gap-4 flex-shrink-0">
                    <div className="h-10 w-10 min-w-[2.5rem] rounded-xl icon-bg-blue flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-vision-blue/30">
                        P
                    </div>
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-lg text-white whitespace-nowrap overflow-hidden"
                            >
                                Pokemon Resale
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 flex flex-col gap-2 px-3 py-4 overflow-y-auto scrollbar-none">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center h-12 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-gradient-to-r from-vision-blue to-vision-cyan/80 text-white shadow-lg shadow-vision-blue/20"
                                        : "text-white/60 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <div className="w-14 flex justify-center items-center flex-shrink-0">
                                    <item.icon
                                        className={cn(
                                            "h-5 w-5 transition-transform duration-200",
                                            isActive ? "scale-110" : "group-hover:scale-110"
                                        )}
                                    />
                                    {/* Active Indicator Dot */}
                                    {isActive && !isHovered && (
                                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                </div>

                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="font-medium whitespace-nowrap overflow-hidden pr-4"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-3 border-t border-white/10 bg-black/10">
                    <button
                        onClick={() => signOut()}
                        className={cn(
                            "flex items-center w-full h-12 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
                        )}
                    >
                        <div className="w-14 flex justify-center items-center flex-shrink-0">
                            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <AnimatePresence>
                            {isHovered && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="font-medium whitespace-nowrap overflow-hidden"
                                >
                                    Sign Out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
