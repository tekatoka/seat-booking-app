const fs = require("fs");
var path = require("path");
const appRoot = require("app-root-path");
const baseDir = appRoot + "/data";

export interface IData {
  names: string[];
  characters: string[];
}

export interface ISeatItem {
  name: string;
  character: string;
}

export interface IDataResponse {
  items: ISeatItem[];
  lastModifiedDate?: Date;
}

export default class DataController {
  public async getData(): Promise<IDataResponse> {
    const filePath = path.join(baseDir, "seatOrder.json");
    try {
      const data = await fs.readFileSync(filePath);
      const lastModifiedDate = fs.statSync(filePath).mtime;
      return {
        items: data ? JSON.parse(data) : [],
        lastModifiedDate: lastModifiedDate,
      };
    } catch (ex) {
      console.log(ex);
      return { items: [] };
    }
  }

  public async writeData(data: ISeatItem[]) {
    try {
      fs.writeFileSync("data/seatOrder.json", JSON.stringify(data), "utf8");
      console.log("Data successfully saved");
    } catch (ex) {
      console.log("Error while writing data, " + ex);
    }
  }

  public async getShuffledData(): Promise<ISeatItem[]> {
    try {
      const result: ISeatItem[] = [];
      const data = fs.readFileSync(path.join(baseDir, "data.json"));
      if (data) {
        const parsedData: IData = JSON.parse(data);

        const names = this.sortArray(parsedData.names);
        const shuffledCharacters = this.shuffleArray(parsedData.characters);

        names.forEach((name, i) => {
          result.push({
            name: name,
            character: shuffledCharacters[i] ? shuffledCharacters[i] : "",
          });
        });
      }
      return result;
    } catch (ex) {
      return [];
    }
  }

  private sortArray(data: string[]) {
    return data.sort((a, b) => a.localeCompare(b));
  }

  private shuffleArray(data: string[]) {
    return data
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
