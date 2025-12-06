'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { LayoutDashboard, BookOpen, Calendar, Award, LogOut } from 'lucide-react';

interface StudentLayoutProps {
    children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/student/courses', label: 'Courses', icon: BookOpen },
        { href: '/dashboard/student/attendance', label: 'Attendance', icon: Calendar },
        { href: '/dashboard/student/results', label: 'Results', icon: Award },
    ];

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
            {/* Enhanced Sidebar with modern design */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-indigo-600 via-purple-600 to-violet-700 shadow-2xl">
                {/* Logo section with glow effect */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-black text-white">SF</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white drop-shadow-lg">
                                SchoolFlow
                            </h1>
                            <p className="text-xs text-white/70 font-medium">Student Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-6 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3.5 mb-2 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/20'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white hover:shadow-lg'
                                    }`}
                            >
                                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-600' : ''
                                    }`} />
                                <span className="font-semibold">{item.label}</span>
                            </a>
                        );
                    })}
                </nav>

                {/* Enhanced logout button */}
                <button
                    onClick={handleLogout}
                    className="absolute bottom-6 left-4 right-4 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 font-semibold shadow-lg backdrop-blur-sm"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content with enhanced spacing */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
