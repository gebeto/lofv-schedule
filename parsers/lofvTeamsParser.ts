import { parse } from "node-html-parser";
import { LOFVTeam } from "./types";

export class LOFVTeamsParser {
  async parse(): Promise<LOFVTeam[]> {
    const content = await this.fetchData();
    const schedule = this.parseHtmlDataToObject(content);

    return schedule;
  }

  async fetchData() {
    const response = await fetch(
      `https://lofv.com.ua/zmahannia/chempionat-lvivshchyny/sezon-2025-26/persha-liha-25-26`,
    );
    const responseData = await response.text();
    console.log(" >>> response:", JSON.stringify(responseData, undefined, 2));

    return responseData;
  }

  parseHtmlDataToObject(htmlData: string): LOFVTeam[] {
    const parsed = parse(htmlData);
    const parsedRows = [
      ...(parsed.querySelectorAll("table.tblscss tbody tr") ?? []),
    ];

    return parsedRows.map((row) => {
      const [_numCell, nameCell, ..._rest] = row.querySelectorAll("td");
      const link = nameCell.querySelector("a")?.getAttribute("href") ?? "";
      const key = link?.replace(/\//g, "-").replace(/^-/, "").replace(/-$/, "");
      return {
        key: key,
        name: nameCell.textContent.trim(),
        link: "https://lofv.com.ua" + link,
      };
    });
  }
}
