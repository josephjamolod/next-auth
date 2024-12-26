"use client";

import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { resetPasswordSchema } from "@/schemas";
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
import { resetPassword } from "@/actions/resetPassword";

export function ResetPasswodForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    console.log(data);
    setSuccess("");
    setError("");
    startTransition(async () => {
      try {
        const response = await resetPassword(data);
        setError(response?.error);
        setSuccess(response?.success);
      } catch (error) {
        console.log(error);
      }
    });
  };
  return (
    <CardWrapper
      headerLabel="Reset Password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to log in page"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} type="text" />
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
            Send Mail
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
