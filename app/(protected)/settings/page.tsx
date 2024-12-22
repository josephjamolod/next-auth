import { auth } from "@/auth";
import React from "react";

export default async function Settings() {
  const session = await auth();
  console.log(session);

  return <div>{JSON.stringify(session)}</div>;
}
