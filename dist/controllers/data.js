"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
var path = require("path");
const appRoot = require("app-root-path");
const baseDir = appRoot + "/data";
class DataController {
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.join(baseDir, "seatOrder.json");
            try {
                const data = yield fs.readFileSync(filePath);
                const lastModifiedDate = fs.statSync(filePath).mtime;
                return {
                    items: data ? JSON.parse(data) : [],
                    lastModifiedDate: lastModifiedDate,
                };
            }
            catch (ex) {
                console.log(ex);
                return { items: [] };
            }
        });
    }
    writeData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                fs.writeFileSync("data/seatOrder.json", JSON.stringify(data), "utf8");
                console.log("Data successfully saved");
            }
            catch (ex) {
                console.log("Error while writing data, " + ex);
            }
        });
    }
    getShuffledData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = [];
                const data = fs.readFileSync(path.join(baseDir, "data.json"));
                if (data) {
                    const parsedData = JSON.parse(data);
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
            }
            catch (ex) {
                return [];
            }
        });
    }
    sortArray(data) {
        return data.sort((a, b) => a.localeCompare(b));
    }
    shuffleArray(data) {
        return data
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }
}
exports.default = DataController;
