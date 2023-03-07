import Head from "next/head";
import { motion } from "framer-motion";
import UserBox from "@/components/UserBox";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcherWithId } from "@/helpers/fetchers";
import { useSession } from "next-auth/react";
import ReactLoading from "react-loading";
import Select from "react-select";
import Image from "next/image";
import { ReactElement, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { MdArrowBackIosNew } from "react-icons/md";
import notify from "@/helpers/toastNotify";
import { addNewQuote } from "@/lib/db";
import Link from "next/link";

const schema = yup
  .object({
    text: yup
      .string()
      .trim()
      .required("Quote text is required.")
      .min(3, "Quote text min length is 3 digits.")
      .max(500, "Quote text max length is 500 digits.")
      .matches(
        /^[aA-zZ0-9аА-яЯіІґҐїЇєЄёЁ!.,;:?()=+-_ ]+$/,
        "Quote text is not in the correct format."
      ),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const AddQuote = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [author, setAuthor] = useState<string>("");

  const { data: team, isLoading: isLoadingTeam } = useSWR(
    session ? ["/api/team", session.user?.id] : null,
    fetcherWithId
  );
  const { data: teamMembers, isLoading: isLoadingMembers } = useSWR(
    team?.length ? ["/api/members", team[0].teamUid] : null,
    fetcherWithId
  );

  const handleQuoteAdd = (data: FormData) => {
    if (!author) {
      notify("warning", "Quote author must be selected!");
      return;
    }

    const authorArray: string[] = author.split("*");
    const newQuote: {
      teamUid: string;
      authorUid: string;
      image: string;
      name: string;
      text: string;
      createdAt: string;
      rating: number;
    } = {
      teamUid: team[0].teamUid,
      authorUid: authorArray[0],
      image: authorArray[1],
      name: authorArray[2],
      createdAt: new Date().toISOString(),
      rating: 0,
      ...data, // quote text
    };
    addNewQuote(newQuote)
      .then(() => reset())
      .then(() => notify("success", "New quote was added successfully!"))
      .catch(() => notify("error", "Unexpected error has occurred."));
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
    //* Create select options based on team members
    const getSelectOptions = () => {
      let options: { value: string; label: ReactElement }[] = [];
      for (let i = 0; i < teamMembers.length; i++) {
        const option: { value: string; label: ReactElement } = {
          value: `${teamMembers[i].id}*${teamMembers[i].image}*${teamMembers[i].name}`,
          label: (
            <option className="flex justify-start items-center gap-2">
              <div className="w-8 h-8 rounded-full hidden min-[320px]:block overflow-hidden">
                <Image
                  src={teamMembers[i].image}
                  alt="Member"
                  width={100}
                  height={100}
                  unoptimized
                />
              </div>
              <p className="font-semibold">{teamMembers[i].name}</p>
            </option>
          ),
        };
        options.push(option);
      }
      return options;
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
              Add New Quote
            </h1>
            <UserBox displayBack={false} />
          </header>
          <motion.main
            animate={{ x: 0 }}
            initial={{ x: 200 }}
            className="flex flex-col justify-center items-center w-full gap-8 md:gap-16 py-8"
          >
            <div className="flex justify-center items-center flex-col md:flex-row gap-4">
              <Link href="/my-team" className="btn-primary w-full md:w-auto">
                My Team 🫂
              </Link>
              <Link href="/team/view-quotes" className="btn-primary">
                View Quotes 👀
              </Link>
            </div>
            <section
              className={`${
                errors.text ? "border-red-500" : "border-cyan-400"
              } p-6 bg-zinc-800 sm:w-2/3 rounded-md border outline outline-8 outline-zinc-800`}
            >
              <form
                onSubmit={handleSubmit(handleQuoteAdd)}
                className="flex flex-col gap-4 justify-center items-center"
              >
                <div className="flex w-full flex-col justify-start items-center">
                  <label className={`text-xl w-full`}>Author</label>
                  <Select
                    className="w-full my-react-select-container"
                    classNamePrefix="my-react-select"
                    placeholder="Select quote author..."
                    onChange={(author) => setAuthor(author?.value as string)}
                    options={getSelectOptions()}
                  />
                </div>
                <div className="flex w-full flex-col justify-center items-center">
                  <label
                    htmlFor="textInput"
                    className={`${
                      errors.text && "text-red-500"
                    } text-xl w-full`}
                  >
                    Text
                  </label>
                  <textarea
                    {...register("text")}
                    autoComplete="off"
                    placeholder="Quote text goes here..."
                    className={`${
                      errors.text && "border border-red-600 rounded-b-none"
                    } w-full min-h-[160px] md:min-h-[80px] max-h-52 rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
                    id="textInput"
                  />
                  {errors.text && (
                    <motion.div
                      animate={{ height: "auto", opacity: 1 }}
                      initial={{ height: 0, opacity: 0 }}
                      className="text-center w-full border border-dashed border-t-0 rounded-t-none border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
                    >
                      <p className="p-1">{errors.text?.message}</p>
                    </motion.div>
                  )}
                </div>
                {author && watch("text") && (
                  <motion.section
                    animate={{ height: "fit-content", opacity: 1 }}
                    initial={{ height: 0, opacity: 0 }}
                    className="w-full"
                  >
                    <h3 className="text-2xl text-cyan-300">Quote Preview</h3>
                    <div className="rounded-md border border-dashed border-cyan-300 mt-2">
                      <div className="p-4 bg-zinc-800 even:bg-[#313135] w-full rounded-md">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-2">
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden">
                              <Image
                                src={author.split("*")[1]}
                                width={200}
                                height={200}
                                alt={"Author"}
                                unoptimized
                              />
                            </div>
                            <p className="text-cyan-300 text-xl">
                              {author.split("*")[2]}
                            </p>
                          </div>
                          <p className="text-sm text-center mt-2 text-zinc-400">
                            {"Apr 29, 1453, 12:00:00 AM"}
                          </p>
                        </div>
                        <p className="w-full p-2 bg-zinc-700 mt-4 rounded-md">
                          {watch("text")}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                )}
                <div className="flex justify-between items-center w-full mt-8">
                  <span
                    onClick={() => router.back()}
                    className="btn-danger cursor-pointer"
                  >
                    <MdArrowBackIosNew className="mt-[0.9px]" />
                    Go back
                  </span>
                  <button type="submit" className="btn-submit">
                    Add
                  </button>
                </div>
              </form>
            </section>
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
  }
};

export default AddQuote;
