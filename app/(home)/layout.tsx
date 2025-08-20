import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  // if (user) {
  //   redirect("/home");
  // }

  return children;
};

export default HomeLayout;
