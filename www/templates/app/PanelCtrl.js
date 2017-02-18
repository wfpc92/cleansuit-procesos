var PanelCtrl = function($scope, 
						OrdenesFactory,
						$state, 
						$log,
						$ionicHistory) {
	
	$log.debug("PanelCtrl", $scope.$id);
	var self = this;

	$scope.prenda = {};

	$scope.buscarPrenda = function() {
		
	};

};

app.controller('PanelCtrl', PanelCtrl);
