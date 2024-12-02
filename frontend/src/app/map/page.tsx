'use client';

import { useEffect, useRef } from 'react';
import withAuth from '../withAuth';
import { getEvents, Event } from '../api/events';

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<Event[]>([]);

  useEffect(() => {
    // Fetch events data
    async function fetchEvents() {
      const events = await getEvents();
      eventsRef.current = events;
      initMap();
    }

    // Initialize Google Map
    function initMap() {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 42.3505, lng: -71.1054 }, // Boston University coordinates
        zoom: 15,
      });

      // Add markers for each event
      eventsRef.current.forEach((event) => {
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
        });
      });
    }

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Food Map</h2>
      <div className="flex flex-col md:flex-row">
        {/* Map Section */}
        <div className="md:w-2/3 h-96 md:mr-4 mb-8 md:mb-0">
          <div ref={mapRef} className="w-full h-full bg-gray-200" />
        </div>
        {/* Events List */}
        <div className="md:w-1/3">
          <h3 className="text-xl font-semibold mb-4">Available Food Events</h3>
          {/* TODO: Implement sorting options */}
          <ul className="space-y-4">
            {eventsRef.current.map((event) => (
              <li key={event.id} className="p-4 border border-gray-200 rounded-md shadow-sm">
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
      </div>
    </div>
  );
};

export default withAuth(MapPage);
