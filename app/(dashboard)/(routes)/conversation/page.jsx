"use client";

import * as z from "zod";
import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

const conversation = () => {
  // const form = useForm({
  //   defaultValues: {
  //     prompt: "",
  //   },
  // });
  return (
    <>
      <div>
        <Heading
          title="Conversation"
          description="This is the conversation page"
          icon={MessageSquare}
          iconColor="text-violet-500"
          bgCOlor="bg-violet-500/10"
        />

        <div className="px-4 lg:px-8">form</div>
      </div>
    </>
  );
};

export default conversation;
