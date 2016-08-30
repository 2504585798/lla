function debug(msg) 
{
	var debugArea = $('debug-area')
	if(debugArea == null) {
		debugArea = document.createElement("div");
		debugArea.id = "debug-area";
		debugArea.style.top = "0px"
		debugArea.style.right = "0px"
		debugArea.style.width = "300px"
		debugArea.style.height = "100px"
		debugArea.style.position = "absolute"
		debugArea.style.border = "1px soplid #000"
		debugArea.style.overflow = "auto"
		
		document.body.appendChild(debugArea);
	}
	debugArea.innerHTML = msg + "<br/>" + debugArea.innerHTML;
}
