import React from "react";
import Link from "next/link";

interface LinkProps {
  href: string;
  title: string;
}

const HomeLink: React.FC<LinkProps> = ({ href, title }) => {
  return (
    <Link
      className="select-none active:scale-95 active:shadow-none px-4 py-2 md:px-8 md:py-6 rounded-md shadow-2xl hover:shadow-cyan-900 bg-zinc-800 bg-opacity-75 hover:bg-opacity-100 outline-8 border-2 border-zinc-600 hover:border-cyan-500 hover:text-cyan-300 outline outline-zinc-800 ease-in-out duration-300"
      href={href}
    >
      <h4 className="text-2xl md:text-4xl font-semibold text-center capitalize">
        {title}
      </h4>
    </Link>
  );
};

export default HomeLink;
