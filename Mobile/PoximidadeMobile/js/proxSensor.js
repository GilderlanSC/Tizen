var proxSensor = tizen.sensorservice.getDefaultSensor("PROXIMITY");


function onGetSuccessCB(sensorData)
{
	console.log("Nível de proximidade: " + sensorData.proximityState);
	if(sensorData.proximityState==="NEAR"){
		document.getElementById("output").innerHTML="Perto";
	}
	if(sensorData.proximityState==="FAR"){
		document.getElementById("output").innerHTML="Longe";
	}
	proxSensor.stop();
}

function onerrorCB(error)
{
	console.log("Erro ocorreu");
}

function onsuccessCB()
{
	console.log("O sensor iniciou");
	proxSensor.getProximitySensorData(onGetSuccessCB, onerrorCB);
}

window.addEventListener("load", function(){
	proxSensor.start(onsuccessCB);
});

var chamaFunção = setInterval(function(){
	proxSensor.start(onsuccessCB);
},1000);