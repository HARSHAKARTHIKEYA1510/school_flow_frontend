'use client';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';
import Cookies from 'js-cookie';
import { Clock, MapPin } from 'lucide-react';
export default function StudentDashboard() {
    const [timetable, setTimetable] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);
    const getAuthHeaders = () => {
        const token = Cookies.get('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };
    const fetchData = async () => {
        try {
            const [timetableRes, attendanceRes] = await Promise.all([
                fetch(`${API_URL}/api/student/timetable`, { headers: getAuthHeaders() }),
                fetch(`${API_URL}/api/student/attendance`, { headers: getAuthHeaders() }),
            ]);
            if (timetableRes.ok && attendanceRes.ok) {
                const timetableData = await timetableRes.json();
                const attendanceData = await attendanceRes.json();
                setTimetable(timetableData);
                const records = attendanceData.records;
                const totalClasses = records.length;
                const attended = records.filter((r) => r.status === 'PRESENT').length;
                const percentage = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0;
                setStats({ totalClasses, attended, percentage });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }
    const getDayName = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
                <p className="text-indigo-100 mt-2">Here's what's happening today</p>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attendance Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance</h3>
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="#e5e7eb"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="url(#gradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${(stats?.percentage || 0) * 3.52} 352`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-gray-800">{stats?.percentage}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            {stats?.attended} of {stats?.totalClasses} classes attended
                        </p>
                    </div>
                </div>
                {/* Today's Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Summary</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Classes Today</p>
                                <p className="text-2xl font-bold text-gray-800">{timetable.length}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-600">Day</p>
                            <p className="text-xl font-semibold text-gray-800">{getDayName()}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Today's Timetable */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Today's Timetable</h3>
                {timetable.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No classes scheduled for today 🎉</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {timetable.map((entry) => (
                            <div
                                key={entry.id}
                                className="border-2 border-indigo-100 rounded-xl p-4 hover:shadow-md transition-shadow hover:border-indigo-300"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">{entry.subject.name}</h4>
                                        <p className="text-sm text-gray-500">{entry.subject.code}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4 text-indigo-500" />
                                        <span>{entry.startTime} - {entry.endTime}</span>
                                    </div>
                                    {entry.room && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 text-indigo-500" />
                                            <span>{entry.room}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
