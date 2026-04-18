import CustomerNavBar from "../../components/Navbars/CustomerNavbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "017XXXXXXXX",
    location: "Dhaka",
    address: "House 12, Road 5, Dhanmondi",
    joined: "Jan 2025",
    verified: true,
    lastActive: "2 hours ago",

    totalBookings: 12,
    completed: 10,
    cancelled: 2,

    payment: "bKash",
    notifications: true,

    status: "Active",

    image: `https://source.unsplash.com/100x100/?avatar,profile&sig=${Math.random()}`
  });

  // 🔹 Smart back
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/customer/dashboard");
    }
  };

  // 🔹 Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // 🔹 Change avatar
  const changeAvatar = () => {
    setUser({
      ...user,
      image: `https://source.unsplash.com/100x100/?avatar,profile&sig=${Math.random()}`
    });
  };

  // 🔹 Save
  const handleSave = () => {
    console.log("SAVE USER:", user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <CustomerNavBar />

      {/* 🔙 BACK BUTTON */}
      <div className="max-w-5xl mx-auto px-6 pt-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        <div className="bg-white rounded-2xl shadow p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">

            <div className="flex items-center gap-4">
              <img
                src={user.image}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover border"
              />

              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500">
                  Joined: {user.joined}
                </p>
                <p className="text-xs text-gray-400">
                  Last active: {user.lastActive}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-sm ${user.verified ? "text-green-600" : "text-red-500"}`}>
                {user.verified ? "✅ Verified" : "Not Verified"}
              </p>
              <p className="text-xs text-gray-400">
                Status: {user.status}
              </p>
            </div>
          </div>

          {/* CHANGE AVATAR */}
          {isEditing && (
            <button
              onClick={changeAvatar}
              className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Change Avatar
            </button>
          )}

          {/* INFO */}
          <div className="grid md:grid-cols-2 gap-4">

            {["email", "phone", "location", "address"].map((field) => (
              <div key={field}>
                <p className="text-sm text-gray-500 capitalize">{field}</p>

                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={user[field]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg mt-1"
                  />
                ) : (
                  <p className="font-medium">{user[field]}</p>
                )}
              </div>
            ))}

          </div>

          {/* STATS */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-lg font-semibold">{user.totalBookings}</p>
              <p className="text-xs text-gray-500">Bookings</p>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-lg font-semibold">{user.completed}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-lg font-semibold">{user.cancelled}</p>
              <p className="text-xs text-gray-500">Cancelled</p>
            </div>
          </div>

          {/* PREFERENCES */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              {isEditing ? (
                <select
                  name="payment"
                  value={user.payment}
                  onChange={handleChange}
                  className="mt-1 border px-3 py-2 rounded-lg"
                >
                  <option>bKash</option>
                  <option>Nagad</option>
                  <option>Cash</option>
                </select>
              ) : (
                <p className="font-medium">{user.payment}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Notifications</p>

              {isEditing ? (
                <input
                  type="checkbox"
                  name="notifications"
                  checked={user.notifications}
                  onChange={handleChange}
                />
              ) : (
                <span className="text-sm font-medium">
                  {user.notifications ? "Enabled" : "Disabled"}
                </span>
              )}
            </div>

          </div>

          {/* SECURITY */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Security</p>

            <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm">
              Change Password
            </button>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-3">

            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}