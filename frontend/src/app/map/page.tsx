'use client';

import { useEffect, useRef, useState } from 'react';
import withAuth from '../withAuth';
import { getEvents, Event } from '../api/events';

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const loadGoogleMapsScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (typeof window.google !== 'undefined' && window.google.maps) {
          resolve(); // Script already loaded
          return;
        }

        const existingScript = document.getElementById('googleMapsScript');

        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps script')));
          return;
        }

        const script = document.createElement('script');
        script.id = 'googleMapsScript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(script);
      });
    };

    const initMap = (eventsData: Event[]) => {
      if (!mapRef.current || typeof google === 'undefined') return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 42.3505, lng: -71.1054 },
        zoom: 15,
      });

      eventsData.forEach((event) => {
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
  }, []);

  const handleCloseModal = () => setSelectedEvent(null);

  return (
    <div>
      <div ref={mapRef} className="w-full h-96 md:h-[400px] bg-gray-200" />

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
                Time: {new Date(event.start_time).toLocaleString()} -{' '}
                {new Date(event.end_time).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

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
              Time: {new Date(selectedEvent.start_time).toLocaleString()} -{' '}
              {new Date(selectedEvent.end_time).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(MapPage);
