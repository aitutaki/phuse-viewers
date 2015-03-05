var APP = (function() {
	var _app = {};
	_app.data = {new:[], old:[]};
	_app.debug = false;
	_app.albumId = _param("albumId");
	_app.pwd = _param("pwd");

	var _url = "http://www.phuse-app.com/api/Photos";
	var _viewURL = "http://www.phuse-app.com/";
	var _lastPoll = null;
	var _idx = 0;

	/***************************************************
	   PUB/SUB stuff
	****************************************************/
	function EVENT_SUBSCRIPTION(event, handler) {
		this.ev = event;
		this.handler = handler;
	}

	_app.events = {};
	_app.events.subscriptions = [];
	_app.events.subscribe = function(event, handler) {
		_app.events.subscriptions.push(new EVENT_SUBSCRIPTION(event, handler));
	};

	// Even the APP object needs to subscribe to events.
	_app.events.subscribe("refresh photos", function() {
		_getPhotos(_app.albumId, _app.pwd, _lastPoll);
	});

	_app.events.subscribe("get next photo", function() {
		_showAPhoto();
	});

	_app.events.publish = function(event, data) {
		for (var i=0; i < _app.events.subscriptions.length; i++) {
			var _sub = _app.events.subscriptions[i];
			if (_sub.ev == event) {
				_sub.handler(data);
			}
		}
	};

	function _param(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	function _showAPhoto() {
		var _disp = null;
		// The consumer doesn't care where the photo came from
		// just return something to display.
		if (_app.data && _app.data["old"] && _app.data["old"].length > 0) {
			if (_app.data["new"].length > 0) {
				// Move the new photo to the old list, so we can reuse it.
				var rec = _app.data["new"].pop();
				_disp = _viewURL + rec.VirtualResource;
				_app.data["old"].push(rec);
				_app.events.publish("display photo", _disp);
			}
			else
			{
				_disp = Math.floor(Math.random() * (_app.data["old"].length-1 - 0 + 1));
				_app.events.publish("display photo", _viewURL + _app.data["old"][_disp].VirtualResource);
				_getPhotos(_app.albumId, _app.pwd, _lastPoll);
			}
		}
		else
		{
			_getPhotos(_app.albumId, _app.pwd, _lastPoll);
		}
	}

	function _getPhotos(album, pwd, dt) {
		var getURL = _url + "?albumId=" + album + "&password=" + pwd;
		if (dt) getURL += "&lastPolledOn=" + dt.toJSON();
		_lastPoll = new Date();

		if (_app.debug) {
			_app.data = {
				"new": ["photos/Penguins.jpg", "photos/Jellyfish.jpg", "photos/Chrysanthemum.jpg",
								"photos/Desert.jpg", "photos/Hydrangeas.jpg", "photos/Koala.jpg",
								"photos/Lighthouse.jpg", "photos/Tulips.jpg"],
				"old": []
			};
			var rec = _app.data["new"].pop();
			_app.data["old"].push(rec);
			_app.events.publish("display photo", _viewURL + rec.VirtualResource);
			return true;
		}

		$.ajax({
			url: getURL,
			method: "GET",
			success: function(data, status, xhr) {
				if (!_app.data) _app.data = {
					"new": [],
					"old": []
				};
				var rec;
				_app.data["new"] = data.Photos || [];
				if (_app.data["new"].length == 0) {
					rec = _viewURL + _app.data["old"][Math.floor(Math.random() * (_app.data["old"].length-1 - 0 + 1))];
				}
				else
				{
					rec = _app.data["new"].pop();
					_app.data["old"].push(rec);
				}

				// _app.events.publish("display photo", _viewURL + rec.VirtualResource);
				//_app.events.publish("get next photo", _viewURL + rec.VirtualResource);
			},
			error: function() {
				// I think we ignore this for now... maybe count
				// the errors and present a msg after 3 or so.
			}
		});
	}

	//window.setInterval(function() {
	//	_app.events.publish("get next photo");
	//}, 10000);

	$("button").click(function() {
		_app.events.publish("get next photo");
	});

	return _app;
})();
