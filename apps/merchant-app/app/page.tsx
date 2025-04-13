"use client"

import { useBalance } from "@repo/store/balance";

export default function Home() {
  const balance = useBalance();

  return (
    <div className="flex justify-cente text-cyan-900 text-2xl">
      Your Balance is {balance}
    </div>
  );
}
