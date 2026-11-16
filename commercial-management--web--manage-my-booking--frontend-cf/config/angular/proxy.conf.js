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
import express from 'express';
const PROXY_IBERIA = 'http://proxyib.ib:80';

if (PersonalConfig?.LOCAL_STATIC_CONTENT_PATH?.length>0) {
    const app = express();
    // Configura la carpeta estática
    app.use('/iberia-web-content',express.static(PersonalConfig.LOCAL_STATIC_CONTENT_PATH));

    // Inicia el servidor
    app.listen(9208, () => {
        console.log('\nServing static files at port 9208\n');
    });
}


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
    },
    {
        context: '/iberia-web-content',
        target: 'https://int.iberia.com',
        secure: false,
        changeOrigin: true,
        logLevel: 'silent'
    }
];



function setupForCorporateProxy (proxyConfig) {
    const ignoreProxy = process.env.npm_config_ignore_proxy === 'true';

    if(PersonalConfig) {
        proxyConfig.forEach((data)=> {
            if (akamaiPersonalHeader.Authorization2) {
                data.onProxyReq = (proxyReq, req) => {
                    req.origin = data.target;
                    proxyReq.setHeader('Authorization2', akamaiPersonalHeader.Authorization2);
                };
            }
            if (data.context.indexOf('iberia-web-content') > -1 && PersonalConfig.LOCAL_STATIC_CONTENT_PATH) {
                data.target = 'http://localhost:9208';
                delete data.bypass;
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
