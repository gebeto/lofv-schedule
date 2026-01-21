import { UnionToTuple } from "type-fest";

import { LOFVGamesParser } from "./lofvGamesParser";

export { dayjs } from "./types";
export { generateIcs } from "./ics";

export const availableParsers = {
  dublyany: {
    key: "dublyany",
    label: "ВК Дубляни",
    parser: async () => {
      const parser = new LOFVGamesParser();
      return await parser.parse();
    },
    visible: true,
  },
};
export type ParserKey = keyof typeof availableParsers;

export const availableParserKeys = Object.keys(
  availableParsers,
) as UnionToTuple<ParserKey>;
