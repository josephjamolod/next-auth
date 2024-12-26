"use client";

import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { newPasswordSchema } from "@/schemas";
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

import { FormSuccess } from "../FormSuccess";

import { useRouter, useSearchParams } from "next/navigation";
import { setNewPassword } from "@/actions/setNewPassword";

export function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof newPasswordSchema>) => {
    console.log(data);
    setSuccess("");
    setError("");
    startTransition(async () => {
      try {
        if (resetPasswordToken) {
          const response = await setNewPassword({
            token: resetPasswordToken,
            password: data,
          });
          setError(response?.error);
          setSuccess(response?.success);
          if (response?.success) {
            router.push("/auth/login");
          }
        } else {
          setError("No token found!");
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  return (
    <CardWrapper
      headerLabel="New Password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to log in page"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full"
            variant={"default"}
            size={"lg"}
          >
            Set New Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
