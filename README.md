# TLS Server
- This repo is a TLS server that makes use of the bogdanfinn [tls-client](https://github.com/bogdanfinn/tls-client). The purpose of it is to forward a request through a TLS Client for sites that either has strict fingerprint or you need to mimic a specific browser or device.

## How To Install
```
1. git clone https://github.com/senpai0807/tls-server.git
2. cd tls-server
3. npm install
4. npm start
```

## Information
- This TLS server utilizes the Express framework to initialize an HTTP server, as well as the worker_threads library to handle load of multiple simultanious requests.
- To prevent abuse, this tls server also utilizes the helmet middleware to secure HTTP headers that are returned from the server, as well as utilizes an authorization header that must be passed to validate all requests.
- There are two POST routes: /tlsToken & /tlsClient and to make a request to the /tlsClient, you must POST to /tlsToken to receive a token and to do so, you simply pass the payload you wish to send to the /tlsclient to the /tlsToken. the payload you send to /tlsToken **MUST** match the payload you send to /tlsClient
- If it gets confusing on how to use this repo, refer to the test.js I've included which has an example on how to make a request to both endpoints.

## Documentation
- **Endpoint:** `/tlsClient` & `/tlsToken`
- **Method:** `POST`
- **Additonal Information:** [bogdanfinn TLS Documentation](https://bogdanfinn.gitbook.io/open-source-oasis)
**Payload:**
| Payload | Description | Optional | Default |
| ------- | ----------- | -------- | ------- |
| method | HTTP Request Method | ❌ | GET |
| url | Request URL | ❌ | N/A |
| tlsPayload | Payload To Send | Only Optional For GET | N/A |
| proxyConfig | Proxy Config For Request | ✅ | N/A |
| forceHttp1 | Force HTTP 1.0 | ✅ | HTTP 2.0 |
| headerOrder | Header Order For Request | ✅ | N/A |
| followRedirects | Boolean - To Follow All Redirects | ✅ | true |
| tlsClientIdentifier | TLS CLient Profile | ✅ | chrome_124 |
| insecureSkipVerify | Boolean - Skip SSL Verify | ✅ | true |
| timeoutSeconds | Request Timeout In MS | ✅ | 120 |

### Contribution
- You are more than welcomed to fork this repo or take it as your own. My main purpose on publishing it is because a majority of TLS related projects are mainly in Go & Python so I felt that JS developers were needing a project to suit their needs in their stack.
