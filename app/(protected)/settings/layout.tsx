import React from "react";
import NavBar from "../_components/navBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-full w-full flex flex-col gap-y-10 justify-center items-center">
      <NavBar />
      {children}
    </div>
  );
}
