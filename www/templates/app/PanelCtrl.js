var PanelCtrl = function($scope, 
						PrendaFactory,
						FotosFactory,
						API_ENDPOINT,
						$ionicPopup,
						$state, 
						$log,
						$ionicHistory) {
	
	$log.debug("PanelCtrl", $scope.$id);
	var self = this;

	$scope.PrendaFactory = PrendaFactory;
	
	$scope.radioNovedades = [
		{ valor: false, texto:  "Sin novedad" },
		{ valor: true, texto:  "Con novedad" }
	];

	var init = function() {
		$scope.prenda = null;
		$scope.formulario = {
			codigo: null
		};
		$scope.novedad = {
			hayNovedad: $scope.radioNovedades[0].valor,
		};
	};

	var limpiarFormulario = function() {
		$scope.prenda = null;
		$scope.novedad = {
			hayNovedad: $scope.radioNovedades[0].valor
		};
	};

	var mostrarErrorCamara = function(err) {
		$ionicPopup
		.alert({
	    	title: 'Camara no disponible',
	    	template: 'El dispositivo no permite acceso a la camara. Reportar este inconveniente con el administrador. '+err
	    });
	};

	init();

	$scope.$watch("PrendaFactory.proceso",function(o, n) {
		console.log(o,n);
		PrendaFactory.guardarProceso(o);
	});

	$scope.buscarPrenda = function() {
		limpiarFormulario();

		PrendaFactory
		.buscarPrenda($scope.formulario.codigo)
		.then(function(prenda) {
			if (prenda) {
				$scope.prenda = prenda;
				$scope.formulario.mostrarErrorPrenda = false;
			} else {
				$scope.formulario.mostrarErrorPrenda = true;
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

	
	$scope.enviarNovedad = function() {
		$ionicPopup
		.confirm({
	    	title: '¿Desea enviar el reporte de esta prenda '+($scope.novedad.hayNovedad ? 'Con':'Sin')+' Novedad?',
	    	template: '',
	    	buttons: [
		      	{
			    	text: 'No enviar',
			    	type: 'button-calm'
		      	},
		    	{
		    		text: 'Enviar',
		    		type: 'button-calm',
		    		onTap: function(e) {
		    			PrendaFactory
						.enviarNovedad($scope.prenda, $scope.novedad)
						.then(function() {
							init();
						});
		    		}
		    	}
		    ]
	    });
	};

	$scope.getSrcFoto = function() {
		if (API_ENDPOINT.url == '/api') {
			src = "http://localhost:20987";
		} else {
			src = API_ENDPOINT.url
		}
		return src += "/updates/"+ $scope.prenda.fotos[0].nombre;
	};
};

app.controller('PanelCtrl', PanelCtrl);
