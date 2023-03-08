import { dbQuote } from "@/interfaces/quotes";
import { team } from "@/interfaces/teams";
import { compareAsc, compareDesc, parseISO } from "date-fns";
import { FC, useState } from "react";
import { Session } from "next-auth";
import Quote from "./Quote";
import ReactPaginate from "react-paginate";

const QuotesFilterSort: FC<{
  quotes: dbQuote[];
  team: team[];
  sortDesc: boolean;
  session: Session;
  author: string;
}> = ({ quotes, team, sortDesc, session, author }) => {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + 10;
  const currentItems = quotes.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(quotes.length / 10);

  const handlePageClick = (event: any) => {
    // Scroll to top
    const isBrowser = () => typeof window !== "undefined";
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });

    const newOffset = (event.selected * 10) % quotes.length;
    setItemOffset(newOffset);
  };

  return (
    <div>
      {currentItems
        .filter((quote: any) => quote.authorUid === author)
        .sort((a: any, b: any) =>
          sortDesc
            ? compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
            : compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
        )
        .map((quote) => (
          <Quote
            key={quote.id}
            allQuotes={quotes}
            quote={quote}
            displayDelete={
              team[0].creatorId === session?.user?.id ? true : false
            }
          />
        ))}
      <ReactPaginate
        className="flex justify-center items-center gap-4 font-semibold mt-4 w-full bg-zinc-800 p-2"
        pageLinkClassName="bg-zinc-700 hover:bg-zinc-600 rounded-md px-2 py-1 ease-in-out duration-150"
        activeLinkClassName="bg-zinc-500 hover:bg-zinc-500 rounded-md px-2 py-1 ease-in-out duration-150"
        previousClassName="bg-zinc-700 hover:bg-zinc-600 rounded-md px-2 py-1 ease-in-out duration-150"
        nextClassName="bg-zinc-700 hover:bg-zinc-600 rounded-md px-2 py-1 ease-in-out duration-150"
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null!}
      />
    </div>
  );
};

export default QuotesFilterSort;
