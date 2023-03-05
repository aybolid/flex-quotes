import Head from "next/head";
import HomeLink from "@/components/Home/HomeLink";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FaSignInAlt } from "react-icons/fa";
import useSWR from "swr";
import { fetcherWithId } from "@/helpers/fetchers";
import ReactLoading from "react-loading";

let greets: string[] = [
  "Nice to see you, ",
  "Welcome, ",
  "Glad you're with us, ",
  "Lovely to meet you, ",
];

const Home = () => {
  const { data: session } = useSession();

  const { data: team, isLoading } = useSWR(
    session ? ["/api/team", session.user?.id] : null,
    fetcherWithId
  );

  if (session)
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
              Flex Quotes
            </h1>
            <div className="flex flex-col justify-center items-center mt-8 gap-2">
              <div className="rounded-full overflow-hidden w-16">
                <Image
                  src={session.user?.image!}
                  alt="User"
                  width={300}
                  height={300}
                  unoptimized
                />
              </div>
              <p>
                {greets[Math.floor(Math.random() * greets.length)]}
                <span className="text-cyan-300">{session.user?.name}</span>
              </p>
              <button
                onClick={() => signOut()}
                className="text-red-500 hover:underline mt-2"
              >
                Sign out
              </button>
            </div>
          </header>
          {isLoading ? (
            <main className="flex justify-center items-center">
              <ReactLoading
                type={"spinningBubbles"}
                color={"#67e8f9"}
                height={100}
                width={100}
              />
            </main>
          ) : team?.length ? (
            <motion.main
              animate={{ x: 0 }}
              initial={{ x: 200 }}
              className="flex flex-col justify-center items-center gap-8 py-8"
            >
              <div className="grid grid-cols-1 gap-8 md:gap-16 md:grid-cols-2">
                <HomeLink href="/add" title="Add Quote 📝" />
                <HomeLink href="/" title="View Quotes 👀" />
                <HomeLink href="/my-team" title="My Team 🫂" />
                <HomeLink href="/" title="In Progress..." />
              </div>
            </motion.main>
          ) : (
            <motion.main
              animate={{ x: 0 }}
              initial={{ x: 200 }}
              className="flex flex-col justify-center items-center py-8"
            >
              <p className="mb-8 max-w-md text-center">
                Create a new team for you and your friends or join existing one
                in order to add and view funny quotes.
              </p>
              <nav className="grid grid-cols-1 gap-8 md:gap-16 md:grid-cols-2">
                <HomeLink href="/createteam" title="Create Team 🆕" />
                <HomeLink href="/" title="Join Team 🫂" />
              </nav>
            </motion.main>
          )}
          <footer>
            <p className="max-w-md mb-4 text-center">
              <span className="text-cyan-300">Flex Quotes</span> - website done
              for fun.
            </p>
          </footer>
        </motion.div>
      </>
    );

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
            Flex Quotes
          </h1>
        </header>
        <motion.main animate={{ x: 0 }} initial={{ x: 200 }}>
          <div className="bg-zinc-800 rounded-md p-8 flex flex-col justify-center items-center gap-10 border border-cyan-400 outline outline-8 outline-zinc-800">
            <p className="text-lg text-center">Sign in to view site content.</p>
            <button onClick={() => signIn()} className="btn-primary">
              Sign in <FaSignInAlt className="mt-1" />
            </button>
          </div>
        </motion.main>
        <footer>
          <p className="max-w-md mb-4 text-center">
            <span className="text-cyan-300">Flex Quotes</span> - website done
            for fun.
          </p>
        </footer>
      </motion.div>
    </>
  );
};

export default Home;
