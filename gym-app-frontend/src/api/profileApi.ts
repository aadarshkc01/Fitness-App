const API_URL = import.meta.env.VITE_API_URL;

export async function updateProfile(token: string, fullName: string) {
  const res = await fetch(`${API_URL}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ fullName }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to update profile');
  return result.data;
}