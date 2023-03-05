import { getUserTeam } from "@/lib/db-admin";
import { NextApiRequest, NextApiResponse } from "next";

const getTeamApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req.headers.id as string;
    const team = await getUserTeam(id);

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default getTeamApi;
