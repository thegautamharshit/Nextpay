"use client";

import { useBalanceStore } from "../atoms/balanceStore"

export const useBalance = () => {
    const value = useBalanceStore((state)=> state.balance);
    return value
}   