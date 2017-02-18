var OrdenParaEntregaCtrl = function($scope, 
							$stateParams,
							$state,
							$log,
							$ionicListDelegate,
							OrdenesFactory, 
							$timeout) {

	$log.debug("OrdenParaEntregaCtrl", $scope.$id);
	
	$scope.$on("$ionicView.beforeEnter", function() {
		$scope.formulario.init();
		$scope.formulario.nombre.disabled = true;
		$scope.formulario.recoleccion.direccion.hide = true;
		$scope.formulario.recoleccion.fecha.hide = true;
		$scope.formulario.recoleccion.hora.hide = true;
		$scope.formulario.entrega.direccion.disabled = true;
		$scope.formulario.entrega.fecha.disabled = true;
		$scope.formulario.entrega.hora.disabled = true;
		$scope.formulario.telefono.disabled = true;
		$scope.formulario.formaPago.disabled = true;
		$scope.formulario.formaPago.editable = true;
		$scope.formulario.cupon.disabled = true;
		$scope.formulario.prendas.entregar = true;
		$scope.formulario.productos.entregar = true;
		$scope.formulario.cancelar.hide = true;
		$scope.formulario.siguiente.texto = "ORDEN ENTREGADA";
		$scope.formulario.valido = false;
	});

	$scope.siguiente = function() {
		if ($scope.formulario.valido) {
			$state.go("app.entrega-envio");
		}
		else {
			console.log("Formulario incompleto.")
		}
	};
};


app.controller("OrdenParaEntregaCtrl", OrdenParaEntregaCtrl);
