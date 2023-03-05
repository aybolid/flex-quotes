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

export const getTeamMembers = async (teamId: string) => {
  const snapshot = await db
    .collection("users")
    .where("memberOf", "==", teamId)
    .get();

  const teamMembers: object[] = [];
  snapshot.forEach((doc) => teamMembers.push({ id: doc.id, ...doc.data() }));

  return teamMembers;
};
