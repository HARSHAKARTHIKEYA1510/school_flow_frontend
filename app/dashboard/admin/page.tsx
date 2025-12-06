'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { UserPlus, Calendar, LogOut, Loader2, Users, BookOpen, TrendingUp, Search, Plus, Check, X, Edit2, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Student {
    id: string;
    name: string;
    rollNumber: string;
    email: string;
}

interface Subject {
    id: string;
    name: string;
    code: string;
}

interface AttendanceRecord {
    id: string;
    date: string;
    status: 'PRESENT' | 'ABSENT';
    student: Student;
    subject: Subject;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'view-attendance'>('students');
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>(''); // For filtering attendance by student

    // Form states
    const [newStudent, setNewStudent] = useState({ name: '', email: '', rollNumber: '' });

    // Edit/Delete modals
    const [editStudentModal, setEditStudentModal] = useState<Student | null>(null);
    const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
    const [editAttendanceModal, setEditAttendanceModal] = useState<AttendanceRecord | null>(null);
    const [deleteAttendanceId, setDeleteAttendanceId] = useState<string | null>(null);

    useEffect(() => {
        fetchStudents();
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (activeTab === 'view-attendance') {
            fetchAttendanceRecords();
        }
    }, [activeTab]);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/admin/students');
            setStudents(data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        }
    };

    const fetchSubjects = async () => {
        try {
            const { data } = await api.get('/admin/subjects');
            setSubjects(data);
        } catch (err) {
            console.error('Failed to fetch subjects', err);
        }
    };

    const fetchAttendanceRecords = async () => {
        try {
            const { data } = await api.get('/admin/attendance');
            setAttendanceRecords(data);
        } catch (err) {
            console.error('Failed to fetch attendance', err);
        }
    };

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/admin/students', newStudent);
            alert(`Student created! Password: ${data.password}`);
            setNewStudent({ name: '', email: '', rollNumber: '' });
            fetchStudents();
        } catch (err) {
            alert('Failed to create student');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editStudentModal) return;
        setLoading(true);
        try {
            await api.put(`/admin/students/${editStudentModal.id}`, editStudentModal);
            alert('Student updated successfully!');
            setEditStudentModal(null);
            fetchStudents();
        } catch (err: any) {
            console.error('Update student error:', err);
            console.error('Error response:', err.response?.data);
            alert(`Failed to update student: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStudent = async () => {
        if (!deleteStudentId) return;
        setLoading(true);
        try {
            await api.delete(`/admin/students/${deleteStudentId}`);
            alert('Student deleted successfully!');
            setDeleteStudentId(null);
            fetchStudents();
        } catch (err: any) {
            console.error('Delete student error:', err);
            console.error('Error response:', err.response?.data);
            alert(`Failed to delete student: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editAttendanceModal) return;
        setLoading(true);
        try {
            await api.put(`/admin/attendance/${editAttendanceModal.id}`, {
                studentId: editAttendanceModal.student.id,
                subjectId: editAttendanceModal.subject.id,
                date: editAttendanceModal.date,
                status: editAttendanceModal.status
            });
            alert('Attendance updated successfully!');
            setEditAttendanceModal(null);
            fetchAttendanceRecords();
        } catch (err: any) {
            console.error('Update attendance error:', err);
            console.error('Error response:', err.response?.data);
            alert(`Failed to update attendance: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAttendance = async () => {
        if (!deleteAttendanceId) return;
        setLoading(true);
        try {
            await api.delete(`/admin/attendance/${deleteAttendanceId}`);
            alert('Attendance deleted successfully!');
            setDeleteAttendanceId(null);
            fetchAttendanceRecords();
        } catch (err: any) {
            console.error('Delete attendance error:', err);
            console.error('Error response:', err.response?.data);
            alert(`Failed to delete attendance: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        router.push('/');
    };

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
                                <span className="text-xl font-black text-white">SF</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-indigo-600">
                                    SchoolFlow Admin
                                </h1>
                                <p className="text-xs text-gray-500 font-medium">Management Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-6 px-6 py-2 bg-indigo-50 rounded-xl">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{students.length}</div>
                                    <div className="text-xs text-gray-600">Students</div>
                                </div>
                                <div className="w-px h-8 bg-gray-300"></div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{subjects.length}</div>
                                    <div className="text-xs text-gray-600">Subjects</div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all font-semibold"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${activeTab === 'students'
                            ? 'bg-indigo-600 text-white scale-105'
                            : 'bg-white text-gray-600 hover:shadow-xl hover:scale-105'
                            }`}
                    >
                        <Users className="h-5 w-5" />
                        <span>Manage Students</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${activeTab === 'attendance'
                            ? 'bg-indigo-600 text-white scale-105'
                            : 'bg-white text-gray-600 hover:shadow-xl hover:scale-105'
                            }`}
                    >
                        <Calendar className="h-5 w-5" />
                        <span>Mark Attendance</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('view-attendance')}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${activeTab === 'view-attendance'
                            ? 'bg-indigo-600 text-white scale-105'
                            : 'bg-white text-gray-600 hover:shadow-xl hover:scale-105'
                            }`}
                    >
                        <Eye className="h-5 w-5" />
                        <span>View Attendance</span>
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'students' && (
                    <div className="space-y-6">
                        {/* Create Student Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                                    <Plus className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Create New Student</h2>
                            </div>

                            <form onSubmit={handleCreateStudent} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            required
                                            value={newStudent.name}
                                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="e.g. john@schoolflow.com"
                                            required
                                            value={newStudent.email}
                                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Roll Number *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. ROLL111"
                                            required
                                            value={newStudent.rollNumber}
                                            onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Student'}
                                </button>
                            </form>
                        </div>

                        {/* Student List Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-indigo-50 p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">Student List</h3>
                                    </div>

                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-gray-900 placeholder-gray-400 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredStudents.map((student) => (
                                        <div
                                            key={student.id}
                                            className="p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-800 truncate">{student.name}</h4>
                                                    <p className="text-sm text-indigo-600 font-semibold">{student.rollNumber}</p>
                                                    <p className="text-sm text-gray-500 truncate">{student.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => setEditStudentModal(student)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-semibold"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteStudentId(student.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <AttendanceMarker students={students} subjects={subjects} />
                )}

                {activeTab === 'view-attendance' && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-indigo-50 p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                                        <Eye className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">Attendance Records</h3>
                                </div>

                                {/* Student Filter */}
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-semibold text-gray-700">Filter by Student:</label>
                                    <select
                                        value={selectedStudentFilter}
                                        onChange={(e) => setSelectedStudentFilter(e.target.value)}
                                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 bg-white min-w-[250px]"
                                    >
                                        <option value="">All Students</option>
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.rollNumber})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {(() => {
                                const filteredRecords = selectedStudentFilter
                                    ? attendanceRecords.filter(record => record.student.id === selectedStudentFilter)
                                    : attendanceRecords;

                                return filteredRecords.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        {selectedStudentFilter
                                            ? 'No attendance records found for this student'
                                            : 'No attendance records found'}
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredRecords.map((record) => (
                                            <div
                                                key={record.id}
                                                className="p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:border-indigo-200 transition-all"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="font-bold text-gray-800">{record.student.name}</h4>
                                                            <span className="text-sm text-gray-500">({record.student.rollNumber})</span>
                                                            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                                                                {record.subject.name}
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${record.status === 'PRESENT'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {record.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(record.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setEditAttendanceModal(record)}
                                                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-semibold"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteAttendanceId(record.id)}
                                                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Student Modal */}
            {editStudentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Student</h3>
                        <form onSubmit={handleUpdateStudent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editStudentModal.name}
                                    onChange={(e) => setEditStudentModal({ ...editStudentModal, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editStudentModal.email}
                                    onChange={(e) => setEditStudentModal({ ...editStudentModal, email: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Roll Number</label>
                                <input
                                    type="text"
                                    value={editStudentModal.rollNumber}
                                    onChange={(e) => setEditStudentModal({ ...editStudentModal, rollNumber: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditStudentModal(null)}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Student Confirmation */}
            {deleteStudentId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Delete Student</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this student? This will also delete their user account and attendance records.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteStudent}
                                disabled={loading}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteStudentId(null)}
                                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Attendance Modal */}
            {editAttendanceModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Attendance</h3>
                        <form onSubmit={handleUpdateAttendance} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Student</label>
                                <input
                                    type="text"
                                    value={editAttendanceModal.student.name}
                                    disabled
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={editAttendanceModal.subject.name}
                                    disabled
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={editAttendanceModal.date.split('T')[0]}
                                    onChange={(e) => setEditAttendanceModal({ ...editAttendanceModal, date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Status</label>
                                <div className="flex gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="PRESENT"
                                            checked={editAttendanceModal.status === 'PRESENT'}
                                            onChange={(e) => setEditAttendanceModal({ ...editAttendanceModal, status: e.target.value as 'PRESENT' | 'ABSENT' })}
                                            className="sr-only"
                                        />
                                        <div className={`p-3 rounded-xl border-2 text-center font-bold transition-all ${editAttendanceModal.status === 'PRESENT'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 text-gray-600'
                                            }`}>
                                            Present
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="ABSENT"
                                            checked={editAttendanceModal.status === 'ABSENT'}
                                            onChange={(e) => setEditAttendanceModal({ ...editAttendanceModal, status: e.target.value as 'PRESENT' | 'ABSENT' })}
                                            className="sr-only"
                                        />
                                        <div className={`p-3 rounded-xl border-2 text-center font-bold transition-all ${editAttendanceModal.status === 'ABSENT'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 text-gray-600'
                                            }`}>
                                            Absent
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditAttendanceModal(null)}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Attendance Confirmation */}
            {deleteAttendanceId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Delete Attendance</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this attendance record?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAttendance}
                                disabled={loading}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteAttendanceId(null)}
                                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AttendanceMarker({ students, subjects }: { students: Student[]; subjects: Subject[] }) {
    const [formData, setFormData] = useState({
        studentId: '',
        subjectId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'PRESENT',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.post('/admin/attendance', formData);
            setMessage('success');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('error');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-3xl mx-auto">
            <div className="bg-indigo-50 p-8 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
                        <Calendar className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">Mark Attendance</h2>
                        <p className="text-gray-600 font-medium">Record student attendance</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Student</label>
                    <select
                        required
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 bg-white"
                    >
                        <option value="" className="text-gray-400">Select a student</option>
                        {students.map((s) => (
                            <option key={s.id} value={s.id} className="text-gray-900">
                                {s.name} ({s.rollNumber})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                    <select
                        required
                        value={formData.subjectId}
                        onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 bg-white"
                    >
                        <option value="" className="text-gray-400">Select a subject</option>
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id} className="text-gray-900">
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                    <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Status</label>
                    <div className="flex gap-4">
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="PRESENT"
                                checked={formData.status === 'PRESENT'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="sr-only"
                            />
                            <div
                                className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${formData.status === 'PRESENT'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-600 hover:border-green-300'
                                    }`}
                            >
                                <Check className="h-6 w-6 mx-auto mb-1" />
                                Present
                            </div>
                        </label>
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="ABSENT"
                                checked={formData.status === 'ABSENT'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="sr-only"
                            />
                            <div
                                className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${formData.status === 'ABSENT'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-200 text-gray-600 hover:border-red-300'
                                    }`}
                            >
                                <X className="h-6 w-6 mx-auto mb-1" />
                                Absent
                            </div>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Attendance'}
                </button>

                {message && (
                    <div
                        className={`p-4 rounded-xl text-center font-semibold ${message === 'success'
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : 'bg-red-100 text-red-700 border-2 border-red-300'
                            }`}
                    >
                        {message === 'success' ? '✓ Attendance marked successfully!' : '✗ Failed to mark attendance'}
                    </div>
                )}
            </form>
        </div>
    );
}
