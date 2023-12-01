var accSensor = tizen.sensorservice.getDefaultSensor("GYROSCOPE");

function onGetSuccessCB(sensorData)
{
	console.log("Aceleração X: " + sensorData.x);
	console.log("Aceleração Y: " + sensorData.y);
	console.log("Aceleração Z: " + sensorData.z);
	document.getElementById("outputX").innerHTML = sensorData.x +" graus/s";
	document.getElementById("outputY").innerHTML = sensorData.y +" graus/s";
	document.getElementById("outputZ").innerHTML = sensorData.z +" graus/s";
}

function onerrorCB(error)
{
	console.log("Erro ocorreu");
}

function onsuccessCB()
{
	console.log("O sensor iniciou");
	accSensor.getGyroscopeSensorData(onGetSuccessCB, onerrorCB);
	
}

window.addEventListener("load", function(){
	accSensor.start(onsuccessCB);
});

var chamaFunção = setInterval(function(){
	accSensor.start(onsuccessCB);
},2000);