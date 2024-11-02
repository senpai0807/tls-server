import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import { parentPort, workerData } from 'worker_threads';
import routes from '../../Routes/index.js';
import { createColorizedLogger } from '../../Helper/helper.js';

const app = express();
const port = workerData.port;
const logger = createColorizedLogger();


app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.listen(port, () => {
    logger.info(`TLS Client Server Is Now Online @ Port: ${port}`);
});

Object.keys(routes).forEach(route => {
    const { post } = routes[route];
    if (post) {
        app.post(route, post);
    }
});

parentPort.on('message', ({ req, res }) => {
    const mockReq = { method: req.method, url: req.url, body: req.body };
    const mockRes = {
        status: (code) => ({
            send: (body) => parentPort.postMessage({ status: code, body, resId: res.id })
        }),
        send: (body) => parentPort.postMessage({ status: 200, body, resId: res.id })
    };

    const routeHandler = routes[req.url] && routes[req.url][req.method.toLowerCase()];

    if (!routeHandler) {
        return mockRes.status(404).send('Not Found');
    }

    Promise.resolve(routeHandler(mockReq, mockRes)).catch(error => parentPort.postMessage({ error: error.message, resId: res.id }));
});