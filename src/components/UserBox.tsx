import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

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
        <div className="mt-3">
          <button onClick={() => router.push('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBox;
