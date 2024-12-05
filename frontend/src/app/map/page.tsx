'use client';

import { useEffect, useRef, useState, useContext } from 'react';
import withAuth from '../withAuth';
import { getEvents, Event } from '../api/events';
import { AuthContext, User } from '../api/auth';

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useContext(AuthContext); // Get the user from context
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // State for sorting options
  const [sortOption, setSortOption] = useState<string>('time');

  const doesEventMatchPreferences = (event: Event, user: User): boolean => {
    const preferences = ['is_vegan', 'is_halal', 'is_vegetarian', 'is_gluten_free'];
    return preferences.some(
      (pref) => user[pref as keyof User] && event[pref as keyof Event]
    );
  };

  useEffect(() => {
    if (!user) return; // Wait for user data to be available

    const loadGoogleMapsScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (typeof window.google !== 'undefined' && window.google.maps) {
          resolve(); // Script already loaded
          return;
        }

        const existingScript = document.getElementById('googleMapsScript');

        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () =>
            reject(new Error('Failed to load Google Maps script'))
          );
          return;
        }

        const script = document.createElement('script');
        script.id = 'googleMapsScript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(script);
      });
    };

    const initMap = (eventsData: Event[]) => {
      if (!mapRef.current || typeof google === 'undefined') return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 42.3505, lng: -71.1054 },
        zoom: 15,
        mapTypeId: 'satellite', // Satellite view
        mapTypeControl: false, // Hide map type controls
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Custom map styles to turn off labels
      const customMapStyle = [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ];
      map.setOptions({ styles: customMapStyle });

      eventsData.forEach((event) => {
        const matchesPreferences = doesEventMatchPreferences(event, user);
        const markerIconUrl = matchesPreferences
          ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

        const markerIcon = {
          url: markerIconUrl,
          scaledSize: new google.maps.Size(50, 50), // Scale the icon to be 150% larger (default is ~20x20)
        };

        const marker = new google.maps.Marker({
          position: { lat: event.latitude, lng: event.longitude },
          map,
          title: event.name,
          icon: markerIcon,
        });

        const infoWindowContent = `
          <div style="max-width:250px; font-size: 14px;">
            <h3 style="margin-bottom: 0.5em; font-size: 18px;">${event.name}</h3>
            <p style="margin-bottom: 0.5em;">${event.description}</p>
            <p style="font-size:0.9em;color:gray;">Location: ${event.location}</p>
            <p style="font-size:0.9em;color:gray;">Time: ${new Date(
          event.start_time
        ).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}</p>
          </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          setSelectedEvent(event);
        });
      });
    };

    async function fetchEventsAndInitMap() {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);

        await loadGoogleMapsScript();
        initMap(eventsData);
      } catch (error) {
        console.error('Error loading Google Maps or fetching events:', error);
      }
    }

    fetchEventsAndInitMap();
  }, [user]);

  const handleCloseModal = () => setSelectedEvent(null);

  // Function to sort events
  const sortedEvents = events.slice().sort((a, b) => {
    if (sortOption === 'time') {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    } else if (sortOption === 'preferences' && user) {
      const aMatches = doesEventMatchPreferences(a, user) ? 1 : 0;
      const bMatches = doesEventMatchPreferences(b, user) ? 1 : 0;
      return bMatches - aMatches; // Events matching preferences come first
    }
    return 0;
  });

  return (
    <div>
      <div ref={mapRef} className="w-full h-[600px] bg-gray-200" />

      <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6">Available Food Events</h3>

        {/* Sorting Options */}
        <div className="mb-4">
          <label className="mr-2 font-semibold">Sort By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="time">Time</option>
            <option value="preferences">Matches Preferences</option>
          </select>
        </div>

        <ul className="space-y-4">
          {sortedEvents.map((event) => {
            const matchesPreferences = doesEventMatchPreferences(event, user!);
            return (
              <li
                key={event.id}
                className={`p-4 border border-gray-200 rounded-md shadow-sm transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer ${
                  matchesPreferences ? 'bg-green-100' : 'bg-red-100'
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <h4 className="text-lg font-semibold flex items-center">
                  {event.name}
                  {matchesPreferences && (
                    <span className="ml-2 text-green-600">&#10003;</span>
                  )}
                </h4>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Location: {event.location}
                </p>
                <p className="text-sm text-gray-500">
                  Time: {new Date(event.start_time).toLocaleString()} -{' '}
                  {new Date(event.end_time).toLocaleString()}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-8 rounded-md shadow-lg max-w-xl w-full relative overflow-y-auto max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
            >
              &times;
            </button>
            <h3 className="text-3xl font-bold mb-6">{selectedEvent.name}</h3>
            <p className="mb-4 text-gray-800 text-lg">{selectedEvent.description}</p>
            <p className="text-md text-gray-700 mb-2">
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p className="text-md text-gray-700 mb-4">
              <strong>Time:</strong>{' '}
              {new Date(selectedEvent.start_time).toLocaleString()} -{' '}
              {new Date(selectedEvent.end_time).toLocaleString()}
            </p>
            {/* Dietary Options */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Dietary Options:</h4>
              <ul className="list-disc list-inside">
                {selectedEvent.is_vegan && <li>Vegan</li>}
                {selectedEvent.is_vegetarian && <li>Vegetarian</li>}
                {selectedEvent.is_halal && <li>Halal</li>}
                {selectedEvent.is_gluten_free && <li>Gluten Free</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(MapPage);
