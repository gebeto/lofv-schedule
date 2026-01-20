import { UnionToTuple } from "type-fest";

import { parseLOEBlackoutsSchedule } from "./lviv";

export { dayjs } from "./types";
export { generateIcs } from "./ics";

export const availableParsers = {
  lviv: {
    key: "lviv",
    label: "Львів",
    parser: parseLOEBlackoutsSchedule,
    visible: true,
  },
};
export type ParserKey = keyof typeof availableParsers;

export const availableParserKeys = Object.keys(
  availableParsers,
) as UnionToTuple<ParserKey>;
