import koffi from 'koffi';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dllPath = join(__dirname, 'tls.dll');
const tlsClientLibrary = koffi.load(dllPath);
const request = tlsClientLibrary.func('string request(string)');

async function fetch(url, options) {
    return new Promise((resolve, reject) => {
        const freeMemory = tlsClientLibrary.func('void freeMemory(string)');
        const requestId = options.requestId ? options.requestId : uuidv4();
        const requestPayload = {
            tlsClientIdentifier: options.tlsClientIdentifier ? options.tlsClientIdentifier : 'safari_ios_16_0',
            followRedirects: options.followRedirects ? options.followRedirects : false,
            withDebug: false,
            insecureSkipVerify: options.insecureSkipVerify ? options.insecureSkipVerify : true,
            withoutCookieJar: false,
            withDefaultCookieJar: true,
            isByteRequest: false,
            catchPanics: true,
            forceHttp1: options.forceHttp1 ? options.forceHttp1 : false,
            withRandomTLSExtensionOrder: true,
            sessionId: requestId,
            timeoutSeconds: options.timeoutSeconds ? options.timeoutSeconds : 120,
            proxyUrl: options.proxyUrl ? options.proxyUrl : '',
            isRotatingProxy: false,
            certificatePinningHosts: {},
            requestUrl: url,
            requestMethod: options.method ? options.method : "GET",
            headerOrder: options.headerOrder ? options.headerOrder : [],
            requestBody: options.body ? options.body : '',
            headers: options.headers ? options.headers : {},
            requestCookies: options.requestCookies ? options.requestCookies : []
        };

        Promise.resolve()
            .then(() => request(JSON.stringify(requestPayload)))
            .then((response) => {
                const responseObject = JSON.parse(response);
                freeMemory(responseObject.id);
                resolve({
                    apiResponse: responseObject,
                    sessionId: requestId
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

async function getCookies(sessionId, url) {
    const payload = {
        sessionId: sessionId,
        url: url
    };

    const getCookiesFromSession = tlsClientLibrary.func('string getCookiesFromSession(string)');
    const cookiesResponse = getCookiesFromSession(JSON.stringify(payload));
    const cookies = JSON.parse(cookiesResponse);
    return cookies.cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
};

export {
    fetch,
    getCookies
};