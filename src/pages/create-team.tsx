import Head from "next/head";
import { motion } from "framer-motion";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


import notify from "@/helpers/toastNotify";
import { createTeam } from "@/lib/db";
import UserBox from "@/components/UserBox";

const schema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Team name is required.")
      .min(3, "Team name min length is 3 digits.")
      .max(15, "Team name max length is 15 digits.")
      .matches(
        /^[aA-zZ0-9аА-яЯіІґҐїЇєЄ]+$/,
        "Team name is not in the correct format. (aA-zZ, аА-яЯ, 0-9)"
      ),
    passcode: yup
      .string()
      .trim()
      .required("Passcode is required.")
      .min(3, "Passcode min length is 3 digits.")
      .max(15, "Passcode max length is 15 digits.")
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

  const handleTeamCreate = (data: FormData) => {
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
      .then(() => notify("success", "Team was created successfully!"))
      .then(() => router.push("/"))
      .catch(() => notify("error", "An unexpected error has occurred."));
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
                htmlFor="passcodeInput"
                className={`${
                  errors.passcode?.message && "text-red-500"
                } text-xl w-full`}
              >
                Create passcode
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
