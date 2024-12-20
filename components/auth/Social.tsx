import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";

export const Social = () => {
  return (
    <div className="flex items-center justify-center w-full gap-x-2">
      <Button
        className="w-full border  border-primary"
        size={"lg"}
        variant={"outline"}
      >
        <FcGoogle className="text-2xl" />
      </Button>
      <Button
        className="w-full border border-primary"
        size={"lg"}
        variant={"outline"}
      >
        <FaGithub className="text-2xl" />
      </Button>
    </div>
  );
};
