'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';
import Cookies from 'js-cookie';
import { Calendar, TrendingUp, Check, X, Sparkles } from 'lucide-react';

export default function AttendancePage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            console.log('API_URL:', API_URL);
            const token = Cookies.get('token');
            const response = await fetch(`${API_URL}/api/student/attendance`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (response.ok) {
                    setRecords(data.records);
                } else {
                    console.error('Server error:', data.error);
                }
            } else {
                const text = await response.text();
                console.error('Received non-JSON response:', text);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSubjectStats = () => {
        const subjectMap = new Map();

        records.forEach((record) => {
            const key = record.subject.name;
            if (!subjectMap.has(key)) {
                subjectMap.set(key, { total: 0, present: 0, code: record.subject.code });
            }
            const stats = subjectMap.get(key);
            stats.total++;
            if (record.status === 'PRESENT') stats.present++;
        });

        return Array.from(subjectMap.entries()).map(([name, stats]) => ({
            name,
            code: stats.code,
            percentage: Math.round((stats.present / stats.total) * 100),
            present: stats.present,
            total: stats.total,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600 animate-pulse" />
                </div>
            </div>
        );
    }

    const subjectStats = getSubjectStats();
    const overallStats = {
        total: records.length,
        present: records.filter((r) => r.status === 'PRESENT').length,
    };
    const overallPercentage = overallStats.total > 0
        ? Math.round((overallStats.present / overallStats.total) * 100)
        : 0;

    const getGradientForPercentage = (percentage) => {
        if (percentage >= 90) return 'from-emerald-500 to-green-600';
        if (percentage >= 75) return 'from-blue-500 to-cyan-600';
        if (percentage >= 60) return 'from-amber-500 to-orange-600';
        return 'from-red-500 to-rose-600';
    };

    return (
        <div className="space-y-8">
            {/* Header with overall stats */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>

                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">Attendance</h1>
                        <p className="text-white/80 font-medium">Track your academic presence</p>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-black text-white drop-shadow-lg">{overallPercentage}%</div>
                        <p className="text-white/80 text-sm font-medium mt-1">Overall Attendance</p>
                    </div>
                </div>
            </div>

            {/* Subject-wise Stats with enhanced cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjectStats.map((subject, index) => {
                    const gradient = getGradientForPercentage(subject.percentage);

                    return (
                        <div
                            key={subject.name}
                            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Subject name with code */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
                                <p className="text-sm text-gray-500 font-medium">{subject.code}</p>
                            </div>

                            {/* Circular progress */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke={`url(#gradient-${subject.name})`}
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(subject.percentage / 100) * 251} 251`}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000"
                                        />
                                        <defs>
                                            <linearGradient id={`gradient-${subject.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" className="text-indigo-500" stopColor="currentColor" />
                                                <stop offset="100%" className="text-purple-600" stopColor="currentColor" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-black text-gray-800">{subject.percentage}%</span>
                                    </div>
                                </div>

                                {/* Trending indicator */}
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${subject.percentage >= 75 ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {subject.percentage >= 75 ? (
                                        <>
                                            <TrendingUp className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-bold text-green-700">Good</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
                                            <span className="text-sm font-bold text-red-700">Low</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Class count */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    <span className="font-bold text-gray-800">{subject.present}</span> of{' '}
                                    <span className="font-bold text-gray-800">{subject.total}</span> classes attended
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Records with modern card design */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Recent Attendance</h2>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-3">
                        {records.slice(0, 15).map((record, index) => (
                            <div
                                key={record.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${record.status === 'PRESENT'
                                        ? 'bg-green-100'
                                        : 'bg-red-100'
                                        }`}>
                                        {record.status === 'PRESENT' ? (
                                            <Check className="h-6 w-6 text-green-600" />
                                        ) : (
                                            <X className="h-6 w-6 text-red-600" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{record.subject.name}</h4>
                                        <p className="text-sm text-gray-500">{record.subject.code}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold text-gray-700">
                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="ml-4">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-bold ${record.status === 'PRESENT'
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                            : 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                            }`}
                                    >
                                        {record.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
