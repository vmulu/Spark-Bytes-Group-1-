"use client";

import { useState, useContext, useEffect } from 'react';
import withAuth from '../withAuth';
import { AuthContext } from '../api/auth';
import { User } from '../api/auth';
import { Event, getEvents } from '../api/events';

interface Preferences {
  is_vegan: boolean;
  is_halal: boolean;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
}

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [preferences, setPreferences] = useState<Preferences>({
    is_vegan: false,
    is_halal: false,
    is_vegetarian: false,
    is_gluten_free: false,
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);

  const preferenceLabels: { [key in keyof Preferences]: string } = {
    is_vegan: 'Vegan',
    is_halal: 'Halal',
    is_vegetarian: 'Vegetarian',
    is_gluten_free: 'Gluten Free',
  };

  useEffect(() => {
    if (user) {
      setPreferences({
        is_vegan: user.is_vegan,
        is_halal: user.is_halal,
        is_vegetarian: user.is_vegetarian,
        is_gluten_free: user.is_gluten_free,
      });

      // Fetch events created by the user
      fetchUserEvents(user.user_id);
    }
  }, [user]);

  const fetchUserEvents = async (userId: string) => {
    try {
      const eventsData = await getEvents(userId);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  const handlePreferenceToggle = (preference: keyof Preferences) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [preference]: !prevPreferences[preference],
    }));
  };

  const handleSubmitPreferences = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/database/users/${user?.user_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            ...preferences,
            user_id: user?.user_id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save preferences');
      }

      const data: User = await response.json();
      console.log('Preferences saved:', data);

      // Update the user in the AuthContext
      updateUser(data);

      alert('Preferences saved successfully!');
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      alert(`Error saving preferences: ${error.message}`);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEditedEvent({ ...event }); // Clone the event for editing
    setIsModalOpen(true);
  };

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (editedEvent) {
      const { name, value, type, checked } = e.target;
      let newValue: any = value;

      // Handle checkboxes
      if (type === 'checkbox') {
        newValue = checked;
      }

      // Handle number inputs
      if (type === 'number') {
        newValue = parseFloat(value) || 0; // Default to 0 if parsing fails
      }

      setEditedEvent({
        ...editedEvent,
        [name]: newValue,
      });
    }
  };


  const handleEventSave = async () => {
    if (!editedEvent) return;

    try {
      const response = await fetch(
        `http://localhost:8000/database/events/${editedEvent.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(editedEvent),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update event');
      }

      const updatedEvent: Event = await response.json();

      // Update the event in the list
      setEvents((prevEvents) =>
        prevEvents.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt))
      );

      setIsModalOpen(false);
      alert('Event updated successfully!');
    } catch (error: any) {
      console.error('Error updating event:', error);
      alert(`Error updating event: ${error.message}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setEditedEvent(null);
  };

  const handleAddEvent = () => {
    setEditedEvent({
      id: '',
      user_id: user?.user_id || '',
      created_at: Date.now(),
      name: '',
      description: '',
      location: '',
      latitude: 0,
      longitude: 0,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      is_vegan: false,
      is_halal: false,
      is_vegetarian: false,
      is_gluten_free: false,
    });
    setIsModalOpen(true);
  };

  const handleEventCreate = async () => {
    if (!editedEvent) return;

    try {
      const response = await fetch(`http://localhost:8000/database/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify([editedEvent]), // API expects an array of events
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create event');
      }

      const newEvents: Event[] = await response.json();

      // Add the new event to the list
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);

      setIsModalOpen(false);
      alert('Event created successfully!');
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(`Error creating event: ${error.message}`);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <p className="mb-4">Hello, {user.user_id}!</p>

      {/* Preferences Form */}
      <form onSubmit={handleSubmitPreferences}>
        <h3 className="text-xl font-semibold mb-4">Food Preferences</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(preferences).map(([key, value]) => (
            <button
              key={key}
              type="button"
              className={`p-4 rounded-lg text-center font-medium transition-transform duration-200 ease-in-out ${
                value
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handlePreferenceToggle(key as keyof Preferences)}
            >
              {preferenceLabels[key as keyof Preferences]}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 mb-8 w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save Preferences
        </button>
      </form>

      {/* User's Events */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">My Events</h3>
        <button
          onClick={handleAddEvent}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Add New Event
        </button>
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event.id}
                className="p-4 border border-gray-200 rounded-md shadow-sm transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <h4 className="text-lg font-semibold">{event.name}</h4>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Location: {event.location}
                </p>
                <p className="text-sm text-gray-500">
                  Time: {new Date(event.start_time).toLocaleString()} -{' '}
                  {new Date(event.end_time).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Event Modal */}
      {isModalOpen && editedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full relative overflow-y-auto max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">
              {editedEvent.id ? 'Edit Event' : 'Create Event'}
            </h3>
            <form>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedEvent.name}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editedEvent.description}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* Location */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editedEvent.location}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* Latitude */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={editedEvent.latitude}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* Longitude */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={editedEvent.longitude}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* Start Time */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={editedEvent.start_time.slice(0, 16)}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* End Time */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={editedEvent.end_time.slice(0, 16)}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* Dietary Preferences */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">
                  Dietary Options
                </h4>
                <div className="flex items-center">
                  <label className="mr-4 flex items-center">
                    <input
                      type="checkbox"
                      name="is_vegan"
                      checked={editedEvent.is_vegan}
                      onChange={handleEventChange}
                      className="mr-2"
                    />
                    Vegan
                  </label>
                  <label className="mr-4 flex items-center">
                    <input
                      type="checkbox"
                      name="is_vegetarian"
                      checked={editedEvent.is_vegetarian}
                      onChange={handleEventChange}
                      className="mr-2"
                    />
                    Vegetarian
                  </label>
                  <label className="mr-4 flex items-center">
                    <input
                      type="checkbox"
                      name="is_halal"
                      checked={editedEvent.is_halal}
                      onChange={handleEventChange}
                      className="mr-2"
                    />
                    Halal
                  </label>
                  <label className="mr-4 flex items-center">
                    <input
                      type="checkbox"
                      name="is_gluten_free"
                      checked={editedEvent.is_gluten_free}
                      onChange={handleEventChange}
                      className="mr-2"
                    />
                    Gluten Free
                  </label>
                </div>
              </div>
            </form>
            <button
              onClick={editedEvent.id ? handleEventSave : handleEventCreate}
              className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {editedEvent.id ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(ProfilePage);
