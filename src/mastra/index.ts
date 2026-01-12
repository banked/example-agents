import "./config/config";
import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { basicAgent } from "./agents/basic";
import { withToolFilterAgent } from "./agents/withtoolfilter";

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: "file:./sample-agents.db",
  }),
  agents: {
    basicAgent,
    withToolFilterAgent,
  },
});

