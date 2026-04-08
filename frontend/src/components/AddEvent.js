import { useState } from "react";
import axios from "axios";

function AddEvent({ onEventAdded }) {
  const [form, setForm] = useState({
  title: "",
  description: "",
  address: "",
  category: "",
  price: "",
  startDate: "",
  endDate: "",
  image: "",
  isFeatured: false
});

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Convert address to coordinates
    const geoRes = await axios.get(
    `https://nominatim.openstreetmap.org/search`,
    {
        params: {
        q: form.address,
        format: "json",
        limit: 1
        }
    }
    );

    if (!geoRes.data.length) {
    alert("Invalid address");
    return;
    }

    const lat = geoRes.data[0].lat;
    const lng = geoRes.data[0].lon;

  const newEvent = {
    title: form.title,
    description: form.description,
    category: form.category.trim().toLowerCase(),
    price: Number(form.price),
    startDate: form.startDate,
    endDate: form.endDate,
    image: form.image,
    address: form.address,
    isFeatured: form.isFeatured,
    location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
    }
 };

  const token = localStorage.getItem("token");

    await axios.post(
    "http://localhost:5000/api/events",
    newEvent,
    {
        headers: {
        Authorization: token
        }
    }
    );

  alert("Event Added Successfully");

  setForm({
  title: "",
  description: "",
  address: "",
  category: "",
  price: "",
  startDate: "",
  endDate: "",
  image: "",
  isFeatured: false
});

  if (onEventAdded) onEventAdded();
};

  return (
  <div className="bg-white shadow-xl rounded-xl p-4">
    <h2 className="text-xl font-bold mb-3 text-center">
      Add Event 📍
    </h2>

    <form onSubmit={handleSubmit} className="space-y-3">

      <input
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        className="w-full p-2 border rounded-lg"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        className="w-full p-2 border rounded-lg"
        placeholder="Enter Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <input
        className="w-full p-2 border rounded-lg"
        placeholder="Category (Music, Food, Tech, etc.)"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        className="w-full p-2 border rounded-lg"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <p className="text-sm font-medium">Start Date ⏰</p>
        <input
        type="datetime-local"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

      <p className="text-sm font-medium">End Date ⏳</p>
        <input
        type="datetime-local"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

      <input
        className="w-full p-2 border rounded-lg"
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({ ...form, isFeatured: e.target.checked })
          }
        />
        Featured Event ⭐
      </label>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      >
        Add Event 🚀
      </button>

    </form>
  </div>
);
}

export default AddEvent;