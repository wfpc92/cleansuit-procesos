var RecoleccionProductoCtrl = function($scope,
							$stateParams,
							ProductosFactory,
							OrdenesFactory,
							$ionicHistory,
							$state,
							$log) {

	$log.debug("RecoleccionProductoCtrl", $scope.$id);

	$scope.indexOrden = $stateParams.indexOrden;
	$scope.infoOrden = OrdenesFactory.ordenesRecoleccion[$scope.indexOrden];

	$scope.indexProducto = $stateParams.indexProducto;
	$scope.producto = ProductosFactory.productos[$scope.indexProducto];
	
	$scope.regresarCatalogo = function() {
		$ionicHistory.goBack(-2);
	};

};

app.controller('RecoleccionProductoCtrl', RecoleccionProductoCtrl);
