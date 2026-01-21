import { dayjs } from "../parsers";

import * as ics from "ics";
import { GameSchedule } from "./types";

function createEventForGroup(schedule: GameSchedule) {
  // const start = dayjs(schedule.date)
  //   .tz("Europe/Kyiv")
  //   .format("YYYY-M-D-H-m")
  //   .split("-")
  //   .map((a) => parseInt(a)) as ics.DateArray;
  const startObj = dayjs(schedule.date, "YYYY-MM-DD");
  const start = startObj
    .format("YYYY-M-D")
    .split("-")
    .map((a) => parseInt(a)) as ics.DateArray;
  const end = startObj
    .add(1, "day")
    .format("YYYY-M-D")
    .split("-")
    .map((a) => parseInt(a)) as ics.DateArray;

  const event: ics.EventAttributes = {
    uid: schedule.date + "@loe-blackouts",
    startOutputType: "local",
    start: start,
    end: end,
    busyStatus: "BUSY",
    transp: "TRANSPARENT",
    title: schedule.title.trim(),
    description: schedule.details,
    // alarms: [
    //   {
    //     action: "display",
    //     description: "Відключення світла скоро почнеться",
    //     trigger: { minutes: 30, before: true },
    //     repeat: 1,
    //     attach: "Glass",
    //   },
    // ],
  };

  return event;
}

export function generateIcs(
  gamesSchedule: GameSchedule[],
  title: string,
): string {
  const events: ics.EventAttributes[] = [];
  gamesSchedule.forEach((timeRange) => {
    events.push(createEventForGroup(timeRange));
  });

  const result = ics.createEvents(events, {
    calName: title,
  }).value;

  return result ?? "";
}
