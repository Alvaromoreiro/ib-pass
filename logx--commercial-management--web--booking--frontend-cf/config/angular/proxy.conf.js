/**
 * PersonalConfig:
 *  Files that is untracked and contains the akamai key for int environment and the path of iberia-web-content if desired
 *  AKAMAI_AUTH_HEADER: Contains Akamai Authorization Key
 *  LOCAL_STATIC_CONTENT_PATH: Absolute path of iberia-web-content repository.
 *      If provided anther server will be launch to allow local app to retrive the statics from the specified local folder
 */
let PersonalConfig = {};
try {
    PersonalConfig = require('./personalLocalConf.json') ;
} catch(e){}
const HttpsProxyAgent = require('https-proxy-agent');
const PROXY_IBERIA = 'http://proxyib.ib:80';




const akamaiPersonalHeader = {Authorization2: PersonalConfig?.AKAMAI_AUTH_HEADER };
const PROXY_CONFIG = [
    {
        context: '/cs',
        target: 'https://int.iberia.com',
        secure: false,
        logLevel: 'silent'
    },
    {
        context: '/wcs',
        target: 'https://int.iberia.com',
        secure: false,
        logLevel: 'silent'
    }
];



function setupForCorporateProxy (proxyConfig) {
    const ignoreProxy = process.env.npm_config_ignore_proxy === 'true';

    if(PersonalConfig) {
        proxyConfig.forEach((data)=> {
            if(akamaiPersonalHeader.Authorization2){
                data.onProxyReq = (proxyReq, req) => {
                    req.headers ??= {};
                    req.origin = data.target;
                    Object.assign(req.headers, akamaiPersonalHeader);
                    proxyReq.setHeader('Authorization2', akamaiPersonalHeader.Authorization2);
                    proxyReq.setHeader('origin', data.target);
                };
            }

        })
    }
    if(!ignoreProxy) {
        const agent = new HttpsProxyAgent(PROXY_IBERIA);
        console.log('Using corporate proxy server: ' + PROXY_IBERIA);
        proxyConfig.forEach(entry => {
            entry.agent = agent;
        });
    }
    return proxyConfig;
}

module.exports = setupForCorporateProxy(PROXY_CONFIG);
