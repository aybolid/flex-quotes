import { dbQuote, quote } from "@/interfaces/quotes";
import { team } from "@/interfaces/teams";
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

  // Delete quotes related to the team
  const quotesSnapshot = await db
    .collection("quotes")
    .where("teamUid", "==", teamUid)
    .get();
  let quotesIds: string[] = [];
  quotesSnapshot.forEach((doc) => quotesIds.push(doc.id));
  for (i = 0; i < quotesIds.length; i++) {
    db.collection("quotes").doc(quotesIds[i]).delete();
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

  // Delete team if last user left
  if (filteredTeamMembers.length === 0) {
    return deleteTeam(teamUid);
  }
  // Choose new team leader if previous team leader left
  if (!filteredTeamMembers.includes(teamData?.creatorId)) {
    db.collection("teams")
      .doc(teamUid)
      .set(
        {
          creatorId:
            filteredTeamMembers[
              Math.floor(Math.random() * filteredTeamMembers.length)
            ],
        },
        { merge: true }
      );
  }
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

  const teams: team[] = [];
  snapshot.forEach((doc) =>
    teams.push({
      ...(doc.data() as team),
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

export const changeTeamInfo = (
  teamUid: string,
  newData: { name: string; passcode: string }
) => {
  return db
    .collection("teams")
    .doc(teamUid)
    .set({ ...newData }, { merge: true });
};

export const addNewQuote = async (newQuote: quote) => {
  return db
    .collection("quotes")
    .doc()
    .set({ ...newQuote });
};

export const deleteQuote = (quoteId: string) => {
  return db.collection("quotes").doc(quoteId).delete();
};

export const rateQuote = async (quoteId: string, userUid: string) => {
  const quoteSnapshot = await db.collection("quotes").doc(quoteId).get();
  const quote = quoteSnapshot.data();
  if (quote?.ratedBy.includes(userUid)) {
    const newRate: number = quote.rating - 1;
    const filteredRatedBy = quote.ratedBy.filter(
      (uid: string) => uid !== userUid
    );

    db.collection("quotes")
      .doc(quoteId)
      .set({ ratedBy: filteredRatedBy }, { merge: true });
    return db
      .collection("quotes")
      .doc(quoteId)
      .set({ rating: newRate }, { merge: true });
  } else {
    const newRate: number = quote?.rating + 1;

    db.collection("quotes")
      .doc(quoteId)
      .set({ ratedBy: quote?.ratedBy.concat(userUid) }, { merge: true });
    return db
      .collection("quotes")
      .doc(quoteId)
      .set({ rating: newRate }, { merge: true });
  }
};
