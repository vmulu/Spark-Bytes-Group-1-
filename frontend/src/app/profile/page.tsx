'use client';

import { useState, useContext } from 'react';
import withAuth from '../withAuth';
import { AuthContext } from '../api/auth';

interface Preferences {
  vegan: boolean;
  halal: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  // Add more preferences as needed
}

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [preferences, setPreferences] = useState<Preferences>({
    vegan: false,
    halal: false,
    vegetarian: false,
    glutenFree: false,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.checked,
    });
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
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="vegan"
              checked={preferences.vegan}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Vegan
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="vegetarian"
              checked={preferences.vegetarian}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Vegetarian
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="halal"
              checked={preferences.halal}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Halal
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="glutenFree"
              checked={preferences.glutenFree}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Gluten-Free
          </label>
          {/* Add more preference options as needed */}
        </div>
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default withAuth(ProfilePage);
