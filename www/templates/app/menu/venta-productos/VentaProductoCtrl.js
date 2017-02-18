var VentaProductoCtrl = function($scope,
							$stateParams,
							ProductosFactory,
							$ionicHistory,
							$state,
							$log) {

	$log.debug("VentaProductoCtrl", $scope.$id);

	$scope.indexProducto = $stateParams.indexProducto;
	$scope.producto = ProductosFactory.productos[$scope.indexProducto];

	$scope.guardarPedidoProductos = function() {
		//aqui se guarda el pedido de productos en el carrito de la orden en recoleccion.
		$scope.carrito.setVentaDirecta();
		$state.go("app.venta-confirmar");
	};
};

app.controller('VentaProductoCtrl', VentaProductoCtrl);
