export interface Event {
  id: string;
  user_id: string;
  created_at: number;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  start_time: string; // ISO date string
  end_time: string;   // ISO date string
  is_vegan: boolean;
  is_halal: boolean;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
}


export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch('http://localhost:8000/database/events/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 100,
        order: 'desc',
        order_by: 'created_at',
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.statusText}`);
    }

    const events: Event[] = await response.json();
    return events;
  } catch (error) {
    console.error(error);
    return [];
  }
}

