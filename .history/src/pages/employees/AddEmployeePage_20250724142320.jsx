import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'Engineering',
    email: '',
    phone: '',
    hireDate: '',
    salary: '',
    status: 'Active',
    profileImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation on mount
  useState(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    if (formData.salary && (isNaN(formData.salary) || parseFloat(formData.salary) < 0)) {
      newErrors.salary = 'Salary must be a valid positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'employees'), {
        ...formData,
        fullName: formData.name,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      navigate('/employees', { state: { refresh: true } });
    } catch (error) {
      console.error('Error adding employee:', error);
      setErrors({ submit: 'Failed to add employee. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 transition-all duration-700">
      {/* Header */}
      <div className={`max-w-4xl mx-auto mb-8 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Add New Employee
                </h1>
                <p className="text-gray-600 mt-1">Enter new employee information and profile details</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/employees')}
              className="group flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:bg-gray-100 rounded-xl"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Back to List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className={`max-w-4xl mx-auto transform transition-all duration-1000 delay-200 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-red-700 font-medium">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                    errors.name ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.name}</p>
                )}
              </div>

              {/* Position */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                    errors.position ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter position"
                />
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.position}</p>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                    errors.email ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                    errors.phone ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.phone}</p>
                )}
              </div>

              {/* Department */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 bg-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="HR">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              {/* Status */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              {/* Salary */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Salary (LPA)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className={`w-full pl-8 pr-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                      errors.salary ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                    }`}
                    placeholder="600000"
                  />
                </div>
                {errors.salary && (
                  <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.salary}</p>
                )}
              </div>

              {/* Hire Date */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hire Date</label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/employees')}
                className="group flex items-center space-x-2 px-8 py-4 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Save Employee</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}