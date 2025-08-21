import { requireGuest } from "@/actions/server-auth";
import { ReactNode } from "react";

export async function generateMetadata() {
  return {
    title: "Login",
    description: "Login to Get Started",
  };
}

const LoginLayout = async ({ children }: { children: ReactNode }) => {
  await requireGuest();
  return children;
};

export default LoginLayout;
