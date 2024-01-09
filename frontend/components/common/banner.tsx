"use client";

import Link from "next/link";
import Image from "next/image";
import Connect from "@/public/images/connect.jpg";
import { usePathname } from "next/navigation";

export function Banner() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:w-[50%] lg:flex lg:flex-col relative bg-neutral-900">
      <Image
        src={Connect}
        alt="Connect"
        className="absolute top-0 left-0 object-cover w-full h-full opacity-70"
      />

      <div className="relative z-20 p-10">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/login") {
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
              }
            }}
            className="font-semibold text-white"
          >
            Connect
          </Link>
          <span className="relative flex w-3 h-3">
            <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
          </span>
        </div>
      </div>

      <div className="relative z-20 p-10 mt-auto">
        <blockquote className="space-y-2 text-white">
          <p className="text-lg">
            &ldquo; Revolutionize your connections with Connect: effortlessly
            link up with friends and family, store and organize contacts in
            style! &rdquo;
          </p>
          <p className="text-sm">2024 Connect. All rights reserved.</p>
        </blockquote>
      </div>
    </div>
  );
}
