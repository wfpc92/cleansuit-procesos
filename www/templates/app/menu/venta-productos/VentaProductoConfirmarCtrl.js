var VentaProductoConfirmarCtrl = function($scope,
							$stateParams,
							OrdenesFactory,
							ProductosFactory,
							$ionicHistory,
							$state,
							$ionicPopup,
							$log) {

	var asignarClaseNueva = function(nuevaClase) {
		var popupButtons = angular.element(document.getElementsByClassName("popup-buttons"));
		for (var i = 0; i < popupButtons.length; i++) {
			popupButtons[i].className += " " + nuevaClase;
		};
	}

	$log.debug("VentaProductoConfirmarCtrl", $scope.$id);

	

	$scope.$on('$ionicView.afterEnter', function(event) {
		$scope.formulario.init();
		$scope.formulario.titulo.texto = "Venta directa de productos";
		$scope.formulario.recoleccion.direccion.hide = true;
		$scope.formulario.recoleccion.fecha.hide = true;
		$scope.formulario.recoleccion.hora.hide = true;
		$scope.formulario.formaPago.disabled = true;
		$scope.formulario.formaPago.editable = true;
		$scope.formulario.cupon.hide = true;
		$scope.formulario.cupon.abono = true;
		$scope.formulario.prendas.eliminar = true;
		$scope.formulario.productos.eliminar = true;
		$scope.formulario.cancelar.texto = "Validación del cliente";
		$scope.formulario.siguiente.texto = "REALIZAR ORDEN";
		$scope.formulario.valido = false;
		$scope.formulario.setHoraActual();
		$scope.validoCliente =  false;
		$scope.validoCampos = false;

		$scope.$watchGroup([
				'carrito.infoOrden.cliente_id.nombre',
			], function(newV, oldV) {
				if (newV[0]) {
					$scope.validoCampos = true;
				} else {
					$scope.validoCampos = false;
				}
				$scope.validar();
				console.log("Watch$$$$$: ",newV, oldV, $scope.valido);
		});
	});

	$scope.validar = function() {
		$scope.formulario.valido = $scope.validoCliente && $scope.validoCampos && ($scope.carrito.contProductos > 0);
	}
	//cancelar orden:
	$scope.cancelar = function() {
		$ionicPopup
		.confirm({
	    	title: 'Validación del cliente',
	    	template: '',
	    	buttons: [
		    	{
		    		text: 'El cliente esta de acuerdo con la orden',
			    	type: 'button-calm',
		    		onTap: function() {
		    			$scope.validoCliente = true;
		    			$scope.validar();
		    		}
		    	},
		      	{
			    	text: 'Cancelar pedido',
			    	type: 'button-calm',
		    		onTap: function(e) {
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
						    			$ionicHistory.clearHistory();
										$ionicHistory.nextViewOptions({
											disableBack:'true'
										});
										$state.go("app.venta-productos");
						    		}
						    	},
						      	{
							    	text: 'No',
							    	type: 'button-calm'
						      	}
						    ]
					    });
		    		}
		      	}
		    ]
	    });

		asignarClaseNueva("btnEnFilas");
	};

	$scope.siguiente = function() {
		$state.go("app.venta-envio");
	};
};

app.controller('VentaProductoConfirmarCtrl', VentaProductoConfirmarCtrl);
