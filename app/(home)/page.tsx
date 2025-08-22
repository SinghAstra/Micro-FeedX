"use client";

import ConicBackground from "@/components/component-x/conic-background";
import MovingBorder from "@/components/component-x/moving-border";
import Footer from "@/components/landing/footer";
import Navbar from "@/components/landing/navbar";
import { siteConfig } from "@/config/site";
import { blurInVariant, containerVariant, fadeInVariant } from "@/lib/variants";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Hero from "./hero";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="min-h-screen relative px-4 sm:px-8 flex items-center">
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          className="flex flex-col gap-4 sm:gap-8 sm:max-w-[60%] text-balance"
        >
          <motion.h1
            variants={blurInVariant}
            className=" text-3xl sm:text-4xl md:text-5xl text-balance leading-[1.3]"
          >
            Join thousands sharing ideas, stories, and moments on{" "}
            <span className="text-primary">{siteConfig.name}</span>
          </motion.h1>

          <motion.p
            variants={fadeInVariant}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl"
          >
            Express yourself in 280 characters or less. Connect with like minded
            people, and join conversations that matter to you. No algorithms, no
            ads - just pure, authentic social interaction.
          </motion.p>

          <motion.div variants={fadeInVariant}>
            <Link href="/register">
              <div className="p-[2px] relative z-[2] overflow-hidden rounded w-fit">
                <MovingBorder />
                <div className="relative border px-6 py-2 sm:text-xl rounded flex items-center group cursor-pointer w-fit bg-background">
                  Get started
                  <ArrowRightIcon
                    className="ml-1 size-4 transition-all duration-300 
                group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
        <ConicBackground />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
