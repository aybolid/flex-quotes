import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import UserBox from "@/components/UserBox";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcherWithId } from "@/helpers/fetchers";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { RiDeleteBin5Fill, RiVipCrownFill } from "react-icons/ri";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import ReactLoading from "react-loading";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Link from "next/link";
import { deleteTeam } from "@/lib/db";

const CreateTeam = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [copied, setCopied] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copied]);
  const [displayCode, setDisplayCode] = useState<boolean>(false);

  const { data: team, isLoading: isLoadingTeam } = useSWR(
    session ? ["/api/team", session.user?.id] : null,
    fetcherWithId
  );
  const { data: teamMembers, isLoading: isLoadingMembers } = useSWR(
    team?.length ? ["/api/team-members", team[0].teamUid] : null,
    fetcherWithId
  );

  const handleTeamDelete = () => {
    deleteTeam(team[0].teamUid).then(() => router.push("/"));
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
            <UserBox />
          </header>
          <motion.main
            animate={{ x: 0 }}
            initial={{ x: 200 }}
            className="flex flex-col justify-center items-center w-full gap-8 md:gap-16 py-8"
          >
            <div className="p-4 bg-zinc-800 rounded-md">
              <section className="mb-8">
                <h4 className="flex justify-center items-end gap-2 text-3xl text-cyan-300">
                  {team[0].name}
                  <CopyToClipboard text={team[0].teamId}>
                    <button
                      onClick={() => setCopied(true)}
                      className="font-thin text-zinc-500 text-lg hover:text-zinc-200 ease-in-out duration-300"
                    >
                      {!copied ? team[0].teamId : "Copied!"}
                    </button>
                  </CopyToClipboard>
                </h4>
                <p className="mt-2 flex justify-center items-center gap-2">
                  {displayCode ? (
                    <>
                      Team passcode:{" "}
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
                      Team passcode:{" "}
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
                <h3 className="text-xl mb-1 font-thin">Actions</h3>
                <div className="flex justify-between items-center gap-4">
                  <Link href="/add" className="btn-primary">
                    Add Quote 📝
                  </Link>
                  <Link href="/" className="btn-primary">
                    View Quotes 👀
                  </Link>
                </div>
              </section>
              <div className="mt-4">
                <h3 className="text-xl mb-1 font-thin">Team Members</h3>
                <section className="bg-zinc-900 p-4 rounded-md grid grid-cols-4 gap-2">
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
                        className="flex flex-col justify-center items-center"
                        key={member.email}
                      >
                        <div className="rounded-full overflow-hidden w-14 h-14">
                          <Image
                            src={member.image}
                            width={300}
                            height={300}
                            alt="Member"
                            unoptimized
                          />
                        </div>
                        <p className="flex justify-center items-center gap-1">
                          {member.name}{" "}
                          {team[0].creatorId === member.id && (
                            <RiVipCrownFill className="text-yellow-300 mt-[0.5px]" />
                          )}
                        </p>
                      </div>
                    )
                  )}
                </section>
              </div>
              {team[0].creatorId === session?.user?.id && (
                <div className="mt-4">
                  <h3 className="text-xl text-red-500 mb-1 font-thin">
                    Danger Zone
                  </h3>
                  <section className="flex justify-center items-center gap-4 p-4 rounded-md border border-dashed border-red-500">
                    <button
                      onClick={handleTeamDelete}
                      className="btn-danger text-red-400 border-red-400"
                    >
                      Delete Team <RiDeleteBin5Fill className="mt-[2px]" />
                    </button>
                  </section>
                </div>
              )}
            </div>
          </motion.main>
          <footer>
            <p className="max-w-md text-center">
              <span className="text-cyan-300">Flex Quotes</span> - website done
              for fun.
            </p>
          </footer>
        </motion.div>
      </>
    );
  }
};

export default CreateTeam;
