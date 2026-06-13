export interface RSVPInput {
  name: string;
  email?: string;
  attending: boolean;
  guestsCount: number;
  dietary?: string;
  message?: string;
}

export interface RSVPResponse extends RSVPInput {
  id: string;
  createdAt: any; // Firestore Timestamp or Date
}

export interface GuestPhoto {
  id: string;
  uploaderName: string;
  imageUri: string; // Base64 data url
  caption?: string;
  likes: number;
  createdAt: any; // Firestore Timestamp or Date
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface EventDetails {
  title: string;
  date: string;
  time: string;
  venueName: string;
  address: string;
  gmapsUrl?: string;
  attire: string;
}
