const Converter = require('api-spec-converter');
const OpenApiConverter = require('swagger2openapi');

module.exports = function (RED) {

    function to_swagger2(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        node.on('input', message => {
            Converter.convert({
                from: 'openapi_3',
                to: 'swagger_2',
                source: message.payload
            }, function (err, converted) {
                if (err) {
                  console.error(err);
                  node.error(err);
                  node.status({ fill: 'red', shape: 'ring', text: 'error'});
                  return;
                }
                if (converted) {
                  let result = converted.stringify();
                  node.send({payload: result});
                  node.status({ fill: 'green', shape: 'dot', text: 'finish'});
                }else{
                  node.status({ fill: 'red', shape: 'ring', text: 'fail'});
                }
            });
        });
    }
    RED.nodes.registerType('swagger2', to_swagger2);

    function converterTo3(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', message => {
            if(!message || !message.payload){
              node.error(err);
              node.status({ fill: 'red', shape: 'ring', text: 'no input'});
              return;
            }
            let options = {};
            OpenApiConverter.convertStr(message.payload, options, function (err, options) {
              if (err) {
                console.error(err);
                node.error(err);
                node.status({ fill: 'red', shape: 'ring', text: 'error'});
                return;
              }
              if(!options || !options.openapi){
                node.error(err);
                node.status({ fill: 'red', shape: 'ring', text: 'fail'});
                return;
              }
              node.send({payload: options.openapi});
              node.status({ fill: 'green', shape: 'dot', text: 'success'});
            });
        });
    }

    RED.nodes.registerType('OpenAPI3', converterTo3);

}
