import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loader from '../../components/ui/Loader';

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showLinksForm, setShowLinksForm] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    phone: ''
  });
  const [links, setLinks] = useState({
    linkedIn: '',
    github: '',
    portfolio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setFormData({
              displayName: data.displayName || '',
              bio: data.bio || '',
              phone: data.phone || ''
            });
            setLinks(data.links || {
              linkedIn: '',
              github: '',
              portfolio: ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinksChange = (e) => {
    const { name, value } = e.target;
    setLinks(prev => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const saveProfile = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        bio: formData.bio,
        phone: formData.phone,
        updatedAt: new Date()
      });
      setProfile(prev => ({ ...prev, ...formData }));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const saveLinks = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        links: links,
        updatedAt: new Date()
      });
      setProfile(prev => ({ ...prev, links }));
      setShowLinksForm(false);
    } catch (error) {
      console.error('Error updating links:', error);
    }
  };

  if (loading) return <Loader />;
  if (!user) return <div className="p-4">Please sign in to view your profile</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            {/* Profile Image */}
            <div className="md:w-1/3 p-6 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <span className="text-4xl">{user.email?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {editMode ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Info */}
            <div className="md:w-2/3 p-6">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Display Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <button
                    onClick={saveProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-2">
                    {profile?.displayName || user.displayName || 'Your Profile'}
                  </h1>
                  <p className="text-gray-600 mb-4">{profile?.bio || 'No bio yet'}</p>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    {profile?.phone && (
                      <p className="text-gray-700">
                        <span className="font-medium">Phone:</span> {profile.phone}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Social Links</h2>
            <button 
              onClick={() => setShowLinksForm(!showLinksForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {showLinksForm ? 'Cancel' : profile?.links ? 'Edit Links' : 'Add Links'}
            </button>
          </div>

          {showLinksForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedIn"
                  value={links.linkedIn}
                  onChange={handleLinksChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">GitHub URL</label>
                <input
                  type="url"
                  name="github"
                  value={links.github}
                  onChange={handleLinksChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Portfolio URL</label>
                <input
                  type="url"
                  name="portfolio"
                  value={links.portfolio}
                  onChange={handleLinksChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <button
                onClick={saveLinks}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Save Links
              </button>
            </div>
          ) : (
            <div className="flex space-x-6">
              {profile?.links?.linkedIn && (
                <a 
                  href={profile.links.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </div>
                </a>
              )}
              {profile?.links?.github && (
                <a 
                  href={profile.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-black transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </div>
                </a>
              )}
              {profile?.links?.portfolio && (
                <a 
                  href={profile.links.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16zm-3 6v2h2v-2h-2z"/>
                    </svg>
                    <span>Portfolio</span>
                  </div>
                </a>
              )}
              {!profile?.links?.linkedIn && !profile?.links?.github && !profile?.links?.portfolio && (
                <p className="text-gray-500">No social links added yet</p>
              )}
            </div>
          )}
        </div>

        {/* Account Info Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Account Created:</span> {user.metadata.creationTime}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Last Login:</span> {user.metadata.lastSignInTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}