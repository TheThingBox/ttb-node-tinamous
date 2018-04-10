module.exports = function(RED) {
  var request = require('request');

  function sendTinamous(account, basic_key, field, value, timestamp, format) {
    var date = new Date(timestamp);
    var shift = ((date.toTimeString().substr(12,5))*-1).toString();

    date = date.toISOString();
    shift = shift.replace(shift.substr(1,1), "0"+shift.substr(1,1)+":");

    if (format == "realt") {
      date = date.replace("Z", "+00:00");
    } else {
      date = date.replace("Z", shift);
    }

    var msg = JSON.stringify({
      field: value,
      Date: date
    });

    var myUrl = `https://${account}.Tinamous.com/api/v1/Measurements`;
    var user = "Basic "+basic_key;

    request.post({
      headers : {
        "Authorization" : user,
        "Content-type" : "application/json"
      },
      url : myUrl,
      body : msg
    }, function(error, response, body) {
      if(error) {
        console.log("\n[Tinamous] Error sending data\n");
      }
    });
  }

  function TinamousNode(n) {
    RED.nodes.createNode(this,n);
    this.account = n.account;
    this.basic_key = n.basic_key;
    this.basic_key = n.basic_key;
    this.format = n.format;
    var node = this;

    this.on("input", function(msg) {
      var account = msg.account||node.account;
      var basic_key = msg.basic_key||node.basic_key;
      var field = msg.field||node.field;
      var format = msg.format||node.format;
      var value = msg.payload;
      var timestamp =  msg.timestamp || Date.now();
      sendTinamous(account, basic_key, field, value, timestamp, format);
    });
  }
  RED.nodes.registerType("tinamous",TinamousNode);
}
