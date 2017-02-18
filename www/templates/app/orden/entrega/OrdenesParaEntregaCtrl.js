var OrdenesParaEntregaCtrl =  function ($scope,
										$rootScope,
										$state, 
										$log,
										OrdenesFactory) {
	
	$log.debug("OrdenesParaEntregaCtrl", $scope.$id);
	$scope.ordenes = OrdenesFactory.ordenesEntrega;
	
	$scope.refrescar = function() {
		OrdenesFactory
		.cargarAsignadas() 
		.then(function() {
			$scope.ordenes = OrdenesFactory.ordenesEntrega;
		})
		.finally(function() {
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.hayOrdenes = function() {
		if(!$scope.ordenes) {
			return false;
		}

		if($scope.ordenes.length > 0) {
			return true;
		}
		
		return false;
	};

	$scope.$on('$ionicView.beforeEnter', function(event) {
		$scope.historial.recoleccion = false; 
		$scope.historial.entrega = true; 
		$scope.historial.ultimoEstado = $state.current.name; 		
	});

	$scope.verInformacionOrden = function(infoOrden) {
		//iniciar orden de recoleccion.
		OrdenesFactory.iniciarEntrega(infoOrden);
		//asignar los productos solicitados en app cliente al carrito.
		$scope.carrito.setOrdenParaEntrega(infoOrden);
		$state.go("app.entrega-detalle");
	};

	
	
};

app.controller('OrdenesParaEntregaCtrl', OrdenesParaEntregaCtrl);