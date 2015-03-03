(function() {
	APP.events.subscribe("display photo", _display);

	function _display(img) {
    var $div = $(".slide");
    if ($div.length == 0)
    {
  		$div = $("<div class=\"slide\"></div>").appendTo("#container");
    }
    $div.fadeOut("slow", function() {
  		$div.css("background-image", "url(" + img + ")");
      $div.fadeIn("slow");
    });
	}

	function _tick(data) {
	};
})();
