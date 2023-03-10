export interface dbQuote {
  id: string;
  teamUid: string;
  authorUid: string;
  image: string;
  name: string;
  text: string;
  createdAt: string;
  rating: number;
  ratedBy: string[];
}

export interface quote {
  teamUid: string;
  authorUid: string;
  image: string;
  name: string;
  text: string;
  createdAt: string;
  rating: number;
  ratedBy: string[];
}
