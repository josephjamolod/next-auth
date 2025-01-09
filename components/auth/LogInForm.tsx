"use client";

import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../FormError";

import { useState, useTransition } from "react";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import { FormSuccess } from "../FormSuccess";
import Link from "next/link";

export function LogInForm() {
  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("callback");

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already used with different provider!"
      : "";
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [twoFactor, setTwoFactor] = useState(false);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      twoFactorCode: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof loginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const response = await login(data, callBackUrl);
        setError(response?.error);
        setSuccess(response?.success);
        if (response?.twoFactor) {
          setTwoFactor(response.twoFactor);
        }
      } catch (error) {
        setError("Something went wrong");
        console.log(error);
      }
    });
  };
  return (
    <CardWrapper
      headerLabel="Welcome Back!"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account?"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            {twoFactor ? (
              <FormField
                control={form.control}
                name="twoFactorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        type="text"
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          type="email"
                          placeholder="your_email@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormError message={error || urlError} />
            <FormSuccess message={success} />
          </div>

          <div className="flex flex-col gap-y-2">
            <Link
              href={"/auth/resetPassword"}
              className="text-xs hover:underline px-2"
            >
              Forgot Password?
            </Link>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
              variant={"default"}
              size={"lg"}
            >
              {twoFactor ? "Confirm" : "Sign In"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
