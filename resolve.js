const dns = require('dns');
const fs = require('fs');
dns.setServers(['8.8.8.8']);
dns.resolveSrv('_mongodb._tcp.cluster0.qfllf8j.mongodb.net', (err, addrs) => {
    dns.resolveTxt('cluster0.qfllf8j.mongodb.net', (err2, txts) => {
        fs.writeFileSync('resolve.json', JSON.stringify({addrs: addrs||[], txt: txts||[]}, null, 2));
    });
});
