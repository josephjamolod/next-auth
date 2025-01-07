"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { settingsSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateSettings } from "@/actions/update-setting";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function Settings() {
  const { update } = useSession();
  const user = useCurrentUser();

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || undefined,
    },
  });

  const handleSubmit = (data: z.infer<typeof settingsSchema>) => {
    startTransition(async () => {
      try {
        const response = await updateSettings(data);
        update();
        if (response?.success) {
          toast.success(response.success);
        }
        if (response?.error) {
          toast.error(response.error);
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    });
  };
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className=" text-2xl font-semibold text-center">
        Settings Page
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      type="text"
                      placeholder="your_email@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-y-2">
              <Button
                disabled={isPending}
                type="submit"
                className="w-full"
                variant={"default"}
                size={"lg"}
              >
                {isPending ? " Updating..." : " Update"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
