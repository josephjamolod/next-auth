import { currentUser } from "@/lib/current-user";
import React from "react";

export default async function ServerPage() {
  const user = await currentUser();
  console.log("User here");

  console.log(user);

  return <div>{JSON.stringify(user)}</div>;
}
