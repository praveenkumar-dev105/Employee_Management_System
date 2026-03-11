import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { LogOut, Users, Plus, LayoutDashboard } from 'lucide-react';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import '../App.css';

export default function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, 'employees'),
            where('adminId', '==', auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const emps = [];
            snapshot.forEach((doc) => {
                emps.push({ id: doc.id, ...doc.data() });
            });
            setEmployees(emps);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const openAddModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <LayoutDashboard className="sidebar-icon" />
                    <h2>AdminPanel</h2>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item active">
                        <Users size={20} />
                        <span>Employees</span>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-email">{auth.currentUser?.email}</div>
                    <button onClick={handleLogout} className="btn-danger logout-btn">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar">
                    <div>
                        <h1>Employee Management</h1>
                        <p className="subtitle">Manage your staff details effectively</p>
                    </div>
                    <button className="btn-primary" onClick={openAddModal}>
                        <Plus size={20} />
                        Add Employee
                    </button>
                </header>

                <section className="content-area">
                    <div className="content-card glass-panel">
                        <EmployeeTable employees={employees} onEdit={openEditModal} />
                    </div>
                </section>
            </main>

            {isModalOpen && (
                <EmployeeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    employee={editingEmployee}
                />
            )}
        </div>
    );
}
