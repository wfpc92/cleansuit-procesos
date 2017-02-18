var VentaProductosCtrl = function($scope,
							$log,
							ProductosFactory,
							//TutorialFactory,
							$timeout,
							$state,
							$ionicHistory,
							$ionicListDelegate,
							$ionicPopup,
							ModalCargaFactory) {

	$log.debug("VentaProductosCtrl", $scope.$id);

	$scope.indexOrden = -1;
	$scope.productos = ProductosFactory.productos;

	$scope.verDetalle = function($index) {
		$state.go("app.venta-producto", {indexProducto: $index });
	};

	$scope.$on('$ionicView.afterEnter', function(e, v) {
		//lograr que este comando se ejcute una sola vez cuando se entra a este controlador.
		$scope.carrito.setVentaDirecta();
	});

	$scope.$on("limpiarLista", function() {
		$ionicListDelegate.closeOptionButtons();
	});

	$scope.cargarProductos = function() {
		$log.debug("VentaProductosCtrl.cargarProductos()");
		
		ProductosFactory
		.cargar()
		.then( function() {
			$scope.productos = ProductosFactory.productos;
		});
	};

	$scope.hayProductos = function() {
		if(!$scope.productos) {
			return false;
		}

		if($scope.productos.length > 0) {
			return true;
		}

		return false;
	};

	$scope.cancelarVentaDirecta = function() {
		$ionicPopup
		.confirm({
	    	title: '¿Desea cancelar venta directa de productos?',
	    	template: '',
	    	buttons: [
		    	{
		    		text: 'Si',
		    		type: 'button-calm',
		    		onTap: function(e) {
		    			//aqui se borra (limpiar) el pedido de productos del carrito.
		    			$scope.carrito.vaciar();
		    		}
		    	},
		      	{
			    	text: 'No',
			    	type: 'button-calm'
		      	}
		    ]
	    });
	};

	$scope.guardarPedidoProductos = function() {
		//aqui se guarda el pedido de productos en el carrito de la orden en recoleccion.
		$state.go("app.venta-confirmar");
	};
	$scope.hayProductos = function() {
		if(!$scope.productos) {
			return false;
		}

		if($scope.productos.length > 0) {
			return true;
		}

		return false;
	};
};

app.controller('VentaProductosCtrl', VentaProductosCtrl);
