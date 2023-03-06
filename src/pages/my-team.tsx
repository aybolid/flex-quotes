import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import UserBox from "@/components/UserBox";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcherWithId } from "@/helpers/fetchers";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { RiDeleteBin5Fill, RiUser3Fill, RiVipCrownFill } from "react-icons/ri";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { BiExit } from "react-icons/bi";
import ReactLoading from "react-loading";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Link from "next/link";
import { deleteTeam, leaveTeam } from "@/lib/db";
import notify from "@/helpers/toastNotify";
import ChangeTeamInfoModal from "@/components/Modals/ChangeTeamInfoModal";

const CreateTeam = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [displayCode, setDisplayCode] = useState<boolean>(false);
  const [displayChangeInfoModal, setDisplayChangeInfoModal] =
    useState<boolean>(false);

  const { data: team, isLoading: isLoadingTeam } = useSWR(
    session ? ["/api/team", session.user?.id] : null,
    fetcherWithId
  );
  const { data: teamMembers, isLoading: isLoadingMembers } = useSWR(
    team?.length ? ["/api/team-members", team[0].teamUid] : null,
    fetcherWithId
  );

  const handleTeamDelete = () => {
    deleteTeam(team[0].teamUid)
      .then(() => notify("info", `The '${team[0].name}' team was deleted.`))
      .then(() => router.push("/"))
      .catch(() => notify("error", "An unexpected error has occured."));
  };
  const handleTeamLeave = () => {
    leaveTeam(team[0].teamUid, session?.user?.id as string)
      .then(() => notify("info", `You have left the '${team[0].name}' team.`))
      .then(() => router.push("/"))
      .catch(() => notify("error", "An unexpected error has occured."));
  };

  if (isLoadingTeam || isLoadingMembers) {
    return (
      <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2">
        <ReactLoading
          type={"spinningBubbles"}
          color={"#67e8f9"}
          height={100}
          width={100}
        />
      </div>
    );
  }
  if (team?.length && teamMembers?.length) {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          className="p-4 flex flex-col justify-between items-center h-screen"
        >
          <header>
            <h1 className="text-5xl md:text-6xl text-center font-thin capitalize">
              My Team
            </h1>
            <UserBox displayBack />
          </header>
          <motion.main
            animate={{ x: 0 }}
            initial={{ x: 200 }}
            className="flex flex-col justify-center items-center w-full gap-8 md:gap-16 py-8"
          >
            <div className="p-6 bg-zinc-800 rounded-md border border-cyan-300 outline outline-8 outline-zinc-800">
              <section className="mb-8">
                <h2 className="flex justify-center items-end gap-2 text-3xl text-cyan-300">
                  {team[0].name}
                  <CopyToClipboard text={team[0].teamId}>
                    <button
                      onClick={() =>
                        notify("info", "Team ID was copied to clipboard.")
                      }
                      className="font-thin text-zinc-500 text-lg hover:text-zinc-200 ease-in-out duration-300"
                    >
                      {team[0].teamId}
                    </button>
                  </CopyToClipboard>
                </h2>
                <p className="mt-2 flex justify-center items-center gap-2">
                  {displayCode ? (
                    <>
                      Passcode:{" "}
                      <span className="text-cyan-300">{team[0].passcode}</span>
                      <button
                        onClick={() => setDisplayCode(false)}
                        title="Hide team passcode"
                        className="text-zinc-500 hover:text-zinc-200"
                      >
                        <BsEyeSlashFill className="mt-[3px]" size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      Passcode:{" "}
                      <span className="text-cyan-300">
                        {"#".repeat(team[0].passcode.length)}
                      </span>
                      <button
                        onClick={() => setDisplayCode(true)}
                        title="Show team passcode"
                        className="text-zinc-500 hover:text-zinc-200"
                      >
                        <BsEyeFill className="mt-[3px]" size={20} />
                      </button>
                    </>
                  )}
                </p>
              </section>
              <section className="mt-4">
                <h3 className="text-lg mb-1 font-thin md:text-xl">Actions</h3>
                <div className="grid grid-cols-2 grid-flow-row justify-between items-center gap-4">
                  <Link href="/team/add-quote" className="btn-primary">
                    Add Quote 📝
                  </Link>
                  <Link href="/team/view-quotes" className="btn-primary">
                    View Quotes 👀
                  </Link>
                  {team[0].creatorId === session?.user?.id && (
                    <>
                      <button
                        onClick={() => setDisplayChangeInfoModal(true)}
                        className="btn-primary"
                      >
                        Change Info ✒️
                      </button>
                    </>
                  )}
                </div>
              </section>
              <div className="mt-4">
                <h3 className="text-lg mb-1 font-thin md:text-xl">
                  Team Members
                </h3>
                <section className="bg-zinc-900 p-4 rounded-md grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-80 overflow-x-hidden overflow-y-auto gap-4">
                  {teamMembers.map(
                    (member: {
                      id: string;
                      name: string;
                      email: string;
                      image: string;
                      memberOf: string;
                      emailVerified: boolean;
                    }) => (
                      <div
                        className="relative flex flex-col justify-center items-center p-2 rounded-md bg-zinc-800"
                        key={member.id}
                      >
                        <div className="relative rounded-full overflow-hidden w-14 h-14">
                          <Image
                            src={member.image}
                            width={300}
                            height={300}
                            alt="Member"
                            unoptimized
                          />
                        </div>
                        <p className="flex flex-col justify-center text-center items-center gap-1">
                          {member.name}
                          {team[0].creatorId === member.id ? (
                            <RiVipCrownFill
                              title="Leader"
                              className="text-yellow-400"
                            />
                          ) : (
                            <RiUser3Fill
                              title="Member"
                              className="text-zinc-400"
                            />
                          )}
                        </p>
                      </div>
                    )
                  )}
                </section>
              </div>
              <div className="mt-4">
                <h3 className="text-lg md:text-xl text-red-500 mb-1 font-thin flex justify-between items-end">
                  Danger Zone
                  <p className="text-sm font-mono text-red-500">x2 click</p>
                </h3>
                <section className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4 p-4 rounded-md border border-dashed border-red-500">
                  <button
                    onDoubleClick={handleTeamLeave}
                    className="btn-danger"
                  >
                    Leave Team <BiExit size={25} className="mt-[2px]" />
                  </button>
                  {team[0].creatorId === session?.user?.id && (
                    <>
                      <button
                        onDoubleClick={handleTeamDelete}
                        className="btn-danger"
                      >
                        Delete Team <RiDeleteBin5Fill className="mt-[2px]" />
                      </button>
                    </>
                  )}
                </section>
              </div>
            </div>
          </motion.main>
          <footer>
            <p className="max-w-md mb-4 text-center">
              <span className="text-cyan-300">Flex Quotes</span> - website done
              for fun.
            </p>
          </footer>
        </motion.div>
        {/* Modal */}
        {displayChangeInfoModal && (
          <ChangeTeamInfoModal
            displayModal={setDisplayChangeInfoModal}
            team={{
              passcode: team[0].passcode,
              name: team[0].name,
              uid: team[0].teamUid,
            }}
          />
        )}
      </>
    );
  }
};

export default CreateTeam;
