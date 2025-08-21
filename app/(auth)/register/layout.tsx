import { requireGuest } from "@/actions/server-auth";
import { ReactNode } from "react";

export async function generateMetadata() {
  return {
    title: "Register",
    description: "Register to Get Started",
  };
}

const RegisterLayout = async ({ children }: { children: ReactNode }) => {
  await requireGuest();
  return children;
};

export default RegisterLayout;
