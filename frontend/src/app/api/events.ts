export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  preferences: {
    vegan: boolean;
    halal: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    // Add more preferences as needed
  };
}

export async function getEvents(): Promise<Event[]> {
  // TODO: Implement API call to fetch events
  // For now, return sample data
  return [
    {
      id: '1',
      name: 'Leftover Pizza from CS Event',
      description: 'Free pizza available in the lobby.',
      location: '123 Main St',
      latitude: 42.3505,
      longitude: -71.1054,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      preferences: {
        vegan: false,
        halal: false,
        vegetarian: true,
        glutenFree: false,
      },
    },
    // Add more sample events
  ];
}
