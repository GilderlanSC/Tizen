var lightSensor = tizen.sensorservice.getDefaultSensor("LIGHT");



function onGetSuccessCB(sensorData)
{
	console.log("Nível de luz: " + sensorData.lightLevel);
	document.getElementById("output").innerHTML = sensorData.lightLevel;
	if(sensorData.lightLevel<30000){
		document.getElementById("estado").innerHTML = "Começou a escurecer!";
	}else{
		document.getElementById("estado").innerHTML = "Tudo claro!";
		
	}
}

function onerrorCB(error)
{
	console.log("Erro ocorreu");
}

function onsuccessCB()
{
	console.log("O sensor iniciou");
	lightSensor.getLightSensorData(onGetSuccessCB, onerrorCB);
}

window.addEventListener("load", function(){
	lightSensor.start(onsuccessCB);
});

var chamaFunção = setInterval(function(){
	lightSensor.start(onsuccessCB);
},1000);