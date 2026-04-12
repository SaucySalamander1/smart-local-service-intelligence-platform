import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkerById, updateWorkerProfile, uploadProfilePicture } from '../api/workers';
import { AuthContext } from '../context/AuthContext';
import CustomerNavBar from '../components/Navbars/CustomerNavbar';
import WorkerNavbar from '../components/Navbars/WorkerNavbar';
import Footer from '../components/Footer/Footer';
import ChatModal from '../components/ChatModal';

const WorkerProfile = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [worker, setWorker] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    skills: [],
    experience: 0,
    serviceArea: '',
    availability: 'offline',
    certifications: ''
  });

  const [skillInput, setSkillInput] = useState('');

  // Check if current user is the profile owner
  const isOwner = user?.id === workerId;

  // Fetch worker data
  useEffect(() => {
    const fetchWorker = async () => {
      try {
        setLoading(true);
        const data = await getWorkerById(workerId);
        setWorker(data.data);

        // Initialize form data
        setFormData({
          name: data.data.name || '',
          bio: data.data.bio || '',
          phone: data.data.phone || '',
          skills: data.data.skills || [],
          experience: data.data.experience || 0,
          serviceArea: data.data.serviceArea || '',
          availability: data.data.availability || 'offline',
          certifications: data.data.certifications || ''
        });

        setError(null);
      } catch (err) {
        setError('Failed to load worker profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [workerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) || 0 : value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Upload file if selected
      if (selectedFile) {
        const uploadResponse = await uploadProfilePicture(workerId, selectedFile);
        formData.profilePicture = uploadResponse.data.profilePicture;
        setWorker(prev => ({ ...prev, profilePicture: uploadResponse.data.profilePicture }));
        setSelectedFile(null);
        setPreviewUrl(null);
      }

      // Update profile
      await updateWorkerProfile(workerId, formData);
      setWorker({ ...worker, ...formData });
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactWorker = () => {
    if (worker.availability === 'unavailable' || worker.availability === 'busy') {
      setShowUnavailableModal(true);
    } else {
      setIsChatOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {user?.role === 'worker' ? <WorkerNavbar /> : <CustomerNavBar />}
        <div className="flex-grow flex justify-center items-center">
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        {user?.role === 'worker' ? <WorkerNavbar /> : <CustomerNavBar />}
        <div className="flex-grow flex justify-center items-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col">
        {user?.role === 'worker' ? <WorkerNavbar /> : <CustomerNavBar />}
        <div className="flex-grow flex justify-center items-center">
          <p className="text-gray-600 text-lg">Worker not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {user?.role === 'worker' ? <WorkerNavbar /> : <CustomerNavBar />}

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Worker Profile</h1>
            {isOwner && (
              <div className="flex gap-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className="md:col-span-1">
                {isOwner && isEditing ? (
                  <div>
                    {/* File Input for Edit Mode */}
                    <label className="block cursor-pointer">
                      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-cyan-500 transition">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : worker.profilePicture ? (
                          <img
                            src={worker.profilePicture}
                            alt={worker.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-gray-400">Click to upload</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    {selectedFile && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {worker.profilePicture ? (
                      <img
                        src={worker.profilePicture}
                        alt={worker.name}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-lg">No Photo</span>
                      </div>
                    )}
                  </>
                )}

                {/* Rating and Review Count */}
                <div className="mt-6 text-center">
                  <div className="flex justify-center text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(worker.rating) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{worker.rating}/5</p>
                  <p className="text-sm text-gray-600">({worker.reviewCount} reviews)</p>
                </div>

                {/* Verification Status */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm font-semibold text-gray-700">Verification Status</p>
                  <p className={`text-sm ${worker.isApproved ? 'text-green-600' : 'text-red-600'}`}>
                    {worker.isApproved ? '✓ Verified' : '✗ Not Verified'}
                  </p>
                </div>

                {/* Availability Status */}
                {isOwner && isEditing ? (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability Status
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="busy">Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                ) : (
                  <div className="mt-6 p-3 bg-gray-100 rounded-lg text-center">
                    <p className="text-sm font-semibold text-gray-700">Availability</p>
                    <p className={`text-sm capitalize ${
                      worker.availability === 'online' ? 'text-green-600' :
                      worker.availability === 'busy' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {worker.availability}
                    </p>
                  </div>
                )}
              </div>

              {/* Profile Details Section */}
              <div className="md:col-span-2">
                {/* Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  {isOwner && isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{worker.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-600">{worker.email}</p>
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isOwner && isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <p className="text-gray-600">{worker.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Service Area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
                  {isOwner && isEditing ? (
                    <input
                      type="text"
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <p className="text-gray-600">{worker.serviceArea || 'Not specified'}</p>
                  )}
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  {isOwner && isEditing ? (
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <p className="text-gray-600">{worker.experience} years</p>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isOwner && isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <p className="text-gray-600">{worker.bio || 'No bio provided'}</p>
                  )}
                </div>

                {/* Certifications */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                  {isOwner && isEditing ? (
                    <textarea
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <p className="text-gray-600">{worker.certifications || 'No certifications provided'}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  {isOwner && isEditing ? (
                    <div>
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                          placeholder="Add a skill..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button
                          onClick={handleAddSkill}
                          className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map(skill => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-cyan-600 hover:text-cyan-900 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {worker.skills && worker.skills.length > 0 ? (
                        worker.skills.map(skill => (
                          <span
                            key={skill}
                            className="inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No skills listed</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Button (only for customers viewing worker profile) */}
                {!isOwner && user?.role === 'customer' && (
                  <button
                    onClick={handleContactWorker}
                    className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold text-lg"
                  >
                    Contact Worker
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        otherUserId={workerId}
        otherUserName={worker?.name}
        otherUserPicture={worker?.profilePicture}
      />

      {/* Worker Unavailable Modal */}
      {showUnavailableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-red-100 rounded-full p-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Worker Not Available</h2>
              <p className="text-gray-600 mb-6">
                This worker is currently {worker?.availability} and cannot be contacted right now. Please try again later.
              </p>
              <button
                onClick={() => setShowUnavailableModal(false)}
                className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerProfile;
