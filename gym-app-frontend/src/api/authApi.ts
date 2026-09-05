const API_URL = import.meta.env.VITE_API_URL;

export async function signup(email: string, password: string, fullName: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Signup failed');
  return result.data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Login failed');
  return result.data;
}

export async function logout(token: string) {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Session invalid');
  const result = await res.json();
  return result.data;
}
