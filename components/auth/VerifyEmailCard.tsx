"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import CardWrapper from "./CardWrapper";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";

export const VerifyEmailCard = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token");

  const onSubmit = useCallback(() => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      if (verificationToken) {
        const response = await newVerification(verificationToken);
        setError(response?.error);
        setSuccess(response?.success);
      } else {
        setError("No token found!");
      }
    });
  }, [verificationToken]);
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Back to log in"
      headerLabel="Verifying your email"
    >
      {isPending ? (
        <div className="w-8 h-8 border-4 place-self-center border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      ) : (
        <>
          <FormError message={error} />
          <FormSuccess message={success} />
        </>
      )}
    </CardWrapper>
  );
};
