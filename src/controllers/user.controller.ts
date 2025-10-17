interface UserProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export const getUserProfile = (): UserProfile => {
  return {
    id: 1,
    name: "Gabriel Ferreira",
    email: "gabriel@example.com",
    created_at: new Date().toISOString(),
  };
};