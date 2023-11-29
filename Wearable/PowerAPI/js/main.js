//function myFunction() {
//	var screenBrightness = tizen.power.getScreenBrightness();
//	const input = document.querySelector("vol");
	//const value = document.querySelector("value");
	
//	value.textContent = input.value;
	//console.log(value)
	//i/nput.addEventListener("input", function(e){
	//	  value.textContent = event.target.value;
	//	});

	//tizen.power.setScreenBrightness(0.5);
	//
//}
function myFunction(){
const value = document.querySelector("#value");
const input = document.querySelector("#pi_input");
value.textContent = input.value;
input.addEventListener("input", function(e) {
  value.textContent = event.target.value;
  console.log(value.textContent);
  tizen.power.setScreenBrightness(value.textContent);
});
}