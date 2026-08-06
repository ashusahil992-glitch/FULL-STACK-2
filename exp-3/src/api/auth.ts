export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  username: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Mock Database of users
const users: Record<string, User> = {
  admin: { id: '1', username: 'admin', role: 'admin' },
  editor: { id: '2', username: 'editor', role: 'editor' },
  viewer: { id: '3', username: 'viewer', role: 'viewer' },
};

// Simulates a backend delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulates issuing tokens
const generateTokens = (user: User) => {
  // In a real app, these are JWTs signed by the backend.
  // We're just using identifiable strings for mock purposes.
  return {
    accessToken: `mock-access-token-${user.id}-${Date.now()}`,
    refreshToken: `mock-refresh-token-${user.id}`,
  };
};

export const mockLogin = async (username: string, password?: string): Promise<AuthResponse> => {
  await delay(1000); // Simulate network latency

  const user = users[username];
  if (!user) {
    throw new Error('Invalid username. Use admin, editor, or viewer.');
  }

  // Simple mock password check
  if (password !== 'password123') {
    throw new Error('Invalid password. Please use password123.');
  }

  const tokens = generateTokens(user);
  
  return {
    user,
    ...tokens,
  };
};

export const mockRefreshToken = async (oldRefreshToken: string): Promise<{ accessToken: string }> => {
  await delay(800);
  
  // Extract user id from our mock refresh token
  const userId = oldRefreshToken.split('-')[3];
  
  if (!userId) {
     throw new Error('Invalid refresh token');
  }

  return {
    accessToken: `mock-access-token-${userId}-${Date.now()}`
  };
};
