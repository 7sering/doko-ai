"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import axios from "axios";

import Heading from "@/components/heading";
import { Music } from "lucide-react";
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

const MusicPage = () => {
  const router = useRouter();
  const [music, setMusic] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);
      const response = await axios.post("/api/music", values);
      setMusic(response.data.audio);
      form.reset();
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
          title="Music Generation"
          description="Generate Your Custom Music"
          icon={Music}
          iconColor="text-emerald-500"
          bgCOlor="bg-emerald-500/10"
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
                        placeholder="Violin Music"
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

            {!music && !isLoading && <Empty label="No Music Generated." />}
            {music && (
              <audio controls className="w-full mt-8">
                <source src={music} type="audio/mpeg" />
              </audio>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPage;
