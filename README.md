# 🚀 LocalVibe Event Finder App

LocalVibe is a full-stack web application that helps users discover nearby events, explore them on a map, and interact through favorites and RSVP features.

---

## 📌 Features

### Event Discovery
- View nearby events based on user location
- Interactive map using Leaflet
- Click markers to view event details

### Event Management
- Add new events
- View personal created events
- Events linked to logged-in user

### Filters & Search
- Filter by category (Food, Tech, etc.)
- Filter by price (Free / Paid)
- Search events by title, description, or category

### User Interaction
- Mark events as Favorite
- RSVP as Going / Interested
- View favorite event list

### Featured Events
- Highlighted events with special marker
- Different UI for featured events

### Security
- JWT Authentication
- User-based event access

---

## Tech Stack

Frontend:
- React.js
- Tailwind CSS
- Axios
- React Leaflet

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Other Tools:
- Leaflet (Maps & Markers)

---

## Project Structure

LocalVibe/
│
├─ frontend/
│
├─ backend/
│
├─ screenshots/
│
├─ .gitignore
│
├─ README.md

---

## Setup Instructions

### 1. Clone Repository

git clone https://github.com/Ishwari-Jadhav/LocalVibe-Event-Finder.git

### 2. Backend Setup

cd backend
npm install
npm start

### 3. Frontend Setup

cd frontend
npm install
npm start

---

## Demo Data

Use sample data:
- 1 Free Event (Normal)
- 1 Paid Event (Featured)

---

## Core Logic

Nearby events are fetched using geospatial queries:
- User location is captured using browser geolocation
- Events are filtered based on distance radius
- MongoDB $near is used for location-based search

---

## Project Objective

To build a location-based event discovery platform that allows users to:
- Find nearby events
- Interact with events
- Manage and create their own events

---

## Developed By
Ishwari Pravin Jadhav