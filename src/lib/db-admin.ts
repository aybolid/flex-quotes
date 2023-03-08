import { db } from "./firebase-admin";

export const getUserTeam = async (userUid: string) => {
  const snapshot = await db
    .collection("teams")
    .where("members", "array-contains", userUid)
    .get();

  const team: object[] = [];
  snapshot.forEach((doc) => team.push({ ...doc.data() }));

  return team;
};

export const getTeamMembers = async (teamUid: string) => {
  const snapshot = await db
    .collection("users")
    .where("memberOf", "==", teamUid)
    .get();

  const teamMembers: object[] = [];
  snapshot.forEach((doc) => teamMembers.push({ id: doc.id, ...doc.data() }));

  return teamMembers;
};

export const getTeamQuotes = async (teamUid: string) => {
  const snapshot = await db
    .collection("quotes")
    .where("teamUid", "==", teamUid)
    .get();

  const quotes: {}[] = [];
  snapshot.forEach((doc) => quotes.push({ id: doc.id, ...doc.data() }));

  return quotes;
};
