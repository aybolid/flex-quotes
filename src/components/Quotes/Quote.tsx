import notify from "@/helpers/toastNotify";
import { dbQuote } from "@/interfaces/quotes";
import { deleteQuote, rateQuote } from "@/lib/db";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { FC, useState } from "react";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { mutate } from "swr";

const Quote: FC<{
  allQuotes: dbQuote[];
  quote: dbQuote;
  displayDelete: boolean;
}> = ({ displayDelete, quote, allQuotes }) => {
  const { data: session } = useSession();

  const [rating, setRating] = useState<number>(quote.rating);

  const handleQuoteRate = () => {
    const filteredQuotes: dbQuote[] = allQuotes.filter((el) => el !== quote);
    const userUid: string = session?.user?.id as string;

    let updatedQuote: dbQuote;
    if (quote.ratedBy.includes(userUid)) {
      setRating(rating - 1)
      updatedQuote = {
        ...quote,
        rating: rating,
        ratedBy: quote.ratedBy.concat(userUid),
      };
    } else {
      setRating(rating + 1)
      updatedQuote = {
        ...quote,
        rating: rating,
        ratedBy: quote.ratedBy.filter((id) => id !== userUid),
      };
    }

    const newQuotes: dbQuote[] = filteredQuotes.concat(updatedQuote);

    rateQuote(quote.id, userUid).then(() =>
      mutate(["/api/quotes", quote.teamUid], newQuotes, true)
    );
  };

  const handleQuoteDelete = () => {
    const filteredQuotes: dbQuote[] | [] = allQuotes.filter(
      (el) => el !== quote
    );

    deleteQuote(quote.id)
      .then(() => mutate(["/api/quotes", quote.teamUid], filteredQuotes, true))
      .then(() => notify("info", "Quote was deleted."))
      .catch(() => notify("error", "An unexpected error has occured."));
  };

  return (
    <div className="p-2 md:p-4 pb-2 bg-zinc-800 even:bg-[#313135] w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 md:gap-2">
        <div className="flex justify-center items-center gap-2">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden">
            <Image
              src={quote.image}
              width={200}
              height={200}
              alt={"Author"}
              unoptimized
            />
          </div>
          <p className="text-cyan-300 text-xl">{quote.name}</p>
        </div>
        <p className="text-sm text-center mt- text-zinc-400">
          {format(parseISO(quote.createdAt), "PPpp")}
        </p>
      </div>
      <p className="w-full p-2 bg-zinc-700 mt-1 sm:mt-4 rounded-md">
        {quote.text}
      </p>
      <div className="flex justify-between items-center mt-2">
        {/* // todo rating */}
        <button
          onClick={handleQuoteRate}
          className={`${
            quote.ratedBy.includes(session?.user?.id as string)
              ? "bg-green-500 hover:bg-green-400"
              : "bg-zinc-700 hover:bg-zinc-600"
          } flex justify-center items-center gap-1 text-lg px-2 duration-300 ease-in-out rounded-full active:scale-95`}
        >
          {rating} 👍
        </button>
        <div>
          {displayDelete && (
            <button
              onClick={handleQuoteDelete}
              className="text-zinc-600 hover:text-red-500 active:text-red-700"
            >
              <RiDeleteBin7Fill />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quote;
