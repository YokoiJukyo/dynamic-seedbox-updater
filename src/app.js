import express from "express";
import cron from "node-cron";
import MyAnonaMouseService from "./services/MyAnonaMouseService.js";

console.log("Starting MyAnonaMouse Dynamic Seedbox");

const myAnonaMouseService = new MyAnonaMouseService();
const DEFAULT_CRON_SCHEDULE = "* * * * *";
const CRON_ENABLED = process.env.CRON_ENABLED || true;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || DEFAULT_CRON_SCHEDULE;

if (CRON_ENABLED) {
  console.log("CRON enabled");

  if (cron.validate(CRON_SCHEDULE) == false) {
    const errorMessage = `CROM CRON_SCHEDULE=[${CRON_SCHEDULE}] is invalid! See https://crontab.guru/ for help.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  } else {
    console.log(`CRON CRON_SCHEDULE=[${CRON_SCHEDULE}] set.`);
  }

  cron.schedule(CRON_SCHEDULE, async () => {
    await myAnonaMouseService.update();
  });
} else {
  console.log("CRON disabled.");
}

const app = express();
const PORT = process.env.PORT || 8030;

app.get("/update", async (req, res) => {
  let data = await myAnonaMouseService.update();
  res.send(data);
});

app.listen(PORT, () => {
  console.log(
    `MyAnonaMouse Dynamic Seedbox HTTP server listening on port ${PORT}`,
  );
});
