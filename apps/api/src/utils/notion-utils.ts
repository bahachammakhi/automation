import { isFullBlock } from "@notionhq/client";
import notion from "../config";
import {
  BlockWithTitle,
  isHeadingBlock,
  isTodoBlock,
  truthyFilterHelper,
} from "../types";

import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export function getSpecificBlockTasks(
  blocks: BlockWithTitle[],
  blockName: string
) {
  const tomorrowTasksBlocks = blocks.find((block) => block.title === blockName);
  if (tomorrowTasksBlocks?.result) {
    return formatBlocksForInsertion(tomorrowTasksBlocks?.result);
  }
  return [];
}

export async function getBlockChildren(blockId: string) {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });

  const blockTypes = response.results.map((block) => {
    if (isFullBlock(block)) {
      return block.type;
    }
  });
  return {
    response,
    results: response.results,
    blockTypes,
  };
}

export function isAHeadingBlock(
  block: Awaited<ReturnType<typeof getBlockChildren>>
) {
  const index = block.blockTypes.indexOf("heading_1");
  const headingBlock = block.results[index];
  if (index !== -1 && isHeadingBlock(headingBlock)) return headingBlock;
  return false;
}

export async function getHeadedBlocks(blockIds: string[]) {
  let tasks: BlockWithTitle[] = [];
  for (let i = 0; i < blockIds.length; i++) {
    const response = await getBlockChildren(blockIds[i]);
    const headingBlock = isAHeadingBlock(response);
    if (headingBlock) {
      tasks.push({
        result: response.results,
        title: headingBlock.heading_1.rich_text[0].plain_text,
      });
    } else {
      const columnBlocks = getColumnListsBlocks(response);
      tasks = [
        ...tasks,
        ...(await getHeadedBlocks(columnBlocks.map((column) => column.id))),
      ];
    }
  }
  return tasks;
}

export function getColumnListsBlocks(
  block: Awaited<ReturnType<typeof getBlockChildren>>
) {
  let columnBlocks: BlockObjectResponse[] = [];
  block.blockTypes.forEach((type, index) => {
    let currentBlock = block.results[index];
    if (
      (type === "column_list" || type === "column") &&
      isFullBlock(currentBlock)
    ) {
      columnBlocks.push(currentBlock);
    }
  });

  return columnBlocks;
}

export function formatBlocksForInsertion(
  blocks: (BlockObjectResponse | PartialBlockObjectResponse)[]
) {
  return blocks
    .map((block) => {
      if (isFullBlock(block) && isTodoBlock(block)) {
        const newBlock = { [block.type]: block[block.type] };
        return newBlock;
      }
      return null;
    })
    .filter(truthyFilterHelper);
}
