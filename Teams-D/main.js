main();
async function main() {
  var pa = document.getElementById("pa");
  var snow = document.getElementById("snow");
  var speed = 1;
  var percentage = 0;
  var po_step = 200/100;
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
    await sleep(200);
  }
}

//CodePenでsleepが使えなかったため実装
/*function sleep (time) {
  window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000;//無限ループを制限しているものを回避するため
  return new Promise((resolve) => setTimeout(resolve, time))
}*/