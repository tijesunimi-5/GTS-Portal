'use client'
import { useState } from "react";
import Auth from "@/component/Auth";
import { useCustomContext } from "@/component/Context";

export default function Home() {

  return (
    <div className="flex flex-col items-center h-screen w-screen">
      <Auth />
    </div>
  );
}
