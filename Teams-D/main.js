// noprotect (JSBin の無限ループ検知・停止機能を無効化)

//main();
slack();
async function slack(){
  var request = require('request');
  request.post({
  uri: 'https://hooks.slack.com/services/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',
  headers: { 'Content-Type': 'application/json' },
  json: {
  username: 'namaenamae',
  icon_emoji: ':ghost:',
  text: 'hogehogehoge'
  }
  }, function(error, response, body){
  if (!error && response.statusCode === 200) {
  console.log(body);
  } else {
  console.log('error');
  }
  });
};

async function main() {
  var head = document.getElementById("head");
  var ledView = document.getElementById("ledView");
  var x = 300;
  var y = 300;
  head.innerHTML = "started";
  var i2cAccess = await navigator.requestI2CAccess();
  head.innerHTML = "initializing...";
  var port = i2cAccess.ports.get(1);
  var gesture = new PAJ7620(port, 0x73);
  var speed = 10;
  var col = 3;
  await gesture.init();
  await slack();
  await sleep(50000);
  for (;;) {
    var v = await gesture.read();
    if(v != "----"){
      if(v == "up"){
        x = x - speed;
      }
      if(v == "down"){
        x = x + speed;
      }
      if(v == "left"){
        y = y - speed;
      }
      if(v == "right"){
        y = y + speed;
      }
      if(v == "forward"){
        col = col + 1;
        if(col >= 5){
          col = 5;
        }
      }
      if(v == "back"){
        col = col - 1;
        if(col <= 1){
          col = 1;
        }
      }
      ledView.style.top = x+"px";
      ledView.style.left = y+"px";
      ledView.style.backgroundColor = "rgb("+255/col+","+255/col+","+255/col+")"
      
    }
    head.innerHTML = v;
    await sleep(500);
  }
}
