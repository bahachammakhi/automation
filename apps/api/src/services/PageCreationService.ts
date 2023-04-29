import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import { getHeadedBlocks, getSpecificBlockTasks } from "../utils/notion-utils";
import notionService from "./NotionService";

class PageCreationService {
  getWeekFirstDay() {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay();
    const firstDay = new Date(curr.setDate(first)).toISOString();
    return firstDay;
  }
  async getLastDocumentId(databaseId: string) {
    const result = await notionService.notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Created time",
          direction: "descending",
        },
      ],
      filter: {
        or: [
          {
            property: "Created time",
            date: {
              on_or_after: this.getWeekFirstDay(),
            },
          },
        ],
      },
    });
    return result.results[0].id;
  }

  async createPageInsideDatabase(databaseId: string) {
    const response = await notionService.notion.pages.create({
      parent: {
        type: "database_id",
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: new Date().toDateString(),
              },
            },
          ],
        },
        Tags: {
          multi_select: [
            {
              name: "Work",
            },
          ],
        },
      },
    });
    return response.id;
  }

  async insertTaskBlock(
    currentPage: string,
    nextPage: string,
    blockType: string
  ) {
    const result = await getHeadedBlocks([currentPage]);
    const blocksToInsert = getSpecificBlockTasks(result, blockType);

    const response = await notionService.notion.blocks.children.append({
      block_id: nextPage,
      children: blocksToInsert as BlockObjectRequest[],
    });
    return response;
  }
}

const pageCreationService = new PageCreationService();

export default pageCreationService;
