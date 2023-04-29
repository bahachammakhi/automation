import { Client } from "@notionhq/client";
import notion from "../config";

class NotionService {
  notion: Client;
  constructor() {
    this.notion = notion;
  }
}

const notionService = new NotionService();
export default notionService;
