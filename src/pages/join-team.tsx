import { motion } from "framer-motion";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import { joinTeam } from "@/lib/db";
import UserBox from "@/components/UserBox";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import notify from "@/helpers/toastNotify";
import { NextSeo } from "next-seo";
import useSWR from "swr";
import { fetcherWithId } from "@/helpers/fetchers";
import ReactLoading from "react-loading";

const title: string = "Join Team - Flex Quotes";
const url: string = "https://flexquotes.vercel.app/join-team";

const schema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Team name is required.")
      .min(3, "Team name min length is 3 digits.")
      .max(15, "Team name max length is 15 digits.")
      .matches(
        /^[aA-zZ0-9аА-яЯіІґҐїЇєЄёЁ]+$/,
        "Team name is not in the correct format. (aA-zZ, аА-яЯ, 0-9)"
      ),
    teamId: yup
      .string()
      .required("Team ID is required.")
      .min(7, "Team ID length is 7 digits.")
      .max(7, "Team ID length is 7 digits.")
      .matches(
        /^[#][a-z0-9]+$/,
        "Team ID is not in the correct format. (#[a-z, 0-9])"
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

  const { data: team, isLoading: isLoadingTeam } = useSWR(
    session ? ["/api/team", session.user?.id] : null,
    fetcherWithId
  );

  const handleTeamJoin = (data: FormData) => {
    joinTeam({ ...data }, session?.user?.id as string)
      .then(() => reset())
      .then(() => notify("success", "You have joined the team!"))
      .then(() => router.push("/"))
      .catch(() =>
        notify("error", "An error has occurred. Check provided team data!")
      );
  };

  if (isLoadingTeam) {
    return (
      <>
        <NextSeo
          title={title}
          canonical={url}
          openGraph={{
            url,
            title,
          }}
        />
        <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2">
          <ReactLoading
            type={"spinningBubbles"}
            color={"#67e8f9"}
            height={100}
            width={100}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <NextSeo
        title={title}
        canonical={url}
        openGraph={{
          url,
          title,
        }}
      />
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        className="p-4 flex flex-col justify-between items-center h-screen"
      >
        <header>
          <h1 className="text-5xl md:text-6xl text-center font-thin capitalize">
            Join Team
          </h1>
          <UserBox displayBack />
        </header>
        <motion.main
          animate={{ x: 0 }}
          initial={{ x: 200 }}
          className="flex flex-col justify-center items-center w-full gap-8 md:gap-16 py-8"
        >
          {team?.length ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="bg-zinc-800 p-4 rounded-md text-center text-2xl font-light font-mono">
                You are already member of a team
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleTeamJoin)}
              className={`${
                errors.name || errors.passcode || errors.teamId
                  ? "border-red-500 border"
                  : null
              } bg-zinc-800 p-2 sm:p-4 rounded-md flex flex-col gap-4 justify-center items-center`}
            >
              <div className="flex max-w-[258px] flex-col justify-center items-center">
                <label
                  htmlFor="nameInput"
                  className={`${errors.name && "text-red-500"} text-xl w-full`}
                >
                  Enter team name
                </label>
                <input
                  {...register("name")}
                  autoComplete="off"
                  placeholder="MyTeam123"
                  type="text"
                  className={`${
                    errors.name && "border border-red-600 rounded-b-none"
                  } w-full rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
                  id="nameInput"
                />
                {errors.name && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    initial={{ height: 0, opacity: 0 }}
                    className="text-center w-full border border-dashed border-t-0 rounded-t-none border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
                  >
                    <p className="p-1">{errors.name?.message}</p>
                  </motion.div>
                )}
              </div>
              <div className="flex max-w-[258px] flex-col justify-center items-center">
                <label
                  htmlFor="teamIdInput"
                  className={`${
                    errors.teamId && "text-red-500"
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
                    errors.teamId && "border border-red-600 rounded-b-none"
                  } w-full rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
                  id="teamIdInput"
                />
                {errors.teamId && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    initial={{ height: 0, opacity: 0 }}
                    className="text-center w-full border border-dashed border-t-0 rounded-t-none border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
                  >
                    <p className="p-1">{errors.teamId?.message}</p>
                  </motion.div>
                )}
              </div>
              <div className="flex max-w-[258px] flex-col justify-center items-center">
                <label
                  htmlFor="passcodeInput"
                  className={`${
                    errors.passcode && "text-red-500"
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
                    errors.passcode && "border border-red-600 rounded-b-none"
                  } w-full rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
                  id="passcodeInput"
                />
                {errors.passcode && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    initial={{ height: 0, opacity: 0 }}
                    className="text-center w-full border border-dashed border-t-0 rounded-t-none border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
                  >
                    <p className="p-1">{errors.passcode?.message}</p>
                  </motion.div>
                )}
              </div>
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
          )}
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
