import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { Worker } from 'worker_threads';
import { createColorizedLogger } from '../Helper/helper.js';

const logger = createColorizedLogger();
const __dirname = dirname(fileURLToPath(import.meta.url));

async function startServer() {
    const port = process.env.TLS_SERVER_PORT;
    const workerPath = resolve(__dirname, './Config/worker.js');
    const worker = new Worker(workerPath, {
        workerData: { port }
    });

    worker.on('message', (message) => {
        if (message.error) {
            logger.error(`Error from worker: ${message.error}`);
        } else if (message.resId) {
            logger.verbose(`Worker response: ${message.status} - ${message.body}`);
        } else {
            logger.verbose(`Worker started on port ${message.port}`);
        }
    });

    worker.on('error', (error) => {
        logger.error(`Worker error: ${error.message}`);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            logger.error(`Worker stopped with exit code ${code}`);
        } else {
            logger.info(`Worker stopped successfully with exit code ${code}`);
        }
    });
};

export default startServer;