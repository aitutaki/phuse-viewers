(function() {
	APP.events.subscribe("display photo", _display);

	function _display(img) {
		var angle = Math.floor(Math.random() * ((40 - 0 + 1) + 0)) - 20;
		var w = window.innerWidth;
		var h = window.innerHeight;

		var top = Math.floor(Math.random() * (65 - 45 + 1)) + 45;
		var left = Math.floor(Math.random() * (65 - 45 + 1)) + 45;

		top = top + "%";
		left = left + "%";

		var $div = $("<div></div>");
		$div.addClass("polaroid");
		$div.css("background-image", "url(" + img + "?size=orig)");
		$div.css("-webkit-transform", "rotate(" + angle + "deg)");
		$div.css("left", left);
		$div.css("top", top);
		$div.appendTo("#container");

		// Bit of a clean-up, remove old photos
		if ($("div.polaroid").length > 10) {
			$("div.polaroid:first").fadeOut(function() {
				$(this).remove();
			});
		}
	}

	function _tick(data) {
	};
})();
