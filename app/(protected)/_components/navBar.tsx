"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavBar() {
  const path = usePathname();
  console.log(path);

  return (
    <div className="bg-primary  flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
        <Button variant={path === "/server" ? "outline" : "default"} asChild>
          <Link href={"/server"}>Server</Link>
        </Button>
        <Button variant={path === "/client" ? "outline" : "default"} asChild>
          <Link href={"/client"}>Client</Link>
        </Button>
        <Button variant={path === "/admin" ? "outline" : "default"} asChild>
          <Link href={"/admin"}>Admin</Link>
        </Button>
        <Button variant={path === "/settings" ? "outline" : "default"} asChild>
          <Link href={"/settings"}>Settings</Link>
        </Button>
      </div>
      <UserButton />
    </div>
  );
}
