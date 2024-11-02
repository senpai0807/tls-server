import fetch from 'node-fetch';

async function generateToken() {
    const url = 'http://localhost:3569/tlsToken';
    const payload = {
        method: "GET",
        url: "https://kith.com/",
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'priority': 'u=0, i',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
        },
        proxyConfig: null,
        forceHttp1: false,
        headerOrder: ['accept', 'accept-language', 'cache-control'],
        followRedirects: true,
        tlsClientIdentifier: "chrome_124",
        insecureSkipVerify: true,
        timeoutSeconds: 120
    };

    const options = {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    const response = await fetch(url, options)
    const responseBody = await response.json();
    const token = responseBody.token;

    return { token, payload };
};

async function test() {
    const { token, payload } = await generateToken();
    const url = 'http://localhost:3569/tlsClient';
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    }

    const response = await fetch(url, options);
    const responseBody = await response.json();
    console.log(responseBody);

};

test();