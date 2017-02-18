var RecoleccionProductosCtrl = function($scope,
							$log,
							$stateParams,
							$state,
							$ionicPopup,
							$ionicHistory,
							ProductosFactory,
							$timeout,
							$ionicListDelegate,
							OrdenesFactory,
							ModalCargaFactory) {

	$log.debug("RecoleccionProductosCtrl", $scope.$id);
	$scope.productos = ProductosFactory.productos;

	$scope.verDetalle = function($index) {
		$state.go("app.recoleccion-producto", {indexProducto: $index });
	};

	$scope.$on("limpiarLista", function() {
		$ionicListDelegate.closeOptionButtons();
	});

	$scope.cargarProductos = function() {
		$log.debug("RecoleccionProductosCtrl.cargarProductos()");
		
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

	$scope.cancelarPedidoProductos = function() {
		$ionicPopup
		.confirm({
	    	title: '¿Desea cancelar el pedido de productos?',
	    	template: '',
	    	buttons: [
		    	{
		    		text: 'Si',
		    		type: 'button-calm',
		    		onTap: function(e) {
		    			$ionicHistory.goBack();
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
		$state.go("app.recoleccion-carrito");
	};
};

app.controller('RecoleccionProductosCtrl', RecoleccionProductosCtrl);
