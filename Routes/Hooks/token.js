import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createColorizedLogger } from '../../Helper/helper.js';

const router = express.Router();
const logger = createColorizedLogger();

router.post('/tlsToken', (req, res) => {
    const payload = req.body;
    logger.info(`Received Request [tlsToken Route]`);

    const payloadString = JSON.stringify(payload);
    const sha256Hash = crypto.createHash('sha256').update(payloadString).digest('hex');
    new Promise((resolve, reject) => {
        jwt.sign({ hash: sha256Hash }, process.env.TLS_SECRET_KEY, { expiresIn: '300000' }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    })
    .then(token => {
        res.status(200).json({ token: token, message: "Token generated successfully" });
    })
    .catch(error => {
        logger.error("Token generation failed:", error);
        res.status(500).json({ message: "Token Generation Failed" });
    });
});

export default router;