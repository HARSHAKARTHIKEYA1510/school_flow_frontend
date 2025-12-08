'use client';
import { BookOpen } from 'lucide-react';
export default function CoursesPage() {
    const courses = [
        { name: 'ADA', code: 'ADA', credits: 4, instructor: 'Sai Bhargav' },
        { name: 'AP', code: 'AP', credits: 3, instructor: 'Vishal Sharma' },
        { name: 'DBMS', code: 'DBMS', credits: 4, instructor: 'Aayushi' },
        { name: 'MATHS', code: 'MATHS', credits: 3, instructor: 'Adithya' },
    ];
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <div key={course.code} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{course.code}</p>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Instructor:</span>
                                        <span className="font-medium text-gray-800">{course.instructor}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Credits:</span>
                                        <span className="font-medium text-gray-800">{course.credits}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
