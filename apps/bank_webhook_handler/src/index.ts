import express from "express";
import { prisma } from "@repo/db";

const app = express();

app.use(express.json())

app.post("/bankwebhook", async (req, res) => {
    const paymentInfo: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
    
    try {
        await prisma.$transaction([
            prisma.balance.updateMany({
                where:{
                    userId:Number(paymentInfo.userId)
                },
                data:{
                    amount:{
                        increment:Number(paymentInfo.amount)
                    }
                }
            }),
            prisma.onRampTransaction.updateMany({
                where:{
                    token:paymentInfo.token
                },
                data:{
                    status:"Success"
                }
            })
        ]);
        res.json({
            message: "Captured"
        })
    }catch(e){
        console.error(e);
        res.status(411).json({
            message: "Error while processing Webhook."
        })
    }
})

app.listen(3003);

