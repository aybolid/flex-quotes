import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-zinc-900 text-zinc-300 h-full w-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
