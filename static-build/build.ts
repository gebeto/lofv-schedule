import fs from "fs/promises";
import path from "path";
import { generateIcs, availableParsers, ParserKey } from "../parsers";
import Handlebars from "handlebars";
import { LOFVTeamsParser } from "../parsers/lofvTeamsParser";
import { LOFVGamesParser } from "../parsers/lofvGamesParser";

const HOST = process.env.HOST || "localhost:3000";

const asyncWait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const handleRetries = async (
  callback: () => Promise<void>,
  delayMs: number,
  retriesCount: number,
) => {
  for (let attempt = 1; attempt <= retriesCount; attempt++) {
    try {
      await callback();
      break;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Attempt ${attempt} failed with error: ${error.message}`);
        if (attempt === retriesCount) {
          console.error("All retry attempts failed.");
          throw error;
        }
      }
    }
    console.log(`Waiting for ${delayMs}ms before retrying...`);
    await asyncWait(delayMs);
  }
};

const buildStaticFiles = async () => {
  const indexTemplate = Handlebars.compile(
    await fs.readFile(path.join(__dirname, "index.handlebars"), "utf-8"),
  );

  const rootDir = path.resolve(__dirname, "..", "dist");
  await fs.rm(rootDir, { recursive: true, force: true });
  await fs.mkdir(rootDir, { recursive: true });

  const teamsParser = new LOFVTeamsParser();
  const teams = await teamsParser.parse();

  await fs.writeFile(
    path.join(rootDir, "index.html"),
    indexTemplate({
      items: teams.map((team) => ({
        url: `webcal://${HOST}/${team.key}.ics`,
        title: team.name,
        // url: team.link,
      })),
    }),
    "utf-8",
  );

  const gamesParser = new LOFVGamesParser();
  for (const team of teams) {
    const schedule = await gamesParser.parse(team.link);

    fs.writeFile(
      path.join(rootDir, `${team.key}.ics`),
      generateIcs(schedule, team.name),
      "utf-8",
    );
  }
};

(async () => {
  await handleRetries(
    async () => {
      await buildStaticFiles();
    },
    20000,
    3,
  );
})();
