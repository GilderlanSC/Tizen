
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
