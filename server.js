const express = require( 'express' );
const websocket = require( 'ws' );
const http = require( 'http' );
const url = require( 'url' );
const app = express();

const server = http.createServer( app );

const ws = new websocket.Server({
    server
});

ws.on( 'connection', ( wsconnection, request, client ) => {
    wsconnection.send( JSON.stringify({newMessage :'Hi there, I am a websocket server. Welcome!'}) );
    //console.log("Request url", request.url )
    
    const ip = request.connection.remoteAddress;
    //console.log("Ip addres", ip)
    const pathname = url.parse(request.url).pathname;
    //console.log( "Path name", pathname );
    wsconnection.on( 'message', ( message ) => {
        //console.log( "Client", client)
        let obj = JSON.parse( message );

        console.log( obj );
        ws.clients.forEach( client => {
            if ( client != wsconnection ){
                client.send( message );
            }
        })
    });

    wsconnection.on('close', () => {
        console.log(`You didn't say goodbye`);
      });
});

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url);
    console.log( "Path name", pathname, request.url ); 
    if (pathname === '/room/foo') {
        ws.handleUpgrade(request, socket, head, function done(ws1) {
            ws.emit('connection', ws1, request);
        });
    } 
});

server.listen( 8080, () => {
    console.log( 'Server running in port 8080' );
});