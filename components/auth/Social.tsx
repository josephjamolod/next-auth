import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex items-center justify-center w-full gap-x-2">
      <Button
        className="w-full border  border-primary"
        size={"lg"}
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <FcGoogle className="text-2xl" />
      </Button>
      <Button
        className="w-full border border-primary"
        size={"lg"}
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        <FaGithub className="text-2xl" />
      </Button>
    </div>
  );
};
