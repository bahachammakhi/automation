import { Client } from "@notionhq/client";
import { env } from "./env";

// Initializing a client
const notion = new Client({
  auth: env.NOTION_API_KEY,
});

export default notion;
