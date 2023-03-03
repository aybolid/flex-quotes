import { useState } from "react";
import Head from "next/head";
import HomeLink from "@/components/Home/HomeLink";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FaSignInAlt } from "react-icons/fa";

let greets: string[] = [
  "Nice to see you, ",
  "Welcome, ",
  "Glad you're with us, ",
  "Lovely to meet you, ",
];

const Home = () => {
  const { data: session } = useSession();

  // ! use for test
  const [userInTeam, setUserInTeam] = useState<boolean>(true);
  // !

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
          {session && (
            <div className="flex flex-col justify-center items-center mt-8 gap-4">
              <div className="rounded-full overflow-hidden w-16">
                <Image
                  src={session.user?.image!}
                  alt="User Photo"
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
                className="text-red-500 hover:underline"
              >
                Sign out
              </button>
            </div>
          )}
        </header>
        {session ? (
          userInTeam ? (
            <motion.main
              animate={{ x: 0 }}
              initial={{ x: 200 }}
              className="grid grid-cols-1 gap-8 md:gap-16 md:grid-cols-2 py-8"
            >
              <HomeLink href="/add" title="Add Quote 📝" />
              <HomeLink href="/" title="View Quotes 👀" />
              <HomeLink href="/" title="In Progress 🛠️" />
              <HomeLink href="/" title="In Progress 🛠️" />
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
                <HomeLink href="/" title="Create Team 🆕" />
                <HomeLink href="/" title="Join Team 🫂" />
              </nav>
            </motion.main>
          )
        ) : (
          <motion.main animate={{ x: 0 }} initial={{ x: 200 }}>
            <div className="bg-zinc-800 rounded-md p-4 flex flex-col justify-center items-center gap-10">
              <p className="text-lg text-center">
                Sign in to view site content.
              </p>
              <button onClick={() => signIn()} className="btn-primary">
                Sign in <FaSignInAlt className="mt-1" />
              </button>
            </div>
          </motion.main>
        )}
        <footer>
          <p className="max-w-md text-center">
            <span className="text-cyan-300">Flex Quotes</span> - website done
            for fun.
          </p>
        </footer>
      </motion.div>
    </>
  );
};

export default Home;
