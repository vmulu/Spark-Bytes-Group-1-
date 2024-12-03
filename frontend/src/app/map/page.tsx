'use client';

import { useEffect, useRef, useState } from 'react';
import withAuth from '../withAuth';
import { getEvents, Event } from '../api/events';

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const userPreferences = { vegan: true, halal: false, vegetarian: true, glutenFree: false }; // Example user preferences

  useEffect(() => {
    // Fetch events data
    async function fetchEvents() {
      const events = await getEvents();
      setEvents(events);
      initMap(events);
    }

    // Initialize Google Map
    function initMap(events: Event[]) {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 42.3505, lng: -71.1054 }, // Boston University coordinates
        zoom: 15,
      });

      // Add markers for each event
      events.forEach((event) => {
        const marker = new google.maps.Marker({
          position: { lat: event.latitude, lng: event.longitude },
          map,
          title: event.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><h3>${event.name}</h3><p>${event.description}</p></div>`,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          setSelectedEvent(event);
        });
      });
    }

    fetchEvents();
  }, []);

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div>
      {/* Map Section */}
      <div ref={mapRef} className="w-full h-96 md:h-[400px] bg-gray-200" />

      {/* Event List Section */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6">Available Food Events</h3>
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="p-4 border border-gray-200 rounded-md shadow-sm transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <h4 className="text-lg font-semibold">{event.name}</h4>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Location: {event.location}
              </p>
              <p className="text-sm text-gray-500">
                Time: {new Date(event.startTime).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">{selectedEvent.name}</h3>
            <p className="mb-2 text-gray-700">{selectedEvent.description}</p>
            <p className="text-sm text-gray-600">
              Location: {selectedEvent.location}
            </p>
            <p className="text-sm text-gray-600">
              Time: {new Date(selectedEvent.startTime).toLocaleString()}
            </p>
            <h4 className="text-lg font-semibold mt-4">Matches Your Preferences:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {Object.entries(userPreferences).map(([preference, isPreferred]) => (
                <li
                  key={preference}
                  className={selectedEvent[preference as keyof Event] ? 'text-green-600' : 'text-red-600'}
                >
                  {preference.charAt(0).toUpperCase() + preference.slice(1)}: {isPreferred ? 'Yes' : 'No'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(MapPage);
