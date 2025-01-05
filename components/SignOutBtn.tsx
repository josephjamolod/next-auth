"use client";

import React from "react";
import { Button } from "./ui/button";
import { logOut } from "@/actions/logout";

export default function SignOutBtn() {
  const handleSignOut = async () => await logOut();
  return (
    <Button variant={"destructive"} onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
