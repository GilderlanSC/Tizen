window.addEventListener("load", function() {
	/* Defines the error callback. */
	function errorCallback(error)
	{
	  console.log("O seguinte erro aconteceu: " + error.name);
	}

	/* Defines PermissionRequestSuccessCallback. */
	function permissionRequestSuccess(result)
	{
		var v;
	  for (v in result)
	  {
	    console.log(
	        "A escolha feita pelo usuário para " + result[v].privilege + " foi de: " + result[v].result);
	  }
	}

	var privileges =
	    ["http://tizen.org/privilege/externalstorage", "http://tizen.org/privilege/mediastorage"];
	tizen.ppm.requestPermissions(privileges, permissionRequestSuccess, errorCallback);
	
});

window.addEventListener("click", function() {
	var model;
	
	model = tizen.ml.single.openModel("documents/mobilenet.tflite", null, null, "TENSORFLOW_LITE", "ANY");
	console.log("O modelo foi aberto com sucesso");
	  
	/* Do inference here */
	var inputTensorsInfo = model.input;
	var inputTensorsData = inputTensorsInfo.getTensorsData();
	var inputData = new Uint8Array(224 * 224 * 3);
	inputTensorsData.setTensorRawData(0, inputData);
	
	var tensorsDataOut = model.invoke(inputTensorsData);
	console.log(tensorsDataOut.getTensorRawData(0));
	
	tensorsDataOut.dispose();
	inputTensorsData.dispose();
	inputTensorsInfo.dispose();
	model.close();	

});

