import { useState, useRef } from 'react';
import { addEmployee, updateEmployee } from '../../services/employeeService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EmployeeForm({ employeeData, onSuccess }) {
  const [formData, setFormData] = useState(employeeData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Employee',
    department: 'Engineering',
    profileImage: ''
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create storage reference
      const storageRef = ref(storage, `profile-images/${Date.now()}_${file.name}`);
      
      // Upload file
      const uploadTask = uploadBytes(storageRef, file);
      
      // Get download URL after upload completes
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setFormData({...formData, profileImage: downloadURL});
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeePayload = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        // Add any other computed fields here
      };

      if (employeeData?.id) {
        await updateEmployee(employeeData.id, employeePayload);
      } else {
        await addEmployee(employeePayload);
      }
      onSuccess();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Profile Image</label>
        <div className="flex items-center space-x-4">
          {formData.profileImage ? (
            <img 
              src={formData.profileImage} 
              alt="Profile preview" 
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
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
        label="Email Address"
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
      />

      {/* Role and Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Role</label>
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
            <option value="Executive">Executive</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Department</label>
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

      <Button type="submit" className="w-full">
        {employeeData?.id ? 'Update Employee' : 'Add Employee'}
      </Button>
    </form>
  );
}