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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const node_cron_1 = __importDefault(require("node-cron"));
const cors_1 = __importDefault(require("cors"));
const data_1 = __importDefault(require("./controllers/data"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const router = express_1.default.Router();
const dataController = new data_1.default();
router.get("/", (req, res) => {
    res.send("Hello World From the Typescript Server!!!");
});
router.get("/seatOrder", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield dataController.getData();
    res.send(data);
}));
router.post("/newOrder", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield dataController.getShuffledData();
    yield dataController.writeData(data);
    res.status(201).json(data);
}));
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
node_cron_1.default.schedule("*/60 * * * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dataController.getShuffledData();
        yield dataController.writeData(data);
        console.log("shuffled new seat order: " + Date.now().toLocaleString());
    });
});
// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// }); 
app.use(`/.netlify/functions/api`, router);
module.exports.handler = (0, serverless_http_1.default)(app);
