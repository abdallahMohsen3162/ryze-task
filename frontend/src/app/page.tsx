"use client";
import { cookies } from "next/headers";
import Image from "next/image";
import { useEffect } from "react";

export default async function Home() {
  useEffect(() => {
    window.location.href = "/login";
  }, [])
  
  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">

    </div>
  );
}
