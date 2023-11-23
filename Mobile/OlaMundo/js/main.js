function myFunction() {
	  var x = document.getElementById("content-text");
	  if (x.innerHTML === "Olá Mundo") {
	    x.innerHTML = "Tizen";
	  } else {
	    x.innerHTML = "Olá Mundo";
	  }
	}