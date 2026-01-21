import { parse } from "node-html-parser";
import { dayjs, GameSchedule } from "./types";

export class LOFVGamesParser {
  async parse(teamUrl: string): Promise<GameSchedule[]> {
    const content = await this.fetchTeamData(teamUrl);
    const schedule = this.parseHtmlDataToObject(content);

    return schedule;
  }

  async fetchTeamData(teamUrl: string) {
    // "22|0/84";
    // const response = await fetch(
    //   `https://lofv.com.ua/component/joomsport/team/${teamId}`,
    // );
    const response = await fetch(teamUrl);
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
      const [title, datetime, teamHome, result, teamAway, ..._rest] =
        row.querySelectorAll("td");
      const [dateStr, ..._restTime] = datetime.textContent.trim().split(" ");
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
