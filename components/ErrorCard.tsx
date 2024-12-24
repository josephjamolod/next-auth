import React from "react";
import CardWrapper from "./auth/CardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function ErrorCard() {
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Back to log in"
      headerLabel="Oops! Something wen wrong"
    >
      <ExclamationTriangleIcon className="text-destructive w-full justify-center items-center text-5xl" />
    </CardWrapper>
  );
}
