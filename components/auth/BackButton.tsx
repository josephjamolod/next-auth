import Link from "next/link";
import { Button } from "../ui/button";

export const BackButton = ({
  label,
  href,
}: {
  label: string;
  href: string;
}) => {
  return (
    <Button className="w-full font-normal" variant={"link"} size={"lg"} asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
