import notify from "@/helpers/toastNotify";
import { deleteQuote } from "@/lib/db";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import React, { FC } from "react";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { mutate } from "swr";

interface quote {
  id: string;
  teamUid: string;
  authorUid: string;
  image: string;
  name: string;
  text: string;
  createdAt: string;
  rating: number;
}

const Quote: FC<{
  allQuotes: quote[];
  quote: quote;
  displayDelete: boolean;
}> = ({ displayDelete, quote, allQuotes }) => {
  const handleQuoteDelete = () => {
    const filteredQuotes: quote[] | [] = allQuotes.filter((el) => el !== quote);

    deleteQuote(quote.id)
      .then(() => mutate(["/api/quotes", quote.teamUid], filteredQuotes, true))
      .then(() => notify("info", "Quote was deleted."))
      .catch(() => notify("error", "An unexpected error has occured."));
  };

  return (
    <div className="p-4 pb-2 bg-zinc-800 even:bg-[#313135] w-full">
      <div className="flex flex-col md:flex-row justify-between items-end gap-2">
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
        <p className="text-sm text-center mt-2 text-zinc-400">
          {format(parseISO(quote.createdAt), "PPpp")}
        </p>
      </div>
      <p className="w-full p-2 bg-zinc-700 mt-4 rounded-md">{quote.text}</p>
      <div className="flex justify-between items-center mt-2">
        {/* // todo rating */}
        <button></button>
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
