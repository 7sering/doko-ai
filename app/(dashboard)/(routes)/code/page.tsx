"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import axios from "axios";

import Heading from "@/components/heading";
import { Code } from "lucide-react";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Form, FormField, FormControl, FormItem } from "@/components/ui/form";

import { formSchema } from "./constants";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    const userMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: values.prompt,
    };
    const newMessages = [...messages, userMessage];

    const response = await axios.post("/api/code", {
      messages: newMessages,
    });

    setMessages((current) => [...current, userMessage, response.data]);
    form.reset();
    try {
    } catch (error: any) {
      //open pro modal
      console.log(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <>
      <div>
        <Heading
          title="Code Generation"
          description="Write your description below for generating code."
          icon={Code}
          iconColor="text-green-700"
          bgCOlor="bg-green-700/10"
        />

        <div className="px-4 lg:px-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using react hooks "
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>

          {/* message section */}
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex item-center justify-center bg-muted">
                <Loader />
              </div>
            )}

            {messages.length === 0 && !isLoading && (
              <Empty label="No CodePage stared." />
            )}

            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message) => (
                <div
                  key={message.name}
                  className={cn(
                    "p-8 w-full items-start gap-x-8 rounded-lg",
                    message.role === "user"
                      ? "bg-white border border-black/10"
                      : "bg-muted"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  <p className="text-sm"> {message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodePage;