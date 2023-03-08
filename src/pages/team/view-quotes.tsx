import { motion } from "framer-motion";
import UserBox from "@/components/UserBox";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcherWithId } from "@/helpers/fetchers";
import { useSession } from "next-auth/react";
import ReactLoading from "react-loading";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Select from "react-select";
import Image from "next/image";
import { dbQuote } from "@/interfaces/quotes";
import QuotesSort from "@/components/Quotes/QuotesSort";
import QuotesFilterSort from "@/components/Quotes/QuotesFilterSort";
import { NextSeo } from "next-seo";

const title: string = "View Quotes - Flex Quotes";
const url: string = "https://flexquotes.vercel.app/team/view-quotes";

const ViewQuotes = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Sort and filter
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [author, setAuthor] = useState<string>("");

  const { data: team, isLoading: isLoadingTeam } = useSWR(
    session ? ["/api/team", session.user?.id] : null,
    fetcherWithId
  );

  const { data: teamMembers, isLoading: isLoadingMembers } = useSWR(
    team?.length ? ["/api/members", team[0].teamUid] : null,
    fetcherWithId
  );
  const { data: quotes, isLoading: isLoadingQuotes } = useSWR(
    team?.length ? ["/api/quotes", team[0].teamUid] : null,
    fetcherWithId
  );

  if (isLoadingTeam || isLoadingQuotes || isLoadingMembers) {
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
  if (team?.length) {
    const getSelectOptions = () => {
      let options: { value: string; label: ReactElement }[] = [];
      for (let i = 0; i < teamMembers.length; i++) {
        const option: { value: string; label: ReactElement } = {
          value: `${teamMembers[i].id}*${teamMembers[i].name}`,
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
              View Quotes
            </h1>
            <UserBox displayBack />
          </header>
          <motion.main
            animate={{ x: 0 }}
            initial={{ x: 200 }}
            className="flex flex-col justify-center items-center w-full gap-8 md:gap-16 py-4 md:py-8"
          >
            <section className="p-2 md:p-4 bg-zinc-800 rounded-md w-full md:w-4/5 lg:w-3/5">
              <h3 className="text-lg mb-1 font-thin md:text-xl">Actions</h3>
              <div className="flex justify-center lg:justify-start items-center gap-4 mb-4">
                <Link href="/team/add-quote" className="btn-primary">
                  Add Quote 📝
                </Link>
                <Link href="/my-team" className="btn-primary">
                  My Team 🫂
                </Link>
              </div>
              <h3 className="text-lg mb-1 font-thin md:text-xl">Quotes</h3>
              <div className="bg-zinc-900 p-2 md:p-4 rounded-md flex flex-col w-full justify-center items-center">
                {quotes.length ? (
                  <div className="bg-zinc-800 w-full mb-2 md:mb-4 rounded-md flex flex-col sm:flex-row justify-between items-center gap-4 py-2 px-2">
                    <Select
                      className="w-full sm:w-3/5 my-react-select-container"
                      classNamePrefix="my-react-select"
                      placeholder="Select quote author..."
                      onChange={(author) =>
                        setAuthor(author?.value.split("*")[0] as string)
                      }
                      options={getSelectOptions()}
                      isClearable
                    />
                    <button
                      onClick={() => setSortDesc(!sortDesc)}
                      className="flex justify-center items-center font-bold gap-1 hover:text-cyan-300"
                    >
                      DATE{" "}
                      {sortDesc ? <TiArrowSortedDown /> : <TiArrowSortedUp />}
                    </button>
                  </div>
                ) : null}
                <div className="rounded-md overflow-hidden w-full">
                  {!quotes?.length ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <p className="bg-zinc-800 p-4 rounded-md text-center text-2xl font-light font-mono">
                        Your team has no quotes added!
                      </p>
                    </div>
                  ) : !author ? (
                    // ! Quotes with sort
                    <QuotesSort
                      team={team}
                      quotes={quotes}
                      sortDesc={sortDesc}
                      session={session!}
                    />
                  ) : // ! Check for valid data after filter
                  !quotes.filter((quote: dbQuote) => quote.authorUid === author)
                      .length ? (
                    <p className="w-full text-center font-mono text-zinc-500">
                      Nothing was found
                    </p>
                  ) : (
                    // ! Filtered quotes with sort
                    <QuotesFilterSort
                      team={team}
                      quotes={quotes}
                      sortDesc={sortDesc}
                      session={session!}
                      author={author}
                    />
                  )}
                </div>
              </div>
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

export default ViewQuotes;
