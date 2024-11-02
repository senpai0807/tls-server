import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import { fetch } from '../../Helper/TLS Client/tls.js';
import { createColorizedLogger } from '../../Helper/helper.js';

const router = express.Router();
const logger = createColorizedLogger();

router.post('/tlsClient', (req, res) => {
    let proxyUrl = '';
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).json({ message: "Authorization Header Required" });
    };

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TLS_SECRET_KEY);
    const payload = req.body;
    const payloadString = JSON.stringify(payload);
    const sha256Hash = crypto.createHash('sha256').update(payloadString).digest('hex');
    if (decoded.hash !== sha256Hash) {
        return res.status(401).json({ message: "Unauthorized Request Detected" });
    }

    logger.info(`Received Request [tlsClient Route]`);
    if (payload.proxyConfig) {
        proxyUrl = `http://${payload.proxyConfig.username}:${payload.proxyConfig.passwordProxy}@${payload.proxyConfig.ip}:${payload.proxyConfig.port}`;
    };

    const tlsOptions = {
        method: payload.method, // String | Required
        headers: payload.headers, // Object | Required
        ...(payload.method !== 'GET' && { body: payload.tlsPayload }), // Include body only if method is not GET
        proxyUrl: proxyUrl, // String | Optional
        forceHttp1: payload.forceHttp1, // Boolean | Optional
        headerOrder: payload.headerOrder, // Array | Optional
        followRedirects: payload.followRedirects, // Boolean | Optional
        tlsClientIdentifier: payload.tlsProfile, // String | Required
        insecureSkipVerify: payload.insecureSkipVerify, // Boolean | Optional
        timeoutSeconds: payload.timeout // Integer | Time In MS
    };

    fetch(payload.url, tlsOptions).then((response) => {
        logger.http(`Forwarded Request Returned Status - ${response.apiResponse.status}`);
        return res.status(response.apiResponse.status).json({ response: response });
    }).catch((error) => {
        logger.error(`Error In /tlsClient Route: ${error}`);
        res.status(500).json({ message: "Internal Server Error", error: "Failed To Make TLS Request, Please Try Again" });
    });
});

export default router;