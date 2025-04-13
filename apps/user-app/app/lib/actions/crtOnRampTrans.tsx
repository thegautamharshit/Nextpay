"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "@repo/db";

export async function createOnRampTransaction(amount:number, provider:string) {
    const session = await getServerSession(authOptions);
    const userId = session.user.id;
    const token = Math.random().toString() //simulating not fetching the actual token because we don't have a live bank

    if(!userId){
        return{
            message:"User Not Logged In"
        }
    }
    await prisma.onRampTransaction.create({
        data:{
            userId:Number(userId),
            amount: amount,
            status: "Processing",
            startTime: new Date(),
            provider,
            token:token
        }
    })
    return {
        message: "On ramp transaction added"
    }
}