import firebase from "./firebase";
const db = firebase.firestore();

export const createTeam = (
  teamData: {
    name: string;
    teamId: string;
    passcode: string;
    creatorId: string;
    members: string[];
  },
  teamUid: string,
  creatorId: string
) => {
  db.collection("users")
    .doc(creatorId)
    .set({ memberOf: teamUid }, { merge: true });
  return db
    .collection("teams")
    .doc(teamUid)
    .set({ teamUid, ...teamData });
};

export const deleteTeam = async (teamUid: string) => {
  const team = await db.collection("teams").doc(teamUid).get();
  const teamData = team.data();
  let teamMembers: string[] = [];

  let i: number;
  for (i = 0; i < teamData?.members.length; i++) {
    teamMembers.push(teamData?.members[i]);
  }
  for (i = 0; i < teamMembers.length; i++) {
    db.collection("users")
      .doc(teamMembers[i])
      .set({ memberOf: null }, { merge: true });
  }

  return db.collection("teams").doc(teamUid).delete();
};
