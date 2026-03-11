import { Edit2, Trash2 } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function EmployeeTable({ employees, onEdit }) {
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteDoc(doc(db, 'employees', id));
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('Failed to delete employee.');
            }
        }
    };

    if (employees.length === 0) {
        return (
            <div className="empty-state">
                <p>No employees found. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Salary</th>
                        <th>Joining Date</th>
                        <th>Place</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id} className="animate-fade">
                            <td className="font-medium text-white">{emp.name}</td>
                            <td>
                                <span className="badge">{emp.designation}</span>
                            </td>
                            <td className="salary">₹{Number(emp.salary).toLocaleString()}</td>
                            <td>{new Date(emp.date_of_joining).toLocaleDateString()}</td>
                            <td>{emp.place}</td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => onEdit(emp)}
                                        title="Edit Employee"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(emp.id)}
                                        title="Delete Employee"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
