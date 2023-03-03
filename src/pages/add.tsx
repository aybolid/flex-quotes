import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { MdArrowBackIosNew } from "react-icons/md";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  text: string;
};

const AddQuote = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        className="p-4 flex flex-col justify-between items-center h-screen"
      >
        <header className="flex flex-col justify-center items-center gap-10">
          <h1 className="text-5xl md:text-6xl font-thin capitalize">
            Add New Quote
          </h1>
          <button onClick={() => router.back()} className="btn-primary">
            <MdArrowBackIosNew className="mt-[0.9px]" />
            Go back
          </button>
        </header>
        <motion.main
          animate={{ x: 0 }}
          initial={{ x: 200 }}
          className="py-4 mt-4 flex flex-col justify-center items-center gap-4"
        >
          <form
            className="bg-zinc-800 p-4 flex flex-col justify-center items-center max-h-80 w-23"
            onSubmit={handleSubmit(onSubmit)}
          >
            <textarea
              {...register("text", { required: true })}
              className="bg-zinc-700"
            />
            <div className="w-full flex justify-end items-center mt-4">
              <button type="submit">Add</button>
            </div>
          </form>
          <div className="bg-zinc-800 w-96 h-32">{watch("text")}</div>
        </motion.main>
        <footer></footer>
      </motion.div>
    </>
  );
};

export default AddQuote;
