import { parse } from "node-html-parser";
import { dayjs, GameSchedule } from "./types";

export class LOFVParser {
  async parse(): Promise<GameSchedule[]> {
    const content = await this.fetchTeamData("22|0/84");
    const schedule = this.parseHtmlDataToObject(content);

    return schedule;
  }

  async fetchTeamData(teamId: string) {
    const response = await fetch(
      `https://lofv.com.ua/component/joomsport/team/${teamId}`,
    );
    const responseData = await response.text();
    console.log(" >>> response:", JSON.stringify(responseData, undefined, 2));

    return responseData;
  }

  parseHtmlDataToObject(htmlData: string): GameSchedule[] {
    const parsed = parse(htmlData);
    const parsedRows = [
      ...(parsed.getElementById("calendar")?.querySelectorAll("tr") ?? []),
    ];

    return parsedRows.map((row) => {
      const [title, datetime, teamHome, result, teamAway, ...rest] =
        row.querySelectorAll("td");
      const [dateStr, ...restTime] = datetime.textContent.trim().split(" ");
      const date = dayjs(dateStr, "DD-MM-YYYY").format("YYYY-MM-DD");
      const teams = `${teamHome.textContent.trim()} - ${teamAway.textContent.trim()}`;
      return {
        title: teams,
        date: date,
        details: `${title.textContent.trim().replace(/:$/, "")}

${teamHome.textContent.trim()} (${result.textContent.trim()}) ${teamAway.textContent.trim()}`,
      };
    });
  }
}
