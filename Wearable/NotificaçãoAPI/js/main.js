function myFunction() {
	try
	{
	  var appControl = new tizen.ApplicationControl(
	      "http://tizen.org/appcontrol/operation/view", null, "image/jpg", null);

	  var notificationGroupDict =
	  {
	    content: "This is a simple user notification.",
	    actions: {soundPath: "music/Over the horizon.mp3", vibration: true, appControl: appControl}
	  };

	  /* Cria uma notificação. */
	  var notification =
	      new tizen.UserNotification("SIMPLE", "Olá Mundo", notificationGroupDict);
	  tizen.notification.post(notification);
	}
	catch (err)
	{
	  console.log(err.name + ": " + err.message);
	}
}
