module.exports = {
    open: true,
    staticIndex: 'index.html',
    hostname: '127.0.0.1',
    port: 9108,
    rewrite: [{
        from: '/iberia-web-content/(.*)',
        to: 'https://pree.iberia.es/iberia-web-content/$1'
    },{
        from: '/cs/(.*)',
        to: 'https://preb.iberia.es/cs/$1'
    },{
        from: '/(.*)',
        to: '/build/$1'
    }]
};
