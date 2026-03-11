import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { X, Save } from 'lucide-react';

export default function EmployeeModal({ isOpen, onClose, employee }) {
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        salary: '',
        date_of_joining: '',
        place: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                designation: employee.designation || '',
                salary: employee.salary || '',
                date_of_joining: employee.date_of_joining || '',
                place: employee.place || ''
            });
        } else {
            setFormData({
                name: '',
                designation: '',
                salary: '',
                date_of_joining: '',
                place: ''
            });
        }
    }, [employee]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                salary: Number(formData.salary),
                adminId: auth.currentUser.uid,
                updatedAt: new Date().toISOString()
            };

            if (employee) {
                // Update existing
                await updateDoc(doc(db, 'employees', employee.id), payload);
            } else {
                // Add new
                payload.createdAt = new Date().toISOString();
                await addDoc(collection(db, 'employees'), payload);
            }
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to save employee data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel animate-fade">
                <div className="modal-header">
                    <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-group">
                        <label>Employee Name</label>
                        <input
                            name="name"
                            required
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Designation</label>
                            <input
                                name="designation"
                                required
                                placeholder="e.g. Software Engineer"
                                value={formData.designation}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Salary (₹)</label>
                            <input
                                type="number"
                                name="salary"
                                required
                                min="0"
                                placeholder="e.g. 50000"
                                value={formData.salary}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Date of Joining</label>
                            <input
                                type="date"
                                name="date_of_joining"
                                required
                                value={formData.date_of_joining}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Place / City</label>
                            <input
                                name="place"
                                required
                                placeholder="e.g. Mumbai"
                                value={formData.place}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
