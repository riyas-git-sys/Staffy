import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from '../../config/firebase';
import Loader from '../../components/ui/Loader';
import { auth } from '../../config/firebase';
import { IoPerson } from 'react-icons/io5';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [links, setLinks] = useState({
    linkedIn: '',
    github: '',
    website: ''
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log('Fetching employee with ID:', id); // Debug log
        const docRef = doc(db, 'employees', id);
        const docSnap = await getDoc(docRef);

        console.log('Document exists:', docSnap.exists()); // Debug log
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Employee data:', data); // Debug log
          setEmployee({
            id: docSnap.id,
            ...data,
            links: data.links || {
              linkedIn: '',
              github: '',
              website: ''
            }
          });
          setLinks(data.links || {
            linkedIn: '',
            github: '',
            website: ''
          });
        } else {
          console.log('Document does not exist'); // Debug log
          navigate('/employees');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
      return false;
    }
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveLinks = async () => {
    try {
      const employeeRef = doc(db, 'employees', id);
      await updateDoc(employeeRef, {
        links: links
      });
      setEmployee(prev => ({
        ...prev,
        links: links
      }));
      setShowLinkForm(false);
    } catch (error) {
      console.error('Error updating links:', error);
    }
  };

  const deleteEmployee = async () => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      navigate('/employees');
    } catch (error) {
      if (error.code === 'permission-denied') {
        alert('You do not have permission to delete this employee');
      }
    }
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Loader />
    </div>
  );

  if (!employee) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Employee Not Found</h2>
        <p className="text-gray-600">The employee you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 transition-all duration-700">
      {/* Company Header Card */}
      <div className={`w-xl max-w-xl mx-auto mb-8 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -right-4 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -bottom-2 left-1/3 w-4 h-4 bg-white/15 rounded-full animate-ping delay-700"></div>
          </div>

          {/* Active Status Indicator */}
          <div className="absolute bottom-4 left-4 transform transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg transition-all duration-300 ${
              employee.status === 'Active' 
                ? 'bg-green-500/90 text-white shadow-green-500/25' 
                : employee.status === 'On Leave' 
                  ? 'bg-yellow-500/90 text-white shadow-yellow-500/25'
                  : 'bg-red-500/90 text-white shadow-red-500/25'
            }`}>
              <span className="relative flex h-3 w-3 mr-2">
                {employee.status === 'Active' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </>
                )}
              </span>
              {employee.status}
            </span>
          </div>

          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="ml-2">
                <img
                  src="https://i.ibb.co/8D1k2WQY/staffylogo-removebg-preview.png"
                  alt="Staffy-logo"
                  className="h-14 w-auto"
                />
              </div>
              {/* Logo */}    
              <div className="transform transition-transform duration-300 hover:scale-110 hover:rotate-6">
                <img 
                  src="https://i.ibb.co/C3r84TzZ/emplogo.png" 
                  alt="Staffy-logo" 
                  className="h-8 w-auto filter drop-shadow-lg"
                />
              </div>
            </div>
            
            {/* Employee Info */}
            <div className="flex items-center space-x-8 mb-6">
              {/* Profile Image */}
              <div className="relative group/image">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:border-white/50">
                  {employee.profileImage ? (
                    <img 
                      src={employee.profileImage} 
                      alt={`${employee.firstName} ${employee.lastName}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-lg font-medium">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📸</div>
                        Please Upload Photo
                      </div>
                    </div>
                  )}
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
              
              {/* Employee Details */}
              <div className="text-white flex-1">
                <h2 className="text-4xl font-bold mb-2 tracking-wide transform transition-all duration-500 hover:scale-105">
                  {employee.firstName} {employee.lastName}
                </h2>
                <div className="space-y-2 text-lg">
                  <p className="text-white/90 font-medium">{employee.role}</p>
                  <p className="text-white/80">{employee.department}</p>
                  <span className="text-sm">Employee ID:</span> <br />
                  <span className="font-mono bg-white/20 ml-2 mt-2 px-3 py-1 rounded-lg backdrop-blur-sm">
                    {employee.id}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-end space-x-6">
              {employee.links?.linkedIn && (
                <a 
                  href={employee.links.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:drop-shadow-lg"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {employee.links?.github && (
                <a 
                  href={employee.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:drop-shadow-lg"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {employee.links?.website && (
                <a 
                  href={employee.links.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:drop-shadow-lg"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16zm-3 6v2h2v-2h-2z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Detail Card */}
      <div className={`max-w-5xl mx-auto transform transition-all duration-1000 delay-200 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-transparent to-blue-800/50"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-blue-100 text-lg">{employee.role}</p>
              </div>
              {(user?.uid === employee.createdBy?.uid || user?.token?.isAdmin) && (
                <button 
                  onClick={() => navigate(`/employees/edit/${employee.id}`)}
                  className="group px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:bg-blue-50"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>Edit Profile</span>
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Profile Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-center mb-6">
                      <div className="relative inline-block mb-4">
                        {employee.profileImage ? (
                          <img
                            src={employee.profileImage}
                            alt={`${employee.firstName} ${employee.lastName}`}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 border-4 border-white shadow-xl">
                            <div className="text-center">
                              <div className="text-2xl mb-1">👤</div>
                              <div className="text-xs">No Photo</div>
                            </div>
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shadow-lg ${
                            employee.status === 'Active' 
                              ? 'bg-green-500 text-white' 
                              : employee.status === 'On Leave' 
                                ? 'bg-yellow-500 text-white' 
                                : 'bg-red-500 text-white'
                          }`}>
                            {employee.status === 'Active' && '✓'}
                            {employee.status === 'On Leave' && '〰'}
                            {employee.status === 'Inactive' && '✕'}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-gray-600 mb-3">{employee.department}</p>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                        employee.status === 'Active' 
                          ? 'bg-green-100 text-green-800 shadow-green-100' 
                          : employee.status === 'On Leave' 
                            ? 'bg-yellow-100 text-yellow-800 shadow-yellow-100' 
                            : 'bg-red-100 text-red-800 shadow-red-100'
                      }`}>
                        {employee.status}
                      </span>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <p className="text-sm text-gray-500 mb-1">Employee ID</p>
                        <p className="font-bold text-gray-800 font-mono">{employee.id}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <p className="text-sm text-gray-500 mb-1">Hire Date</p>
                        <p className="font-bold text-gray-800">
                          {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'First Name', value: employee.firstName },
                      { label: 'Last Name', value: employee.lastName },
                      { label: 'Email', value: employee.email },
                      { label: 'Phone', value: employee.phone || 'Not specified' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                        <p className="font-semibold text-gray-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg border border-purple-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                      </svg>
                    </div>
                    Employment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Department', value: employee.department },
                      { label: 'Role', value: employee.role },
                      { label: 'Salary', value: employee.salary ? `$${employee.salary}` : 'Not specified' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                        <p className="font-semibold text-gray-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links Form */}
                {showLinkForm && (
                  <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-lg border border-green-100 transform transition-all duration-500 scale-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                        </svg>
                      </div>
                      Add Social Links
                    </h3>
                    <div className="space-y-6">
                      {[
                        { name: 'linkedIn', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username', validation: (val) => val.includes('linkedin.com') },
                        { name: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username', validation: (val) => val.includes('github.com') },
                        { name: 'website', label: 'Website URL', placeholder: 'https://yourportfolio.com', validation: isValidUrl }
                      ].map((field) => (
                        <div key={field.name} className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                          <input
                            type="url"
                            name={field.name}
                            value={links[field.name]}
                            onChange={handleLinkChange}
                            className={`w-full p-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 ${
                              links[field.name] && !field.validation(links[field.name])
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                                : 'border-gray-200 focus:border-green-500 focus:ring-green-100 hover:border-gray-300'
                            }`}
                            placeholder={field.placeholder}
                          />
                          {links[field.name] && !field.validation(links[field.name]) && (
                            <p className="text-red-500 text-sm mt-2 animate-pulse">Please enter a valid {field.label.toLowerCase()}</p>
                          )}
                        </div>
                      ))}
                      <div className="flex space-x-4 pt-4">
                        <button
                          onClick={saveLinks}
                          disabled={
                            (links.linkedIn && !links.linkedIn.includes('linkedin.com')) ||
                            (links.github && !links.github.includes('github.com')) ||
                            (links.website && !isValidUrl(links.website))
                          }
                          className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            (links.linkedIn && !links.linkedIn.includes('linkedin.com')) ||
                            (links.github && !links.github.includes('github.com')) ||
                            (links.website && !isValidUrl(links.website))
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl hover:-translate-y-1'
                          }`}
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Save Links</span>
                          </span>
                        </button>
                        <button
                          onClick={() => setShowLinkForm(false)}
                          className="flex-1 py-4 px-6 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Links Display */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                      </svg>
                    </div>
                    Social Links
                  </h3>
                  
                  {(employee.links?.linkedIn || employee.links?.github || employee.links?.website) ? (
                    <div className="flex justify-start space-x-6 mb-6">
                      {employee.links?.linkedIn && (
                        <a 
                          href={employee.links.linkedIn} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group relative p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                          </svg>
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                        </a>
                      )}
                      {employee.links?.github && (
                        <a 
                          href={employee.links.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group relative p-3 bg-gray-800 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                        </a>
                      )}
                      {employee.links?.website && (
                        <a 
                          href={employee.links.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group relative p-3 bg-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16zm-3 6v2h2v-2h-2z"/>
                          </svg>
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🔗</div>
                      <p>No social links added yet</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end flex-wrap gap-4">
                    {/* Only show Add Links button to creator or admin */}
                    {(user?.uid === employee.createdBy?.uid || user?.token?.isAdmin) && (
                      <button 
                        onClick={() => setShowLinkForm(true)}
                        className="group flex items-center space-x-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                      >
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span>Add Links</span>
                      </button>
                    )}
                    
                    <button 
                      onClick={() => navigate('/employees')}
                      className="group flex items-center space-x-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                      </svg>
                      <span>View All Employees</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-8 py-6 border-t border-gray-200">
            {/*Creator Name Data*/}
            {employee.createdBy && (
              <div className="bg-white p-6 px-4 mb-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                <p className="text-sm text-gray-500 mb-1">Added By</p>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <IoPerson className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{employee.createdBy.name}</p>
                    <p className="text-xs text-gray-500">{employee.createdBy.email}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <p className="text-gray-600 font-semibold">STAFFY</p>
              </div>
              <p className="text-sm text-gray-500 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Updated At: {employee.updatedAt ? new Date(employee.updatedAt.toDate()).toLocaleString() : 'Unknown'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className={`max-w-3xl mx-auto mt-8 flex justify-end transform transition-all duration-1000 delay-400 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        {(user?.uid === employee.createdBy?.uid || user?.token?.isAdmin) && (
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="group flex items-center space-x-2 px-2 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-104 hover:-translate-y-1 border-2 border-red-500 hover:border-red-400"
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span>Delete Employee</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-3xl max-w-md w-full p-8 transform animate-scale-in border-2 border-red-100">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg className="w-8 h-8 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-gray-900">
                  {employee.firstName} {employee.lastName}'s
                </span>{' '}
                profile? This action cannot be undone.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  deleteEmployee();
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}