import AddEvent from "./components/AddEvent";
import Auth from "./components/Auth";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const normalIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const featuredIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function App() {
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [position, setPosition] = useState([18.5204, 73.8567]);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    price: "",
    search: ""
  });

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    },
    (err) => {
      console.log("Location permission denied, using default");
    }
  );
}, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `https://localvibe-backend-2f5t.onrender.com/api/events/nearby`,
        {
          params: {
            lng: position[1],
            lat: position[0],
            category: filters.category,
            price: filters.price,
            search: filters.search
          }
        }
      );

      setEvents(res.data);

      const uniqueCategories = [
        ...new Set(res.data.map((e) => e.category).filter(Boolean))
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://localvibe-backend-2f5t.onrender.com/api/events/my-events",
        {
          headers: {
            Authorization: token
          }
        }
      );

      setMyEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFavorites = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://localvibe-backend-2f5t.onrender.com/api/user/favorites",
      {
        headers: { Authorization: token }
      }
    );

    setFavorites(res.data.map((e) => e._id.toString()));
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  if (user) {
    fetchMyEvents();
    fetchFavorites();
  }
}, [user]);

  const handleRSVP = async (id, type) => {
    try {
      await axios.post(
        `https://localvibe-backend-2f5t.onrender.com/api/events/${id}/rsvp`,
        { type }
      );
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFavorite = async (eventId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `https://localvibe-backend-2f5t.onrender.com/api/user/favorite/${eventId}`,
      {},
      {
        headers: { Authorization: token }
      }
    );

    fetchFavorites();
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchEvents();
  }, [position, filters]);

  
  return (
    <div className="h-screen flex flex-col">

      {/* HEADER */}
      <div className="bg-black text-white p-3 text-xl font-bold text-center relative">
        LocalVibe 🌍

        {user && (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              setUser(null);
            }}
            className="absolute right-4 top-2 bg-red-500 px-3 py-1 rounded"
          >
            Logout 🚪
          </button>
        )}
      </div>

      {/* SHOW LOGIN IF NOT LOGGED IN */}
      {!user ? (
        <Auth setUser={setUser} />
      ) : (
        <div className="flex flex-1">

          {/* LEFT SIDE */}
          <div className="w-1/4 p-4 bg-gray-100 space-y-6">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              } 
            />

            {/* FILTERS */}
            <div className="p-3 bg-white rounded-xl shadow-md">
              <h2 className="font-bold mb-2">Filters 🔍</h2>

              <select
                className="w-full p-2 border rounded mb-2"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">All Categories</option>

                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 border rounded"
                value={filters.price}
                onChange={(e) =>
                  setFilters({ ...filters, price: e.target.value })
                }
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* PROTECTED ADD EVENT */}
            <AddEvent
              onEventAdded={() => {
                fetchEvents();
                fetchMyEvents();
              }}
            />

            {/* EVENTS LIST */}
            <div className="bg-white p-3 rounded-xl shadow-md max-h-64 overflow-y-auto">
              <h2 className="font-bold mb-2">Events 📋</h2>

              {events.map((event) => (
                <div
                  key={event._id}
                  className={`p-2 border-b cursor-pointer ${
                    selectedEvent?._id === event._id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {event.category
                      ? event.category.charAt(0).toUpperCase() + event.category.slice(1)
                      : "General"}
                  </p>
                </div>
              ))}
            </div>

            {/* FAVORITES */}
            <div className="bg-white p-3 rounded-xl shadow-md">
              <h2 className="font-bold mb-2">❤️ Favorites</h2>

              {events.filter(e => favorites.includes(e._id.toString())).length === 0 && (
                <p className="text-sm text-gray-500">
                  No favorites yet ❤️
                </p>
              )}

              {events
                .filter((e) => favorites.includes(e._id.toString()))
                .map((event) => (
                  <div key={event._id} className="text-sm mb-1">
                    {event.title}
                  </div>
                ))}
            </div>
            
            {/* MY EVENTS */}
            <div className="bg-white p-3 rounded-xl shadow-md max-h-40 overflow-y-auto">
              <h2 className="font-bold mb-2">🎟️ My Events</h2>

              {myEvents.length === 0 && (
                <p className="text-sm text-gray-500">
                  No events created yet
                </p>
              )}

              {myEvents.map((event) => (
                <div key={event._id} className="text-sm mb-1">
                  {event.title}
                </div>
              ))}
            </div>
          </div>

          {/* MAP */}
          <div className="w-3/4">
            <MapContainer
              center={
                selectedEvent
                  ? [
                      selectedEvent.location.coordinates[1],
                      selectedEvent.location.coordinates[0],
                    ]
                  : position
              }
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {events.map((event) => (
                  <Marker
                    key={event._id}
                    position={[
                      event.location.coordinates[1],
                      event.location.coordinates[0],
                    ]}
                    icon={event.isFeatured ? featuredIcon : normalIcon}
                  >
                    <Popup>
                      <div className="space-y-2">
                        {event.isFeatured && (
                          <span className="text-xs bg-yellow-300 px-2 py-1 rounded">
                            ⭐ Featured
                          </span>
                        )}

                        {event.image && (
                          <img
                            src={event.image}
                            alt="event"
                            className="w-full h-32 object-cover rounded"
                          />
                        )}

                        <h2 className="text-lg font-bold">{event.title}</h2>

                        <p className="text-sm text-gray-600">
                          {event.description}
                        </p>

                        {event.startDate && (
                          <p className="text-sm text-gray-500">
                            📅 {new Date(event.startDate).toLocaleString()} -{" "}
                            {event.endDate &&
                              new Date(event.endDate).toLocaleString()}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          📍 {event.address}
                        </p>

                        <p className="font-semibold text-green-600">
                          {event.price === 0
                            ? "Free"
                            : event.price
                            ? `₹${event.price}`
                            : "Free"}
                        </p>

                        <p className="text-sm">Going: {event.going || 0}</p>
                        <p className="text-sm">Interested: {event.interested || 0}</p>

                        <div className="flex gap-2 mt-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => handleRSVP(event._id, "going")}
                          >
                            Going ✅
                          </button>

                          <button
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                            onClick={() => handleRSVP(event._id, "interested")}
                          >
                            Interested ⭐
                          </button>

                          <button
                            className={`px-3 py-1 rounded ${
                              favorites.includes(event._id.toString())
                                ? "bg-red-500 text-white"
                                : "bg-gray-300"
                            }`}
                            onClick={() => toggleFavorite(event._id)}
                          >
                            {favorites.includes(event._id.toString())
                              ? "❤️ Favorited"
                              : "🤍 Favorite"}
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;