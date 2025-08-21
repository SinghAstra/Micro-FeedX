import { requireAuth } from "@/actions/server-auth";
import { ReactNode } from "react";

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  await requireAuth();
  return children;
};

export default ProtectedLayout;
