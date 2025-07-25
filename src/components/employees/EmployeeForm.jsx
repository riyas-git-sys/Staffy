import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee, updateEmployee } from '../../services/employeeService';
import { serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';

export default function EmployeeForm({ employeeData, onSuccess }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState(employeeData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Software Engineer',
    department: 'Information Technology(IT)',
    profileImage: '',
    hireDate: '',
    salary: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, loadingAuth, errorAuth] = useAuthState(auth); 

  // Show animation on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Handle authentication state
  useEffect(() => {
    if (loadingAuth) return; // Still loading
    
    if (errorAuth) {
      console.error('Authentication error:', errorAuth);
      navigate('/login');
      return;
    }
    
    if (!user) {
      navigate('/login');
    }
  }, [loadingAuth, errorAuth, user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    if (formData.salary && (isNaN(formData.salary) || parseFloat(formData.salary) < 0)) {
      newErrors.salary = 'Salary must be a valid positive number';
    }
    if (!employeeData?.id && !formData.profileImage) {
      newErrors.profileImage = 'Profile image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, profileImage: 'Please select an image file (JPEG/PNG)' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImage: 'Image size must be less than 5MB' }));
      return;
    }

    setIsUploading(true);
    setErrors(prev => ({ ...prev, profileImage: null }));
    
    try {
      const form = new FormData();
      form.append('image', file);
      
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        { method: 'POST', body: form }
      );
      
      if (!response.ok) throw new Error('Upload failed');
      
      const json = await response.json();
      if (!json.data?.url) throw new Error('No URL returned');
      
      setFormData(prev => ({ ...prev, profileImage: json.data.url }));
    } catch (error) {
      console.error("Image upload failed:", error);
      setErrors(prev => ({ ...prev, profileImage: `Upload failed: ${error.message}` }));
    } finally {
      setIsUploading(false);
    }
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
    
    if (!validateForm()) return;

    // Ensure user is authenticated and has uid
    if (!user?.uid) {
      setErrors({ submit: 'Authentication required. Please login again.' });
      navigate('/login');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        department: formData.department,
        status: formData.status,
        profileImage: formData.profileImage || null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        hireDate: formData.hireDate || null,
        updatedAt: serverTimestamp(),
        ...(employeeData?.id ? {} : {
          createdAt: serverTimestamp(),
          createdBy: {
            uid: user.uid,
            name: user.displayName || `${formData.firstName} ${formData.lastName}`,
            email: user.email || 'unknown@email.com'
          }
        })
      };

      if (employeeData?.id) {
        await updateEmployee(employeeData.id, payload);
      } else {
        await addEmployee(payload, user);
      }

      onSuccess?.() || navigate('/employees');
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: error.message || 'Failed to save employee' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/employees');
    }
  };

  // Loading and authentication states
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <p className="text-lg font-medium mb-4">Authentication required</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`transform transition-all duration-1000 ${
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

          {/* Profile Image Upload */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Profile Image
              {!employeeData?.id && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative group">
                {formData.profileImage ? (
                  <img 
                    src={formData.profileImage} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-xl">
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isUploading}
                  className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
                </button>
                {errors.profileImage && (
                  <p className="text-red-500 text-sm mt-2 animate-pulse">{errors.profileImage}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* First Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                  errors.firstName ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                  errors.lastName ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.lastName}</p>
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

            {/* Role */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 bg-white"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Data Scientist/Analyst">Data Scientist/Analyst</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
                <option value="Customer Service Manager">Customer Service Manager</option>
                <option value="Financial Analyst">Financial Analyst</option>
                <option value="HR Business Partner">HR Business Partner</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Project Manager">Project Manager</option>
              </select>
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
                <option value="Information Technology(IT)">Information Technology (IT)</option>
                <option value="Information Technology(IT) / R&D">Information Technology (IT) / R&D</option>
                <option value="Sales & Business Development">Sales & Business Development</option>
                <option value="Engineering / R&D">Engineering / R&D</option>
                <option value="Marketing">Marketing</option>
                <option value="Customer Service/Support">Customer Service/Support</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Human Resources (HR)">Human Resources (HR)</option>
                <option value="Operations">Operations</option>
                <option value="Project Management">Project Management</option>
                <option value="Product Management">Product Management</option>
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
              <p className="text-gray-500 text-sm mt-1">Enter annual salary amount</p>
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

            {/* Status - Full width */}
            <div className="group md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 bg-white max-w-md"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="group flex items-center space-x-2 px-4 py-3 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={loading || isUploading}
              className={`group flex items-center space-x-1 px-4 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed ${
                employeeData?.id 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{employeeData?.id ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d={employeeData?.id ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}></path>
                  </svg>
                  <span>{employeeData?.id ? 'Update Employee' : 'Add Employee'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}