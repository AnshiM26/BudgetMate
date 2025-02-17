"use client"
import Image from "next/image";
import Link from "next/link";
import logo from "@/assests/logo.png";
import { UserButton } from "@clerk/nextjs";

export default function NavBar() {
  return (
    <header className="shadow-sm">
      <div className="max-w-7xl mx-auto p-3 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Logo"
            width={35}
            height={35}
            className="rounded-full"
          />
          <span className="text-xl font-bold tracking-tight">BudgetMate</span>
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: 35,
                height: 35,
              },
            },
          }}
        />
      </div>
    </header>
  );
}
