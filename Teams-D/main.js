main();
async function Post_Data(percentage){
  var xhr = new XMLHttpRequest();
  xhr.open('POST','https://script.google.com/macros/s/AKfycby9ELFxTwCdMXautZiB3s_ajf8QTaJuOwn2yXsuL9eINSctrn8/exec');
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8','Access-Control-Allow-Origin');
  xhr.send( 'data='+percentage );
}
async function main() {
  var pa = document.getElementById("pa");
  var snow = document.getElementById("snow");
  var speed = 1;
  var percentage = 0;
  var po_step = 200/100;
  DD = new Date();
  old_Minutes = DD.getMinutes();
  for (;;) {
    percentage = percentage + speed;
    valume = percentage * po_step;
    snow.style.top = (200-valume)+"px";
    snow.style.height = valume+"px";
    pa.style.top = (200-valume)+"px";
    pa.innerHTML = percentage +"%"
    if(percentage >= 100 || percentage <= 0){
      speed = speed * -1;
    }
    DD = new Date();
    Minutes = DD.getMinutes();
    if((Minutes%10 == 0 ) && Flag == 0){
      await Post_Data(percentage);
      old_Minutes = Minutes;
      console.log("Time:"+Minutes+"  Data:"+percentage);
      Flag = 1;
    }else if(Minutes != old_Minutes){
      Flag = 0;
    }
    await sleep(200);
  }
}
//https://script.google.com/macros/s/AKfycby9ELFxTwCdMXautZiB3s_ajf8QTaJuOwn2yXsuL9eINSctrn8/exec
//curl -L https://script.google.com/macros/s/AKfycby9ELFxTwCdMXautZiB3s_ajf8QTaJuOwn2yXsuL9eINSctrn8/exec -F 'sheetName=SnowData' -F 'data=4.4'
//CodePenでsleepが使えなかったため実装
/*function sleep (time) {
  window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000;//無限ループを制限しているものを回避するため
  return new Promise((resolve) => setTimeout(resolve, time))
}*/