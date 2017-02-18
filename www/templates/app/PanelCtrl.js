var PanelCtrl = function($scope, 
						PrendaFactory,
						$state, 
						$log,
						$ionicHistory) {
	
	$log.debug("PanelCtrl", $scope.$id);
	var self = this;

	$scope.prenda = {};

	$scope.buscarPrenda = function() {
		PrendaFactory
		.buscarPrenda($scope.prenda.codigo)
		.then(function(prenda) {
			if (prenda) {
				$scope.prenda = prenda;
			}
		});
	};

};

app.controller('PanelCtrl', PanelCtrl);
