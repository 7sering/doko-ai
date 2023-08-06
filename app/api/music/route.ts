import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limits";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

//POST
export async function POST(req: Request) {
  try {
    const { userId } = auth(); //Check User is exist & Authenticated
    const body = await req.json();
    const { prompt } = body;

    //Check if user is Authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if messages is exist
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

     //check free Api Limit is over or not
     const freeApiLimit = await checkApiLimit();
     if (!freeApiLimit) {
       return new NextResponse("Free Trail Is Expired", { status: 403 });
     }
 
    //Response from REPLICATE AI
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );
    await increaseApiLimit();

  return NextResponse.json(response)
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
