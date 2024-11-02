// --------- Express Route Hooks --------- \\
import tlsToken from './Hooks/token.js';
import tlsClient from './Hooks/request.js';


export default {
    '/tlsToken': { post: tlsToken },
    '/tlsClient': { post: tlsClient }
};