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