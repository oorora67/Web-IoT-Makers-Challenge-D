//main();
var microBitBle;
var vl53;
var MaxWSensorP0;
var MinWSensorP1;

var WValveP8;
var WValveP16;

var readEnable;

async function connect(){
	microBitBle = await microBitBleFactory.connect();
  msg.innerHTML=("micro:bit BLE接続しました。");
  
  var gpioAccess = await microBitBle.requestGPIOAccess();
	var mbGpioPorts = gpioAccess.ports;
  MaxWSensorP0 = mbGpioPorts.get(0);
  await MaxWSensorP0.export("analogin"); //port2 analogin : pull none
  MinWSensorP1 = mbGpioPorts.get(1);
  await MinWSensorP1.export("analogin"); 
  WValveP8 = mbGpioPorts.get(8);
  await WValveP8.export("out");
  WValveP16 = mbGpioPorts.get(16);
  await WValveP16.export("out");

	var i2cAccess = await microBitBle.requestI2CAccess();
	var i2cPort = i2cAccess.ports.get(1);
	msg.innerHTML=("VL53L0Xを初期化しています（10秒程かかります・・）");
	vl53 = new VL53L0X(i2cPort, 0x29);
	await vl53.init();
	readEnable = true;
	readData();
}
async function disconnect(){
	readEnable = false;
	await microBitBle.disconnect();
	msg.innerHTML=("micro:bit BLE接続を切断しました。");
}

async function Post_Data(distance){
  var xhr = new XMLHttpRequest();
  xhr.open('POST','https://script.google.com/macros/s/AKfycby9ELFxTwCdMXautZiB3s_ajf8QTaJuOwn2yXsuL9eINSctrn8/exec');
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8','Access-Control-Allow-Origin');
  xhr.send( 'data='+distance );
}
async function main() {
  var pa = document.getElementById("pa");
  var snow = document.getElementById("snow");
  var po_step = 200/1000;
  var gpioAccess = await navigator.requestGPIOAccess(); // writeと一緒。
  var SWPort5 = gpioAccess.ports.get(5); // Port 5 を取得
  await SWPort5.export("in"); // Port 5 を「入力モード」に。
  var LEDPort26 = gpioAccess.ports.get(26); // Port 5 を取得
  await LEDPort26.export("out");
  
  DD = new Date();
  old_Minutes = DD.getMinutes();
  while ( readEnable ){
    var distance = await vl53.getRange();
    var MaxWVolume = await MaxWSensorP0.read();
    var MinWVolume = await MinWSensorP1.read();
    distance = 1000-distance;
    valume = distance * po_step;
    if(distance<=0){
      valume = 0;
      distance = 'ERROR';
    }
    valume = distance * po_step;
    snow.style.top = (200-valume)+"px";
    snow.style.height = valume+"px";
    pa.style.top = (200-valume)+"px";
    pa.innerHTML = distance +" mm"
    DD = new Date();
    Minutes = DD.getMinutes();
    if(await SWPort5.read()==0){ // Port 5の状態を読み込む){
      while(SWPort5.read()==0){
      }
      await WValveP8.write(1);
      await sleep(2000);
      await WValveP16.write(0);
    }
    if(MinWVolume<=50){
      await LEDPort26.write(0);
    }else{
      await LEDPort26.write(1);
    }
    if(MaxWVolume>=80){
      await WValveP16.write(1);
    }else{
      await WValveP16.write(0);
    }
    if((Minutes%10 == 0 ) && Flag == 0){
      await Post_Data(distance);
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