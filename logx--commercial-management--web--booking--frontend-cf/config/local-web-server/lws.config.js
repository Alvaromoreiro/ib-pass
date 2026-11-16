
module.exports = {
    open: true,
    staticIndex: 'index.html',
    hostname: '127.0.0.1',
    port: 9107,
    rewrite: [{
        from: '/iberia-web-content/(.*)',
        to: 'https://preb.iberia.es/iberia-web-content/$1'
    },{
        from: '/(.*)',
        to: '/build/$1'
    }]

};
