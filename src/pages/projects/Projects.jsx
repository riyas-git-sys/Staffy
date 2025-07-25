import { useState, useEffect } from 'react';
import { 
  IoClose, 
  IoFolder, 
  IoAdd, 
  IoCalendar,
  IoPerson,
  IoTime,
  IoLink,
  IoLogoGithub,
  IoCreate,
  IoTrash,
  IoCheckmarkCircle,
  IoPlay,
  IoPause,
  IoAlertCircle,
  IoFlag,
} from 'react-icons/io5';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDoc, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { FiFilter } from 'react-icons/fi';
import { db, auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    dueDate: '',
    projectLink: '',
    githubLink: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [user] = useAuthState(auth);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Status options for filter
  const statusOptions = ['All', 'Not Started', 'In Progress', 'On Hold', 'Completed'];

  // Fetch projects from Firebase
  useEffect(() => {
    const q = query(
      collection(db, 'projects'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const projectsData = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
            dueDate: doc.data().dueDate?.toDate?.() || doc.data().dueDate
          });
        });
        setProjects(projectsData);
        setFilteredProjects(projectsData);
      },
      (error) => {
        console.error('Projects listener error:', error);
        alert('Error loading projects: ' + error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Apply filter when statusFilter or projects change
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => project.status === statusFilter);
      setFilteredProjects(filtered);
    }
  }, [statusFilter, projects]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newProject.title.trim()) {
        alert('Please enter a project title');
        return;
      }

      if (!user) {
        alert('You must be logged in to create projects');
        return;
      }

      // Get the existing project data if editing
      let existingProject = {};
      if (editingId) {
        const projectDoc = await getDoc(doc(db, 'projects', editingId));
        existingProject = projectDoc.data();
      }

      // Prepare the project data
      const projectData = {
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        status: newProject.status,
        projectLink: newProject.projectLink.trim(),
        githubLink: newProject.githubLink.trim(),
        updatedAt: new Date().toISOString()
      };

      // Handle dueDate - convert to Timestamp if it exists
      if (newProject.dueDate) {
        projectData.dueDate = new Date(newProject.dueDate).toISOString();
      } else {
        projectData.dueDate = null;
      }

      if (editingId) {
        // For update, preserve the original createdBy and createdAt
        projectData.createdBy = existingProject.createdBy;
        projectData.createdAt = existingProject.createdAt;
        
        // Update existing project
        await updateDoc(doc(db, 'projects', editingId), projectData);
        alert('Project updated successfully');
      } else {
        // For new project, add creation data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        projectData.createdBy = {
          uid: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email,
          role: userData?.role || 'Team Member',
          department: userData?.department || 'General'
        };
        projectData.teamMembers = [user.uid];
        projectData.createdAt = new Date().toISOString();
        projectData.progress = 0;

        await addDoc(collection(db, 'projects'), projectData);
        alert('Project created successfully');
      }

      // Reset form
      setNewProject({ title: '', description: '', status: 'Not Started', dueDate: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Operation failed: ' + error.message);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        alert('Project deleted successfully');
      } catch (error) {
        console.error('Error:', error);
        if (error.code === 'permission-denied') {
          alert('You do not have permission to perform this action');
        } else {
          alert('Operation failed: ' + error.message);
        }
      }
    }
  };

  const handleEdit = (project) => {
    setNewProject({
      title: project.title,
      description: project.description,
      status: project.status,
      dueDate: project.dueDate 
        ? new Date(project.dueDate).toISOString().split('T')[0] 
        : '',
      projectLink: project.projectLink || '',
      githubLink: project.githubLink || ''
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'No date set';
    try {
      const date = typeof dateValue === 'string' 
        ? new Date(dateValue) 
        : dateValue.toDate?.() || dateValue;
      return date.toLocaleDateString();
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'In Progress': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'On Hold': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'Not Started': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
      default: return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <IoCheckmarkCircle className="w-4 h-4" />;
      case 'In Progress': return <IoPlay className="w-4 h-4" />;
      case 'On Hold': return <IoPause className="w-4 h-4" />;
      case 'Not Started': return <IoAlertCircle className="w-4 h-4" />;
      default: return <IoFlag className="w-4 h-4" />;
    }
  };

  const isOverdue = (dueDate, status) => {
    return dueDate && new Date(dueDate) < new Date() && status !== 'Completed';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg">
                <IoFolder className="w-8 h-8" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-gray-600 mt-1">Manage and track your projects.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`group ml-3 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  showFilters 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiFilter className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : 'group-hover:rotate-12'}`} />
              </button>
              
              {/* Filter Dropdown */}
              {showFilters && (
                <>
                  {/* Backdrop overlay */}
                  <div 
                    className="fixed inset-0 bg-transparent z-40"
                    onClick={() => setShowFilters(false)}
                  />
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full w-48 bg-white rounded-xl shadow-lg border border-gray-200 mt-3 py-3 px-4 z-50 animate-dropdown">
                    {statusOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setStatusFilter(option);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-1 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                          statusFilter === option ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        {getStatusIcon(option)}
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* New Project Button */}
            {user && (
              <button 
                onClick={() => setShowForm(true)}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <IoAdd className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold">New Project</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Display */}
        {statusFilter !== 'All' && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm text-gray-600">Showing:</span>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(statusFilter)} flex items-center gap-2`}>
              {getStatusIcon(statusFilter)}
              {statusFilter}
            </span>
            <button 
              onClick={() => setStatusFilter('All')}
              className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
            >
              <IoClose className="w-4 h-4" />
              Clear filter
            </button>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="mb-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 animate-slide-down">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl">
                  <IoCreate className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Project' : 'Create New Project'}
                </h2>
              </div>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setNewProject({ title: '', description: '', status: 'Not Started', projectLink: '', githubLink: '', dueDate: '' });
                }}
                className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  placeholder="Enter your project title..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 text-lg"
                  required
                />
              </div>

              {/* Description */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Describe your project goals and requirements..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                  rows="4"
                />
              </div>

              {/* Status and Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                  <select
                    name="status"
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newProject.dueDate}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      setNewProject({...newProject, dueDate: dateValue});
                    }}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Project Link</label>
                  <input
                    type="url"
                    name="projectLink"
                    value={newProject.projectLink}
                    onChange={(e) => setNewProject({...newProject, projectLink: e.target.value})}
                    placeholder="https://your-project.com"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">GitHub Repository</label>
                  <input
                    type="url"
                    name="githubLink"
                    value={newProject.githubLink}
                    onChange={(e) => setNewProject({...newProject, githubLink: e.target.value})}
                    placeholder="https://github.com/username/repo"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                {editingId ? 'Update Project' : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        {/* Projects Grid - Now using filteredProjects instead of projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/50 overflow-hidden transform hover:scale-1.5 transition-all duration-300 animate-fade-in ${showFilters ? 'mt-36' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project Header */}
              <div className="relative p-6 bg-gradient-to-br from-gray-50 to-blue-50">
                {isOverdue(project.dueDate, project.status) && (
                  <div className="absolute top-4 mt-14 mr-3 right-4 flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                    <IoAlertCircle className="w-3 h-3" />
                    OVERDUE
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-md">
                      <IoFolder className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                      {project.title}
                    </h3>
                  </div>
                  {/* Status Badge */}
                  <div className="flex justify-end mb-4">
                    <span className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full border ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>

                {/* Progress Bar */}
                {project.progress !== undefined && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-blue-600">
                        {project.status === 'Completed' ? '100%' : 
                        project.status === 'In Progress' ? '56%' : 
                        project.status === 'On Hold' ? '43%' : 
                        '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: project.status === 'Completed' ? '100%' : 
                                project.status === 'In Progress' ? '56%' : 
                                project.status === 'On Hold' ? '43%' : 
                                '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-white/60 rounded-lg">
                  <IoCalendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Due Date:</span>
                    <span className={`ml-2 font-bold ${isOverdue(project.dueDate, project.status) ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatDate(project.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3 mb-6">
                  {project.projectLink && (
                    <a 
                      href={project.projectLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                    >
                      <IoLink className="w-4 h-4" />
                      View Live
                    </a>
                  )}
                  {project.githubLink && (
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 text-sm"
                    >
                      <IoLogoGithub className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>

                {/* Creator Info */}
                {project.createdBy && (
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg mb-6">
                    <IoPerson className="w-5 h-5 text-green-500" />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">{project.createdBy.name}</span>
                      <span>•</span>
                      <span>{project.createdBy.department}</span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <IoTime className="w-4 h-4" />
                    <span>Updated: {formatDate(project.updatedAt)}</span>
                  </div>
                  {(user?.uid === project.createdBy?.uid || user?.token?.isAdmin) && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(project)}
                        className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 text-sm"
                      >
                        <IoCreate className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 text-sm"
                      >
                        <IoTrash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - Updated to check filteredProjects */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="p-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl max-w-md mx-auto">
              <IoFolder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                {statusFilter === 'All' ? 'No Projects Yet' : 'No Projects Found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {statusFilter === 'All' 
                  ? 'Create your first project to get started!' 
                  : `No projects match the "${statusFilter}" filter`}
              </p>
              {user && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-3 py-2 mr-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Create Project
                </button>
              )}
              {statusFilter !== 'All' && (
                <button 
                  onClick={() => setStatusFilter('All')}
                  className="mt-4 ml-4 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:scale-105"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes dropdown {
            from { 
              opacity: 0; 
              transform: translateY(-10px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          
          .animate-slide-down {
            animation: slide-down 0.4s ease-out forwards;
          }

          .animate-dropdown {
            animation: dropdown 0.2s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
}