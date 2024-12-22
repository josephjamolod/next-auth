import { auth } from "@/auth";
import SignOutBtn from "@/components/SignOutBtn";

import React from "react";

export default async function Settings() {
  const session = await auth();
  console.log(session);

  return (
    <div>
      {JSON.stringify(session)}
      <SignOutBtn />
    </div>
  );
}
