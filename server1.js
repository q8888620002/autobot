var ipc=require('node-ipc');
const api = require("./api.js");


/// check balance of the account 
function checkbalance(){

}

/// check the state of the bot buyer or seller

function stateCheck(){

}

    ipc.config.id   = 'world';
    ipc.config.retry= 1500;

    ipc.serveNet(
        'udp4',
        function(){
            console.log('Api call start');
            ipc.server.on(
                'message',
                function(data,socket){
                    ipc.log('got a message from '.debug, data.from.variable );

                    ipc.server.emit(
                        socket,
                        'message',
                        {
                            from    : ipc.config.id,
                            message : data.message+' world!'
                        }
                    );
                }
            );
            ipc.server.on('bought', function(data){
                
    
            })

            ipc.server.on(
                'buySignal',
                function(data,socket){
                    api.getTicker('btcusdt').then(function(res){
                        var result = JSON.parse(res);
                        ipc.log('receive price at'+ result.ticker[0].last);
                        ipc.log('got a buy signal from '.debug, data.from.variable );
                        
                        //// call the buy api and send message 
                        //// if success -> change state to holder 
                        setTimeout(() => {
                            ipc.server.emit(
                                {
                                    address : '127.0.0.1', //any hostname will work
                                    port    : 8001
                                },
                                'sellSignal',
                                {
                                    from    : ipc.config.id,
                                    message : 'already send buy request at ' + result.ticker[0].last 
                                }
                            )
                        }, 1000);
                       
                    });
                }
            );

            ipc.server.on(
                'sellSignal',
                function(data,socket){

                    api.getTicker('btcusdt').then(function(res){
                        var result = JSON.parse(res);
                        ipc.log('receive price at'+ result.ticker[0].last);
                        ipc.log('got a buy signal from '.debug, data.from.variable );
                        
                        //// call the sell api and send message 
                        //// if success -> change state to holder 

                        setTimeout(() => {
                            ipc.server.emit(
                                {
                                    address : '127.0.0.1', //any hostname will work
                                    port    : 8001
                                },
                                'buySignal',
                                {
                                    from    : ipc.config.id,
                                    message : 'already send sell order at ' + result.ticker[0].last 
                                }
                            )
                        }, 1000);
                       
                    });

                }
            );

            //// check if already bought
            
            
            
            console.log(ipc.server);
        }
    );

    ipc.server.start();