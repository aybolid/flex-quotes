import { getTeamQuotes } from "@/lib/db-admin";
import { NextApiRequest, NextApiResponse } from "next";

const getTeamQuotesApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const teamUid = req.headers.id as string;
    const team = await getTeamQuotes(teamUid);

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default getTeamQuotesApi;
