import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";

export const GET = async()=> {
    const session = await getServerSession(authOptions);
    try{
        if(session.user){
            return NextResponse.json({
                user:session.user
            })
        }
        return NextResponse.json({
            message: "You are Logged In"
        },{
            status: 403
        })
    }catch (e){
        return NextResponse.json({
            message: "You are Not Logged In"
        },{
            status:403
        })
    }
}