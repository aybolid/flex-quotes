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

const schema = yup
  .object({
    text: yup
      .string()
      .trim()
      .required("Quote text is required.")
      .min(3, "Quote text min length is 3 digits.")
      .max(500, "Quote text max length is 500 digits.")
      .matches(
        /^[aA-zZ0-9аА-яЯіІґҐїЇєЄ!.,;:?()=+-_ ]+$/,
        "Team name is not in the correct format."
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
    team?.length ? ["/api/team-members", team[0].teamUid] : null,
    fetcherWithId
  );

  const handleQuoteAdd = (data: FormData) => {
    if (!author) {
      notify("warning", "Quote author must be selected!");
      return;
    }
    const newQuote: { text: string; author: string; createdAt: string } = {
      author: author.split(" ")[0],
      createdAt: new Date().toISOString(),
      ...data,
    };
    console.log(newQuote);
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
    let options: { value: string; label: ReactElement }[] = [];
    for (let i = 0; i < teamMembers.length; i++) {
      const option: { value: string; label: ReactElement } = {
        value: `${teamMembers[i].id} ${teamMembers[i].name}`,
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
            <div
              className={`${
                errors.text ? "border-red-500" : "border-cyan-400"
              } p-6 bg-zinc-800 sm:w-1/3 rounded-md border outline outline-8 outline-zinc-800`}
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
                    options={options}
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
                    } w-full min-h-[80px] max-h-52 rounded-md bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
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
                <div className="flex justify-between items-center w-full mt-8">
                  <span
                    onClick={() => router.back()}
                    className="btn-primary cursor-pointer"
                  >
                    <MdArrowBackIosNew className="mt-[0.9px]" />
                    Go back
                  </span>
                  <button type="submit" className="btn-submit">
                    Add
                  </button>
                </div>
              </form>
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
  }
};

export default AddQuote;
