import { requireGuest } from "@/actions/server-auth";
import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  await requireGuest();

  return children;
};

export default HomeLayout;
