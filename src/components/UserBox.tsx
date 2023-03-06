import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { MdArrowBackIosNew } from "react-icons/md";

const UserBox: React.FC<{ displayBack: boolean }> = ({ displayBack }) => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="rounded-full overflow-hidden w-16">
        <Image
          src={session?.user?.image!}
          alt="User"
          width={300}
          height={300}
          unoptimized
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-cyan-300">{session?.user?.name}</p>
        <p>{session?.user?.email}</p>
      </div>
      <button
        onClick={() =>
          signOut({
            callbackUrl: `${window.location.origin}`,
          })
        }
        className="text-red-500 hover:underline mt-2"
      >
        Sign out
      </button>
      {displayBack && (
        <div className="hidden md:block mt-3">
          <button onClick={() => router.back()} className="btn-primary">
            <MdArrowBackIosNew className="mt-[0.9px]" />
            Go back
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBox;
