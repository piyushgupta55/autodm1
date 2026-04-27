import { useState, useEffect } from 'react';

export interface InstagramAccount {
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
  is_active: boolean;
}

export const useInstagram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/instagram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || "Failed to get auth URL");
      }
    } catch (err: any) {
      console.error('Failed to connect Instagram account:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    connectAccount,
  };
};
