import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkers, getServiceAreas, getAvailableSkills } from '../../api/workers';
import CustomerNavBar from '../../components/Navbars/CustomerNavbar';
import Footer from '../../components/Footer/Footer';

const BrowseWorkers = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedServiceArea, setSelectedServiceArea] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch workers
        const workersData = await getWorkers();
        setWorkers(workersData.data); 
        setFilteredWorkers(workersData.data);

        // Fetch service areas
        const areasData = await getServiceAreas();
        setServiceAreas(areasData.data);

        // Fetch skills
        const skillsData = await getAvailableSkills();
        setSkills(skillsData.data);

        setError(null);
      } catch (err) {
        setError('Failed to load workers. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filtering
  useEffect(() => {
    let filtered = workers;

    if (selectedServiceArea) {
      filtered = filtered.filter(w =>
        w.serviceArea?.toLowerCase().includes(selectedServiceArea.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(w =>
        w.skills?.includes(selectedSkill)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(w =>
        w.location && w.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredWorkers(filtered);
  }, [selectedServiceArea, selectedSkill, selectedLocation, workers]);

  const handleServiceAreaChange = (e) => {
    setSelectedServiceArea(e.target.value);
  };

  const handleSkillChange = (e) => {
    setSelectedSkill(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const clearFilters = () => {
    setSelectedServiceArea('');
    setSelectedSkill('');
    setSelectedLocation('');
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const workersData = await getWorkers();
      setWorkers(workersData.data);
      setFilteredWorkers(workersData.data);
      setError(null);
    } catch (err) {
      setError('Failed to refresh workers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomerNavBar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Workers</h1>
          <p className="text-gray-600">Find and connect with skilled workers in your area</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Area Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Area
              </label>
              <select
                value={selectedServiceArea}
                onChange={handleServiceAreaChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">All Areas</option>
                {serviceAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Skill Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill
              </label>
              <select
                value={selectedSkill}
                onChange={handleSkillChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">All Skills</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={selectedLocation}
                onChange={handleLocationChange}
                placeholder="e.g., mirpur"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Clear Filters
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition disabled:opacity-50"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found <span className="font-semibold">{filteredWorkers.length}</span> worker{filteredWorkers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600 text-lg">Loading workers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Workers Grid */}
        {!loading && filteredWorkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => {
              const isUnavailable = worker.availability === 'unavailable' || worker.availability === 'busy';
              
              return (
                <div
                  key={worker._id}
                  onClick={() => !isUnavailable && navigate(`/worker-profile/${worker._id}`)}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 ${
                    isUnavailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {/* Profile Picture */}
                  {worker.profilePicture ? (
                    <img
                      src={worker.profilePicture}
                      alt={worker.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-400">No Photo</span>
                    </div>
                  )}

                  {/* Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{worker.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.floor(worker.rating) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({worker.rating}/5)</span>
                  </div>

                  {/* Experience */}
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Experience:</span> {worker.experience} years
                  </p>

                  {/* Service Area */}
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Service Area:</span> {worker.serviceArea || 'N/A'}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills && worker.skills.length > 0 ? (
                        worker.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-block bg-cyan-100 text-cyan-800 text-xs px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {worker.bio && (
                    <p className="text-sm text-gray-600 mb-4">{worker.bio}</p>
                  )}

                  {/* Contact Info */}
                  {worker.phone && (
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-semibold">Phone:</span> {worker.phone}
                    </p>
                  )}

                  {/* Availability Status */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Status:</p>
                    <span className={`inline-block capitalize px-3 py-1 rounded-full text-xs font-semibold ${
                      worker.availability === 'online' ? 'bg-green-200 text-green-800' :
                      worker.availability === 'busy' ? 'bg-yellow-200 text-yellow-800' :
                      worker.availability === 'unavailable' ? 'bg-red-200 text-red-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {worker.availability === 'offline' ? 'Offline' :
                       worker.availability === 'busy' ? 'Busy - Call Back Later' :
                       worker.availability === 'unavailable' ? 'Not Available' :
                       'Online'}
                    </span>
                  </div>

                  {/* View Profile Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isUnavailable) {
                        navigate(`/worker-profile/${worker._id}`);
                      }
                    }}
                    disabled={isUnavailable}
                    className={`w-full py-2 rounded-lg transition font-medium ${
                      isUnavailable
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-cyan-500 text-white hover:bg-cyan-600'
                    }`}
                  >
                    {isUnavailable ? 'Not Available' : 'View Profile'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No workers found. Try adjusting your filters.</p>
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseWorkers;
