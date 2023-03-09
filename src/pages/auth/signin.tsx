import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import { SiDiscord, SiGithub } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";

const title: string = "Sign In - Flex Quotes";
const url: string = "https://flexquotes.vercel.app/auth/signin";

const errors: any = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const query = router.query as unknown as any;

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
            Sign In
          </h1>
        </header>
        <motion.main
          animate={{ x: 0 }}
          initial={{ x: 200 }}
          className="flex flex-col justify-center items-center w-full gap-8 md:gap-16 py-4 md:py-8"
        >
          <section className={`${query.error && 'border border-red-500'} bg-zinc-800 rounded-md p-2 md:p-4 flex flex-col justify-center items-center gap-8`}>
            <div className="flex flex-col justify-center items-center">
              <div className="w-20 h-20">
                <Image src={logo} width={300} height={300} alt="Logo" />
              </div>
              <h2 className="text-4xl font-thin text-center">Flex Quotes</h2>
            </div>
            <div className="flex flex-col max-w-xs justify-center items-center gap-4">
              {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <button
                    className="btn-primary normal-case flex justify-center items-center"
                    onClick={() => signIn(provider.id)}
                  >
                    Sign in with {provider.name}{" "}
                    {provider.name === "Discord" && (
                      <SiDiscord size={28} className="mt-1" />
                    )}
                    {provider.name === "Google" && <FcGoogle size={28} />}
                    {provider.name === "GitHub" && (
                      <SiGithub size={28} className="mt-1" />
                    )}
                  </button>
                </div>
              ))}
              {query.error && (
                <div className="bg-zinc-900 p-2 md:p-4 rounded-md border border-dashed border-red-500">
                  <p className="text-center font-mono text-red-500">
                    {errors[query.error] ?? errors.default}
                  </p>
                </div>
              )}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
