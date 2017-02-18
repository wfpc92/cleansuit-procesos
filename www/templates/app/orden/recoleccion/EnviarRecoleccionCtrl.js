var EnviarRecoleccionCtrl = function($scope, 
							$stateParams,
							$log,
							$state,
							$ionicPopup,
							$ionicHistory,
							$ionicListDelegate,
							OrdenesFactory, 
							$timeout) {
	
	var asignarClaseNueva = function(nuevaClase) {
		var popupButtons = angular.element(document.getElementsByClassName("popup-buttons"));
		for (var i = 0; i < popupButtons.length; i++) {
			popupButtons[i].className += " " + nuevaClase;
		};
	}
	
	$log.debug("VentaProductosCtrl", $scope.$id);

	$scope.enviar = function() {
		console.log("EnviarRecoleccionCtrl.enviar", $scope.carrito);
		var codigoOrden = $scope.carrito.infoOrden.codigo;
		var qEnvio = $scope.carrito.soloHayProductos() ? OrdenesFactory.enviarVentaDirecta() : OrdenesFactory.enviarRecolectada();
		
		qEnvio
		.then(function() {
			$ionicPopup
			.alert({
		    	title: 'Orden enviada',
		    	template: 'Revise en el Menú las ordenes enviadas.',
		    })
		    .then(function(){
		    	OrdenesFactory.eliminarOrdenPendiente(codigoOrden);
		    	$ionicHistory.clearHistory();
				$ionicHistory.nextViewOptions({
					disableBack:'true'
				});
		    	$state.go("app.recoleccion");
		    	asignarClaseNueva("btnOk");
		    }) 
		});
	};

	$scope.regresar = function() {
		$ionicHistory.goBack(-2);
	};
};

app.controller("EnviarRecoleccionCtrl", EnviarRecoleccionCtrl);
