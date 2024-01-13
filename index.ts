import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cron from "node-cron";
import cors from "cors";
import DataController, {
  IData,
  IDataResponse,
  ISeatItem,
} from "./controllers/data";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

const dataController = new DataController();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World From the Typescript Server!!!");
});

app.get("/seatOrder", async (req: Request, res: Response) => {
  const data: IDataResponse = await dataController.getData();
  res.send(data);
});

app.post("/newOrder", async (req: Request, res: Response) => {
  const data: ISeatItem[] = await dataController.getShuffledData();
  await dataController.writeData(data);
  res.status(201).json(data);
});

//  ┌────────────── second (0 - 59) (optional)
//  │ ┌──────────── minute (0 - 59)
//  │ │ ┌────────── hour (0 - 23)
//  │ │ │ ┌──────── day of the month (1 - 31)
//  │ │ │ │ ┌────── month (1 - 12)
//  │ │ │ │ │ ┌──── day of the week (0 - 6) (0 and 7 both represent Sunday)
//  │ │ │ │ │ │
//  │ │ │ │ │ │
//  * * * * * *

//*/15 * * * * * == "every 15 seconds"

cron.schedule("*/60 * * * * *", async function () {
  const data: ISeatItem[] = await dataController.getShuffledData();
  await dataController.writeData(data);
  console.log("shuffled new seat order: " + Date.now().toLocaleString());
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); 
