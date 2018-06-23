var ipc=require('node-ipc');
const api = require("./api.js");




ipc.config.id   = 'hello';
    ipc.config.retry= 1500;

    ipc.serveNet(
        8001,
        'udp4',
        function(){

            ipc.server.on(
                'message',
                function(data){
                    ipc.log('got Data');
                    ipc.log('got a message from '.debug, data.from.variable ,' : '.debug, data.message.variable);
                }
            );

          
            ipc.server.emit(
                {
                    address : '127.0.0.1', //any hostname will work
                    port    : ipc.config.networkPort
                },
                'buySignal',{
                    from    : ipc.config.id,
                    message :'bought at 10000 usdt'
                }
                
            );


            ipc.server.on(
                'buySignal',
                 data => {
                    api.getTicker('btcusdt').then(function(res){
                        var result = JSON.parse(res);
                        ipc.log('receive price at'+ result.ticker[0].last);
                        ipc.log('got a buy signal from '.debug, data.from.variable );
                        
                        //// call the buy api and send message 
                        //// if success -> change state to holder 

                        ipc.server.emit(
                            {
                                address : '127.0.0.1', //any hostname will work
                                port    : ipc.config.networkPort
                            },
                            'sellSignal',
                            {
                                from    : ipc.config.id,
                                message : 'already send buy request at ' + result.ticker[0].last 
                            }
                        )
                    });

                   
                }
            );

            ipc.server.on(
                'sellSignal',
                 data => {

                    api.getTicker('btcusdt').then(function(res){
                        var result = JSON.parse(res);
                        ipc.log('receive price at'+ result.ticker[0].last);
                        ipc.log('got a buy signal from '.debug, data.from.variable );
                        
                        //// call the sell api and send message 
                        //// if success -> change state to holder 

                        ipc.server.emit(
                            {
                                address : '127.0.0.1', //any hostname will work
                                port    : ipc.config.networkPort
                            },
                            'buySignal',
                            {
                                from    : ipc.config.id,
                                message : 'already send sell order at ' + result.ticker[0].last 
                            }
                        )
                    });

                }
            );



        }
    );

    ipc.server.start();