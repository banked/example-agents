import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

import { model } from "@/mastra/model"; 
import { banked } from "@/tools/banked";

const prompt = `You are a payments agent for Banked that helps users with payment related questions.
Your main goal is to provide excellent customer service and help customers create payments.

You should only answer queries that can be handled using the tools available to you.
If a user asks about something outside the scope of your available tools, politely decline
and explain that you can only help with Banked payment-related tasks.`

export const basicAgent = new Agent({
  name: "Banked basic agent",
  description: "A payments agent for Banked that helps users with payment related questions.",
  instructions: prompt,
  model: model,
  tools: await banked.getTools(),
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }), 
});

