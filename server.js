import 'dotenv/config';
import killPort from "kill-port";
import startServer from "./src/index.js";
import { createColorizedLogger } from "./Helper/helper.js";

async function executeServer() {
    const logger = createColorizedLogger();
    logger.info('Killing Server Port To Launch TLS Server...');
    killPort(process.env.TLS_SERVER_PORT).catch((error) => logger.error(`Failed to kill port ${process.env.TLS_SERVER_PORT}: ${error}`)).then(() => startServer());
};

executeServer();