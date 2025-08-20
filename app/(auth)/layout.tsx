import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  // if (user) {
  //   redirect("/home");
  // }

  return children;
};

export default AuthLayout;
