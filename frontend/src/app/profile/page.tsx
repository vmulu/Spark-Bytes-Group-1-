"use client";

import { useState, useContext, useEffect } from 'react';
import withAuth from '../withAuth';
import { AuthContext } from '../api/auth';
import { User } from '../api/auth';

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
    }
  }, [user]);

  const handlePreferenceToggle = (preference: keyof Preferences) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [preference]: !prevPreferences[preference],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <p className="mb-4">Hello, {user.user_id}!</p>
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
              {preferenceLabels[key as keyof Preferences]}
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
