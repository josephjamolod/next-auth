"use client";

import { useCurrentRole } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

interface RoleGateProp {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export default function RoleGate({ children, allowedRole }: RoleGateProp) {
  const role = useCurrentRole();
  return role === allowedRole ? (
    <div className="">{children}</div>
  ) : (
    <div className=" bg-destructive text-white text-sm flex items-center justify-center gap-x-2 rounded-sm py-2">
      You are now allowed to view this content{" "}
      <ExclamationTriangleIcon fontSize={26} />
    </div>
  );
}
