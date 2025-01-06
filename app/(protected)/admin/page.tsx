"use client";

import { adminAction } from "@/actions/admin";
import RoleGate from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";

import React from "react";
import { toast } from "sonner";

export default function AdminPage() {
  const apiClick = async () => {
    try {
      const response = await fetch("/api/admin");
      if (response.ok) {
        toast.success("You are and Admin");
      } else {
        toast.error("Forbidden");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const serverActionClick = async () => {
    const response = await adminAction();
    if (response.error) {
      toast.error(response.error);
    }
    if (response.success) {
      toast.success(response.success);
    }
  };
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl text-center font-semibold">Admin Page</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2 text-center">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <h1 className="bg-emerald-300 text-sm  rounded-sm py-2">
            This is an Admin Page
          </h1>
        </RoleGate>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <label>Admin Only API Route :</label>
          <Button onClick={apiClick}>Click to Test</Button>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <label>Admin Only Server Action:</label>
          <Button onClick={serverActionClick}>Click to Test</Button>
        </div>
      </CardContent>
    </Card>
  );
}
