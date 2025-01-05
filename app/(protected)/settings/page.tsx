"use client";

import SignOutBtn from "@/components/SignOutBtn";
import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";

export default function Settings() {
  const user = useCurrentUser();

  return <SignOutBtn />;
}
