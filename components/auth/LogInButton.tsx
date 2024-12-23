"use client";

import { useRouter } from "next/navigation";

interface loginButtonType {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export default function LogInButton({
  children,
  mode = "redirect",
}: loginButtonType) {
  const router = useRouter();
  const handleClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <span>to implement modal</span>;
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
}
