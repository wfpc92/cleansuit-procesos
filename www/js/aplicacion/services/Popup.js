
var PopupFactory = function($ionicPopup) {
	return {
		active: false, 

		alert : function(opt) {
			var self = this;

			if(self.active) {
				return;
			}

			self.active = true;

			return $ionicPopup.alert(opt)
			.then(function(res) {
				self.active = false;
				return res;
			});
		}
	};
};

app.factory("PopupFactory", PopupFactory);
