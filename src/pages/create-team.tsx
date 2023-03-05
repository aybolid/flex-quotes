import Head from "next/head";
import { motion } from "framer-motion";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import { createTeam } from "@/lib/db";
import UserBox from "@/components/UserBox";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

type Inputs = {
  name: string;
  passcode: string;
};

const CreateTeam = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const handleTeamCreate: SubmitHandler<Inputs> = (data) => {
    const userId = session?.user?.id as string;
    const newTeam: {
      name: string;
      teamId: string;
      passcode: string;
      creatorId: string;
      members: string[];
    } = {
      creatorId: userId,
      teamId: "#" + uuidv4().slice(0, 6),
      members: [userId],
      ...data,
    };

    createTeam(newTeam, uuidv4(), userId)
      .then(() => reset())
      .then(() => router.push("/"));
  };

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
            Create Your Team
          </h1>
          <UserBox />
        </header>
        <motion.main
          animate={{ x: 0 }}
          initial={{ x: 200 }}
          className="flex flex-col justify-center items-center w-full gap-8 md:gap-16 py-8"
        >
          <form
            onSubmit={handleSubmit(handleTeamCreate)}
            className="bg-zinc-800 p-8 rounded-md flex flex-col gap-4 justify-center items-center border border-cyan-400 outline outline-8 outline-zinc-800"
          >
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="nameInput" className="text-xl w-full">
                Team name
              </label>
              <input
                {...register("name", { required: true })}
                autoComplete="off"
                placeholder="MyTeam123"
                type="text"
                className="rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none"
                id="nameInput"
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="passcodeInput" className="text-xl w-full">
                Create team passcode
              </label>
              <input
                {...register("passcode", { required: true })}
                autoComplete="off"
                placeholder="passcodeexample"
                type="text"
                className="rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none"
                id="passcodeInput"
              />
            </div>
            <div className="w-full flex justify-between items-center mt-8">
              <Link href={"/"} className="btn-danger">
                <MdArrowBackIosNew className="mt-[0.9px]" />
                Go back
              </Link>
              <button type="submit" className="btn-submit">
                Create
              </button>
            </div>
          </form>
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

export default CreateTeam;
