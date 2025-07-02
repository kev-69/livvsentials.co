export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Address {
  id: string;
  fullName: string
  streetName: string;
  city: string;
  postalCode?: string;
  region: string;
  phone: string
  isDefault?: boolean
  createdAt?: string;
  updatedAt?: string;
}