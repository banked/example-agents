import { anthropic } from "@ai-sdk/anthropic";
import { createVertex } from "@ai-sdk/google-vertex";
import { openai } from "@ai-sdk/openai";
import {
  modelProvider,
  googleCloudConfig,
  modelConfig,
} from "@/config/config";

let model: 
  | ReturnType<ReturnType<typeof createVertex>>
  | ReturnType<typeof anthropic>
  | ReturnType<typeof openai>;

if (modelProvider === "google-vertex") {
  const vertexProvider = createVertex({
    project: googleCloudConfig!.project,
    location: googleCloudConfig!.location,
  });
  model = vertexProvider(modelConfig.name);
} else if (modelProvider === "anthropic") {
  model = anthropic(modelConfig.name);
} else {
  model = openai(modelConfig.name);
}

export { model };