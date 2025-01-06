"use client";

import UserInfo from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";

export default function ClientPage() {
  const user = useCurrentUser();
  return <UserInfo label="Client Page" user={user} />;
}
