export interface Incident {
  id: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  description: string;
  location: string;
  reportedBy: string;
  dogName?: string;
  images: File[];
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  role?: 'user' | 'admin';
}

export interface ReportFormData {
  location: string;
  date: string;
  time: string;
  description: string;
  reporterName: string;
  dogName: string;
  images: File[];
}

export interface ApiIncident {
  _id: string;
  title: string;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  dogBreed: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  reportedBy: string;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ApiUser {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
} 