import {
  BlockObjectResponse,
  Heading1BlockObjectResponse,
  PartialBlockObjectResponse,
  ToDoBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type BlockWithTitle = {
  title: string;
  result: (BlockObjectResponse | PartialBlockObjectResponse)[];
};

export const truthyFilterHelper = <T>(
  x: T | false | undefined | null | "" | 0
): x is T => !!x;

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function isHeadingBlock(
  response: BlockObjectResponse | PartialBlockObjectResponse
): response is Heading1BlockObjectResponse {
  return "type" in response;
}

export function isTodoBlock(
  response: BlockObjectResponse | PartialBlockObjectResponse
): response is ToDoBlockObjectResponse {
  return "type" in response;
}
