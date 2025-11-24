// src/types/userTypes.ts
export interface User {
  id?: number;
  name: string;
  email: string;
  age: number;
  created_at?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}