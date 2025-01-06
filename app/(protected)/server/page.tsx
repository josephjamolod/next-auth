import UserInfo from "@/components/user-info";
import { currentUser } from "@/lib/current-user";
import React from "react";

export default async function ServerPage() {
  const user = await currentUser();

  return <UserInfo label="Server Page" user={user} />;
}
