'use client';

import { useState, useContext } from 'react';
import withAuth from '../withAuth';
import { AuthContext } from '../api/auth';

interface Preferences {
  vegan: boolean;
  halal: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
}

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [preferences, setPreferences] = useState<Preferences>({
    vegan: false,
    halal: false,
    vegetarian: false,
    glutenFree: false,
  });

  const handlePreferenceToggle = (preference: keyof Preferences) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [preference]: !prevPreferences[preference],
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement API call to save preferences
    console.log('Preferences saved:', preferences);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <p className="mb-4">Hello, {user}!</p>
      <form onSubmit={handleSubmit}>
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
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default withAuth(ProfilePage);
