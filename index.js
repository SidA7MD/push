import jsonfile from "jsonfile";
import moment from "moment";
import random from "random";
import simpleGit from "simple-git";

const path = "./data.json";

const DAYS = 20;          // 20 days × 5 commits/day = 100 commits
const COMMITS_PER_DAY = 5;
const TOTAL_COMMITS = DAYS * COMMITS_PER_DAY;

const START = moment("2025-02-01");
const END = moment("2025-03-31");

let commitCount = 0;

const makeCommit = (date) => {
  const data = { date };
  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }, () => {
      commitCount++;
      if (commitCount === TOTAL_COMMITS) {
        console.log("✅ All commits done. Pushing...");
        return simpleGit().push();
      }
    });
  });
};

const createCommits = () => {
  for (let day = 0; day < DAYS; day++) {
    const commitDay = START.clone().add(day, "days");

    // Skip days outside Feb-Mar 2025 range if needed
    if (commitDay.isBefore(START) || commitDay.isAfter(END)) continue;

    for (let i = 0; i < COMMITS_PER_DAY; i++) {
      const randomHour = random.int(8, 20);
      const randomMinute = random.int(0, 59);
      const date = commitDay.clone().hour(randomHour).minute(randomMinute).format();

      console.log("Commit:", date);
      makeCommit(date);
    }
  }
};

createCommits();
