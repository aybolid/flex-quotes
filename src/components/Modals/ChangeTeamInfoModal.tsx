import React, { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { changeTeamInfo } from "@/lib/db";
import notify from "@/helpers/toastNotify";

const ChangeTeamInfoModal: React.FC<{
  displayModal: React.Dispatch<React.SetStateAction<boolean>>;
  team: { name: string; uid: string; passcode: string };
}> = ({ displayModal, team }) => {
  const schema = yup
    .object({
      name: yup
        .string()
        .trim()
        .required("Team name is required.")
        .min(3, "Team name min length is 3 digits.")
        .max(15, "Team name max length is 15 digits.")
        .matches(
          /^[aA-zZ0-9аА-яЯіІґҐїЇєЄ]+$/,
          "Team name is not in the correct format. (aA-zZ, аА-яЯ, 0-9)"
        )
        .notOneOf([team.name], "Name must be different from previous one."),
      passcode: yup
        .string()
        .trim()
        .required("Passcode is required.")
        .min(3, "Passcode min length is 3 digits.")
        .max(15, "Passcode max length is 15 digits.")
        .matches(
          /^[a-z0-9]+$/,
          "Passcode is not in the correct format. (a-z, 0-9)"
        )
        .notOneOf(
          [team.passcode],
          "Passcode must be different from previous one."
        ),
    })
    .required();
  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as HTMLDivElement)
      ) {
        displayModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalRef]);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "") as any;
  }, []);

  const handleInfoChange = (data: FormData) => {
    changeTeamInfo(team.uid, data)
      .then(() => reset())
      .then(() => notify("success", "Team name and passcode were updated!"))
      .then(() => displayModal(false))
      .catch(() => notify("error", "An unexpected error has occured."));
  };

  return (
    <div className="fixed flex justify-center items-center top-0 left-0 h-full w-full bg-black bg-opacity-70">
      <motion.div
        ref={modalRef}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -400, opacity: 0 }}
        className={`${
          errors.name || errors.passcode ? "border-red-500 border" : null
        } relative bg-zinc-800 px-8 py-4 rounded-md flex flex-col gap-4 justify-center items-center`}
      >
        <button onClick={() => displayModal(false)}>
          <MdClose
            title="CLose modal"
            size={30}
            className="absolute top-0 right-0 text-zinc-500 hover:text-red-500"
          />
        </button>
        <h4 className="text-2xl text-cyan-300">Change Team Info</h4>
        <form onSubmit={handleSubmit(handleInfoChange)}>
          <div className="flex max-w-[258px] flex-col justify-center items-center">
            <label
              htmlFor="nameInput"
              className={`${errors.name && "text-red-500"} text-xl w-full`}
            >
              Name
            </label>
            <input
              {...register("name")}
              autoComplete="off"
              placeholder="NewName123"
              defaultValue={team.name}
              type="text"
              className={`${
                errors.name && "border border-red-600 rounded-b-none"
              } rounded-md w-full bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
              id="nameInput"
            />
            {errors.name && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                initial={{ height: 0, opacity: 0 }}
                className="text-center w-full border border-dashed border-t-0 rounded-t-none border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
              >
                <p className="p-1">{errors.name?.message}</p>
              </motion.div>
            )}
          </div>
          <div className="flex flex-col max-w-[258px] justify-center items-center mt-4">
            <label
              htmlFor="passcodeInput"
              className={`${
                errors.passcode?.message && "text-red-500"
              } text-xl w-full`}
            >
              Passcode
            </label>
            <input
              {...register("passcode")}
              autoComplete="off"
              placeholder="newpasscode12"
              defaultValue={team.passcode}
              type="text"
              className={`${
                errors.passcode?.message &&
                "border border-red-600 rounded-b-none"
              } rounded-md w-full bg-zinc-700 px-4 py-2 text-lg focus:outline-none`}
              id="passcodeInput"
            />
            {errors.passcode && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                initial={{ height: 0, opacity: 0 }}
                className="text-center w-full border border-dashed border-t-0 rounded-t-none border-red-500 rounded-md bg-zinc-900 text-red-500 font-mono"
              >
                <p className="p-1">{errors.passcode?.message}</p>
              </motion.div>
            )}
          </div>
          <div className="w-full flex justify-center items-center mt-8">
            <button type="submit" className="btn-submit">
              Confirm Change
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangeTeamInfoModal;
