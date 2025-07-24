import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee, updateEmployee } from '../../services/employeeService';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EmployeeForm({ employeeData, onSuccess }) {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState(employeeData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Employee',
    department: 'Engineering',
    profileImage: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        setErrors({...errors, profileImage: 'Please select an image file (JPEG/PNG)'});
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        setErrors({...errors, profileImage: 'Image must be smaller than 5MB'});
        return;
    }

    setIsUploading(true);
    const form = new FormData();
    form.append('image', file);

    try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          { method: 'POST', body: form }
        );
        
        if (!response.ok) throw new Error('Upload failed');
        
        const json = await response.json();
        if (!json.data?.url) throw new Error('No URL returned');
        
        setFormData({...formData, profileImage: json.data.url});
    } catch (error) {
        console.error("Image upload failed:", error);
        setErrors({...errors, profileImage: `Upload failed: ${error.message}`});
    } finally {
        setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    
    // Validate required fields
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!employeeData?.id && !formData.profileImage) {
      newErrors.profileImage = 'Profile image is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        createdAt: employeeData?.createdAt || new Date(),
        updatedAt: new Date()
      };

      if (employeeData?.id) {
        await updateEmployee(employeeData.id, payload);
      } else {
        await addEmployee(payload);
      }

      // Check if onSuccess is provided before calling it
      if (typeof onSuccess === 'function') {
        onSuccess();
      } else {
        navigate('/employees'); // Default navigation if onSuccess not provided
      }
    } catch (error) {
      console.error("Failed to save employee:", error);
      setErrors({...errors, form: `Failed to save employee: ${error.message}`});
    }
  };

  const handleCancel = () => {
    // If onSuccess is provided, use it (for cases where parent handles navigation)
    // Otherwise, use navigate to go to the employee list
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/employees'); // Adjust this path to match your route
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Profile Image
          {!employeeData?.id && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center space-x-4">
          {formData.profileImage ? (
            <img 
              src={formData.profileImage} 
              alt="Profile preview" 
              className="h-16 w-16 rounded-full object-cover border"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No image</span>
            </div>
          )}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="bg-blue-100 hover:bg-blue-700 text-gray-800"
            >
              {isUploading ? 'Uploading...' : 'Choose Image'}
            </Button>
            {errors.profileImage && (
              <p className="text-xs text-red-500 mt-1">{errors.profileImage}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Max 5MB (JPEG/PNG)</p>
          </div>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          error={errors.firstName}
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          required
        />
      </div>

      {/* Contact Information */}
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        pattern="[0-9]{10}"
        title="10-digit phone number"
      />

      {/* Role and Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button 
          type="submit" 
          disabled={isUploading}
          className="w-full py-2"
        >
          {isUploading ? 'Processing...' : employeeData?.id ? 'Update Employee' : 'Add Employee'}
        </Button>
        <Button 
          type="button" 
          onClick={handleCancel}
          className="w-full py-2 bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}