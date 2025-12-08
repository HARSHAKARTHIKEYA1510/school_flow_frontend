'use client';
import { Trophy, Award } from 'lucide-react';
export default function ResultsPage() {
    const subjects = [
        { name: 'ADA', score: 85, grade: 'A', maxScore: 100 },
        { name: 'AP', score: 92, grade: 'A+', maxScore: 100 },
        { name: 'DBMS', score: 78, grade: 'B+', maxScore: 100 },
        { name: 'MATHS', score: 88, grade: 'A', maxScore: 100 },
    ];
    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'from-green-500 to-emerald-500';
        if (grade.startsWith('B')) return 'from-blue-500 to-cyan-500';
        return 'from-orange-500 to-amber-500';
    };
    const totalScore = subjects.reduce((sum, s) => sum + s.score, 0);
    const averageScore = Math.round(totalScore / subjects.length);
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Results</h1>
            {/* Overall Performance */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-8 text-white">
                <div className="flex items-center gap-4">
                    <Trophy className="h-16 w-16" />
                    <div>
                        <h2 className="text-2xl font-bold">Overall Performance</h2>
                        <p className="text-3xl font-bold mt-2">{averageScore}%</p>
                        <p className="text-indigo-100 mt-1">Average Score</p>
                    </div>
                </div>
            </div>
            {/* Subject Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((subject) => (
                    <div key={subject.name} className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
                                <p className="text-sm text-gray-500">Out of {subject.maxScore}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getGradeColor(subject.grade)} text-white font-bold`}>
                                {subject.grade}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-gray-800">{subject.score}</span>
                                <span className="text-gray-500">/ {subject.maxScore}</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full bg-gradient-to-r ${getGradeColor(subject.grade)} transition-all`}
                                    style={{ width: `${(subject.score / subject.maxScore) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
