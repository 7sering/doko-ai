import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//POST
export async function POST(req: Request) {
  try {
    const { userId } = auth(); //Check User is exist & Authenticated
    const body = await req.json();
    const { messages } = body;

    //Check if user is Authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //Check if open ai key is exist
    if (!configuration.apiKey) {
      return new NextResponse("Open AI API Key is not exist", { status: 500 });
    }

    // Check if messages is exist
    if (!messages) {
      return new NextResponse("Messages is required", { status: 400 });
    }

    //Response from OPEN AI
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
