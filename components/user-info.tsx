import { ExtendedUser } from "@/next-auth";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export default function UserInfo({ user, label }: UserInfoProps) {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl text-center font-semibold">{label}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <label>ID :</label>
          <p className="truncate text-sm max-w-[180px] bg-slate-100 p-1 rounded-md">
            {user?.id}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <label>Name :</label>
          <p className="truncate text-sm max-w-[180px] bg-slate-100 p-1 rounded-md">
            {user?.name}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <label>Email :</label>
          <p className="truncate text-sm max-w-[180px] bg-slate-100 p-1 rounded-md">
            {user?.email}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <label>Role :</label>
          <p className="truncate text-sm max-w-[180px] bg-slate-100 p-1 rounded-md">
            {user?.role}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <label>Two Factor Authentication :</label>

          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "On" : "Off"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
