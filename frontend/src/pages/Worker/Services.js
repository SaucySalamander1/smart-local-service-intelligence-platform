import { useState, useEffect, useContext } from 'react';
import { getWorkerById } from '../../api/workers';
import { AuthContext } from '../../context/AuthContext';
import WorkerNavbar from '../../components/Navbars/WorkerNavbar';
import Footer from '../../components/Footer/Footer';

const WorkerServices = () => {
  const { user } = useContext(AuthContext);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch worker's own profile to display services
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const data = await getWorkerById(user.id);
          setWorkerProfile(data.data);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load your services. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <WorkerNavbar />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-gray-600 text-lg">Loading your services...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <WorkerNavbar />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <WorkerNavbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Services</h1>
            <p className="text-gray-600">Services are automatically synced from your profile</p>
          </div>

          {/* Services Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {workerProfile?.skills && workerProfile.skills.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Services ({workerProfile.skills.length})</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workerProfile.skills.map((service, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-orange-900 capitalize mb-2">{service}</h3>
                          <p className="text-orange-700 text-sm">
                            {workerProfile.experience} years of experience
                          </p>
                        </div>
                        <div className="text-4xl text-orange-500">
                          ✓
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="mt-4 pt-4 border-t border-orange-200 space-y-2">
                        <p className="text-sm text-orange-800">
                          <span className="font-semibold">Rating:</span> {workerProfile.rating}/5 ⭐
                        </p>
                        <p className="text-sm text-orange-800">
                          <span className="font-semibold">Service Area:</span> {workerProfile.serviceArea || 'Not specified'}
                        </p>
                        {workerProfile.availability && (
                          <p className="text-sm">
                            <span className="font-semibold text-orange-800">Status:</span>{' '}
                            <span className={`capitalize px-2 py-1 rounded text-xs font-semibold ${
                              workerProfile.availability === 'online' ? 'bg-green-200 text-green-800' :
                              workerProfile.availability === 'busy' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {workerProfile.availability}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Profile Link */}
                <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-blue-900">
                    <span className="font-semibold">💡 Note:</span> To add or remove services, visit your profile and edit your skills there.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Services Added Yet</h3>
                <p className="text-gray-600 mb-6">
                  Add skills to your profile to get started. These will appear here automatically.
                </p>
                <a
                  href={`/worker-profile/${user?.id}`}
                  className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
                >
                  Go to My Profile & Add Skills
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkerServices;
