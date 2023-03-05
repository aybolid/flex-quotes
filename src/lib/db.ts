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

export const leaveTeam = async (teamUid: string, userUid: string) => {
  const team = await db.collection("teams").doc(teamUid).get();
  const teamData = team.data();

  let teamMembers: string[] = [];

  let i: number;
  for (i = 0; i < teamData?.members.length; i++) {
    teamMembers.push(teamData?.members[i]);
  }
  let filteredTeamMembers: string[] = teamMembers.filter(
    (member) => member !== userUid
  );
  db.collection("users").doc(userUid).set({ memberOf: null }, { merge: true });

  return db
    .collection("teams")
    .doc(teamUid)
    .set({ members: filteredTeamMembers }, { merge: true });
};

export const joinTeam = async (
  joinData: {
    name: string;
    teamId: string;
    passcode: string;
  },
  userUid: string
) => {
  const snapshot = await db
    .collection("teams")
    .where("name", "==", joinData.name)
    .where("teamId", "==", joinData.teamId)
    .where("passcode", "==", joinData.passcode)
    .get();

  const teams: {
    creatorId: string;
    members: string[];
    name: string;
    passcode: string;
    teamId: string;
    teamUid: string;
  }[] = [];
  snapshot.forEach((doc) =>
    teams.push({
      ...(doc.data() as {
        creatorId: string;
        members: string[];
        name: string;
        passcode: string;
        teamId: string;
        teamUid: string;
      }),
    })
  );

  db.collection("users")
    .doc(userUid)
    .set({ memberOf: teams[0].teamUid }, { merge: true });

  return db
    .collection("teams")
    .doc(teams[0].teamUid)
    .set({ members: teams[0].members.concat(userUid) }, { merge: true });
};
