export interface team {
  creatorId: string;
  members: string[];
  name: string;
  passcode: string;
  teamId: string;
  teamUid: string;
}
export interface member {
  id: string;
  email: string;
  emailVerified: boolean | null;
  image: string;
  memberOf: string | null;
  name: string;
}
