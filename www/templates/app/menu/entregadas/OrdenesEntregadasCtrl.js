var OrdenesEntregadasCtrl =  function ($scope,
									$log,
									$state,
									OrdenesFactory) {
	
	$log.debug("OrdenesEntregadasCtrl", $scope.$id);
	$scope.ordenes = OrdenesFactory.ordenesEntregadas;
	$scope.historial = "entregadas";

	$scope.$on("$ionicView.beforeEnter", function() {
		$scope.formulario.init();
		$scope.formulario.orden.titulo = "Órdenes entregadas";
		$scope.formulario.orden.descripcion = "Estas son las ordenes que ha entregado";
		$scope.formulario.orden.noHayOrdenes = "No hay órdenes entregadas aún.";		
		$scope.estado = "ENTREGA"
	});

	$scope.refrescar = function() {
		OrdenesFactory
		.cargarAsignadas() 
		.then(function() {
			$scope.ordenes = OrdenesFactory.ordenesEntregadas;
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

	$scope.verInformacionOrden = function(infoOrden) {
		$scope.carrito.setOrdenEntregada(infoOrden)
		$state.go("app.entregada");
	}
	
};

app.controller('OrdenesEntregadasCtrl', OrdenesEntregadasCtrl);