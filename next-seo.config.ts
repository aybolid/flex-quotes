const title = "Flex Quotes - make fun of someone's phrases";
const description =
  "Flex Quotes is a tool to add and view funny quotes of you and your friends. Read silly quotes out of context. It's ridiculous!";

const SEO = {
  title,
  description,
  cononical: "https://flexquotes.vercel.app",
  opanGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://flexquotes.vercel.app",
    title,
    description,
    images: [
      {
        url: "https://flexquotes.vercel.app/og.jpg",
        alt: title,
        width: 1280,
        height: 640,
      },
    ],
  },
};

export default SEO;
