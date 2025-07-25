import { useState, useEffect } from 'react';
import { 
  IoAdd, 
  IoClose, 
  IoPerson, 
  IoTime, 
  IoFlag, 
  IoCreate,
  IoAlertCircle,
  IoAlert,
  IoCheckmarkCircle,
  IoCalendar,
  IoBusiness,
  IoTrash,
  IoPencil
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
  updateDoc,
  writeBatch,
  arrayUnion
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium'
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [user] = useAuthState(auth);

  // Fetch announcements from Firebase
  useEffect(() => {
    const q = query(
      collection(db, 'announcements'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const announcementsData = [];
        querySnapshot.forEach((doc) => {
          announcementsData.push({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
          });
        });
        setAnnouncements(announcementsData);
      },
      (error) => {
        console.error('Announcements listener error:', error);
        alert('Error loading announcements: ' + error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Mark announcements as read when page loads
  useEffect(() => {
    if (!user || announcements.length === 0) return;

    const markAsRead = async () => {
      const batch = writeBatch(db);
      
      announcements.forEach(ann => {
        if (!ann.readBy?.includes(user.uid)) {
          const annRef = doc(db, 'announcements', ann.id);
          batch.update(annRef, {
            readBy: arrayUnion(user.uid)
          });
        }
      });

      try {
        await batch.commit();
      } catch (error) {
        console.error('Error marking announcements as read:', error);
      }
    };

    markAsRead();
  }, [user, announcements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
        alert('Please fill in all fields');
        return;
      }

      if (!user) {
        alert('You must be logged in to post announcements');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      const announcementData = {
        title: newAnnouncement.title.trim(),
        content: newAnnouncement.content.trim(),
        priority: newAnnouncement.priority,
        author: {
          uid: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email,
          role: userData?.role || 'Employee',
          department: userData?.department || 'General'
        },
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, 'announcements', editingId), announcementData);
        alert('Announcement updated successfully');
      } else {
        announcementData.createdAt = new Date().toISOString();
        announcementData.readBy = [];
        await addDoc(collection(db, 'announcements'), announcementData);
        alert('Announcement posted successfully');
      }

      setNewAnnouncement({ title: '', content: '', priority: 'medium' });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Operation failed: ' + error.message);
    }
  };

  const handleDelete = async (announcementId) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteDoc(doc(db, 'announcements', announcementId));
        alert('Announcement deleted successfully');
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement: ' + error.message);
        if (error.code === 'permission-denied') {
          alert('You do not have permission to delete this announcement');
        }
      }
    }
  };

  const handleEdit = (announcement) => {
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'No date';
    try {
      const date = typeof dateValue === 'string' 
        ? new Date(dateValue) 
        : dateValue.toDate?.() || dateValue;
      return date.toLocaleString();
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <IoAlertCircle className="w-4 h-4" />;
      case 'medium': return <IoAlert className="w-4 h-4" />;
      case 'low': return <IoCheckmarkCircle className="w-4 h-4" />;
      default: return <IoFlag className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg">
            <IoCreate className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Announcements
          </h1>
        </div>
        {user && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <IoAdd className="w-5 h-5" />
            <span>New Announcement</span>
          </button>
        )}
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-slide-down">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Announcement' : 'Create Announcement'}
            </h2>
            <button onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setNewAnnouncement({ title: '', content: '', priority: 'medium' });
            }}>
              <IoClose className="w-6 h-6 text-gray-500 hover:text-red-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                placeholder="Announcement title..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                placeholder="Announcement details..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                name="priority"
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              {editingId ? 'Update Announcement' : 'Post Announcement'}
            </button>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements.map((announcement, index) => {
          const isCurrentUserAuthor = user?.uid === announcement.author?.uid;
          const priorityColors = {
            high: { 
              border: 'border-red-500', 
              bg: 'bg-gradient-to-br from-red-50 to-red-100', 
              text: 'text-red-600',
              shadow: 'shadow-red-200'
            },
            medium: { 
              border: 'border-yellow-500', 
              bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100', 
              text: 'text-yellow-600',
              shadow: 'shadow-yellow-200'
            },
            low: { 
              border: 'border-green-500', 
              bg: 'bg-gradient-to-br from-green-50 to-green-100', 
              text: 'text-green-600',
              shadow: 'shadow-green-200'
            }
          };
          const priorityStyle = priorityColors[announcement.priority] || priorityColors.medium;

          return (
            <div 
              key={announcement.id} 
              className={`group relative p-6 rounded-xl shadow-md border-l-4 ${priorityStyle.border} ${priorityStyle.bg} hover:shadow-lg transition-all ${
                isCurrentUserAuthor ? 'ml-auto w-5/6' : 'mr-auto w-5/6'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Priority Badge */}
              <div className="absolute -top-3 -right-3">
                <div className={`flex items-center gap-2 px-3 py-1 ${priorityStyle.text} bg-white rounded-full shadow-md border ${priorityStyle.border}`}>
                  {getPriorityIcon(announcement.priority)}
                  <span className="text-xs font-bold uppercase">
                    {announcement.priority}
                  </span>
                </div>
              </div>

              {/* Author Tag */}
              {isCurrentUserAuthor && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                    <IoPerson className="inline mr-1" /> You
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {announcement.title}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <IoCalendar className="w-4 h-4" />
                  <span>{formatDate(announcement.createdAt)}</span>
                </div>
              </div>

              {/* Author Info */}
              {announcement.author && (
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/70 rounded-lg p-2 mb-3">
                  <div className="flex items-center gap-1">
                    <IoPerson className="w-4 h-4 text-blue-500" />
                    <span>{announcement.author.name}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <IoFlag className="w-4 h-4 text-green-500" />
                    <span>{announcement.author.role}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <IoBusiness className="w-4 h-4 text-purple-500" />
                    <span>{announcement.author.department}</span>
                  </div>
                </div>
              )}

              {/* Content */}
              <p className="text-gray-700 mb-4 whitespace-pre-line bg-white/70 rounded-lg p-4">
                {announcement.content}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <IoTime className="w-4 h-4" />
                  <span>Updated: {formatDate(announcement.updatedAt)}</span>
                </div>
                
                {isCurrentUserAuthor && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleEdit(announcement)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all text-sm"
                    >
                      <IoPencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(announcement.id)}
                      className="flex items-center gap-1 px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all text-sm"
                    >
                      <IoTrash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}