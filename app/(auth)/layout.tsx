import { requireGuest } from "@/actions/server-auth";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  await requireGuest();

  return children;
};

export default AuthLayout;
