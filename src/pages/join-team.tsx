import Head from "next/head";
import { motion } from "framer-motion";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import { createTeam, joinTeam } from "@/lib/db";
import UserBox from "@/components/UserBox";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Team name is required")
      .max(15, "Team name max length is 15 digits.")
      .matches(
        /^[aA-zZ0-9аА-яЯіІґҐїЇєЄ]+$/,
        "Team name is not in the correct format. (aA-zZ, аА-яЯ, 0-9)"
      ),
    teamId: yup
      .string()
      .required("Team ID is required")
      .min(7, "Team ID length is 7 digits.")
      .max(7, "Team ID length is 7 digits.")
      .matches(
        /^[#][a-z0-9]+$/,
        "Team ID is not in the correct format. (#[a-z, 0-9])"
      ),
    passcode: yup
      .string()
      .trim()
      .required("Passcode is required")
      .max(10, "Passcode max length is 10 digits.")
      .matches(
        /^[a-z0-9]+$/,
        "Passcode is not in the correct format. (a-z, 0-9)"
      ),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const CreateTeam = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleTeamJoin = (data: FormData) => {
    joinTeam({ ...data }, session?.user?.id as string);
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
            Join Team
          </h1>
          <UserBox />
        </header>
        <motion.main
          animate={{ x: 0 }}
          initial={{ x: 200 }}
          className="flex flex-col justify-center items-center w-full gap-8 md:gap-16 py-8"
        >
          <form
            onSubmit={handleSubmit(handleTeamJoin)}
            className="bg-zinc-800 p-8 rounded-md flex flex-col gap-4 justify-center items-center border border-cyan-400 outline outline-8 outline-zinc-800"
          >
            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="nameInput"
                className={`${
                  errors.name?.message && "text-red-500"
                } text-xl w-full`}
              >
                Enter team name
              </label>
              <input
                {...register("name")}
                autoComplete="off"
                placeholder="MyTeam123"
                type="text"
                className={`${
                  errors.name?.message && "border border-red-600"
                } rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
                id="nameInput"
              />
            </div>
            {errors.name?.message && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                initial={{ height: 0, opacity: 0 }}
                className="text-center w-full max-w-[258px] border border-dashed border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
              >
                <p className="p-1">{errors.name?.message}</p>
              </motion.div>
            )}
            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="teamIdInput"
                className={`${
                  errors.teamId?.message && "text-red-500"
                } text-xl w-full`}
              >
                Enter team ID
              </label>
              <input
                {...register("teamId")}
                autoComplete="off"
                placeholder="#teamid"
                type="text"
                className={`${
                  errors.teamId?.message && "border border-red-600"
                } rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
                id="teamIdInput"
              />
            </div>
            {errors.teamId?.message && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                initial={{ height: 0, opacity: 0 }}
                className="text-center w-full max-w-[258px] border border-dashed border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
              >
                <p className="p-1">{errors.teamId?.message}</p>
              </motion.div>
            )}
            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="passcodeInput"
                className={`${
                  errors.passcode?.message && "text-red-500"
                } text-xl w-full`}
              >
                Enter passcode
              </label>
              <input
                {...register("passcode")}
                autoComplete="off"
                placeholder="teampasscode12"
                type="text"
                className={`${
                  errors.passcode?.message && "border border-red-600"
                } rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
                id="passcodeInput"
              />
            </div>
            {errors.passcode?.message && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                initial={{ height: 0, opacity: 0 }}
                className="text-center w-full max-w-[258px] border border-dashed border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
              >
                <p className="p-1">{errors.passcode?.message}</p>
              </motion.div>
            )}
            <div className="w-full flex justify-between items-center mt-8">
              <Link href={"/"} className="btn-danger">
                <MdArrowBackIosNew className="mt-[0.9px]" />
                Go back
              </Link>
              <button type="submit" className="btn-submit">
                Join
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