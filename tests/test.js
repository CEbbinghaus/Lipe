const {Logger} = require("../lib/index");
const {Colorizer, Console, Simple} = require("../lib/defaults");

const logger = new Logger(Colorizer, Console);
const simpleLogger = new Logger(Simple, Console);

console.clear();

logger.Debug("Hello World!");
logger.Log("Hello World!");
logger.Info("Hello World!");
logger.Warn("Hello World!");
logger.Error("Hello World!");
logger.Critical("Hello World!");

console.log("---------------------------");

simpleLogger.Debug("Hello World!");
simpleLogger.Log("Hello World!");
simpleLogger.Info("Hello World!");
simpleLogger.Warn("Hello World!");
simpleLogger.Error("Hello World!");
simpleLogger.Critical("Hello World!");
