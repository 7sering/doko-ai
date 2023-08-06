import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limits";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//POST
export async function POST(req: Request) {
  try {
    const { userId } = auth(); //Check User is exist & Authenticated
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    //Check if user is Authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //Check if open ai key is exist
    if (!configuration.apiKey) {
      return new NextResponse("Open AI API Key is not exist", { status: 500 });
    }

    // Check if messages is exist
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("Resolution  is required", { status: 400 });
    }

     //check free Api Limit is over or not
     const freeApiLimit = await checkApiLimit();
     if (!freeApiLimit) {
       return new NextResponse("Free Trail Is Expired", { status: 403 });
     }
 
    //Response from OPEN AI
    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    await increaseApiLimit();

    return NextResponse.json(response.data.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
