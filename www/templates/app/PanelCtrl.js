var PanelCtrl = function($scope, 
						PrendaFactory,
						FotosFactory,
						$ionicPopup,
						$state, 
						$log,
						$ionicHistory) {
	
	$log.debug("PanelCtrl", $scope.$id);
	var self = this;

	$scope.formulario = {
		codigo: null
	};

	$scope.prenda = null;

	$scope.procesos = [
		{_id:"1", nombre: "Proceso 1"},
		{_id:"2", nombre: "Proceso 2"},
		{_id:"3", nombre: "Proceso 3"},
		{_id:"4", nombre: "Proceso 4"},
	];

	$scope.novedad = {};

	$scope.buscarPrenda = function() {
		$scope.prenda = null;
		
		PrendaFactory
		.buscarPrenda($scope.formulario.codigo)
		.then(function(prenda) {
			console.log(prenda)
			if (prenda) {
				$scope.prenda = prenda;
			}
		});
	};

	$scope.escanearCodigo = function() {
		FotosFactory
		.escanearCodigo()
		.then(function(codigo){
			$log.debug("We got a barcode " +
                "Result: " + codigo.text + " " +
                "Format: " + codigo.format + " " +
                "Cancelled: " + codigo.cancelled);
			if(codigo && !codigo.cancelled) {
				$log.debug("FormularioServicioCtrl: termina escaneo de codigo.", codigo.text);
				$scope.formulario.codigo = codigo.text;
				$scope.buscarPrenda();
			}
		}, function(err) {
			console.log(err)
			//se cancela la seleccion de fotos.
			$log.debug("FormularioServicioCtrl.escanearCodigo(), err", err);
			mostrarErrorCamara(err);
		});
	};

	var mostrarErrorCamara = function(err) {
		$ionicPopup
		.alert({
	    	title: 'Camara no disponible',
	    	template: 'El dispositivo no permite acceso a la camara. Reportar este inconveniente con el administrador. '+err
	    });
	};

};

app.controller('PanelCtrl', PanelCtrl);
