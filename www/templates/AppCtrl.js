var AppCtrl = function($scope,
					$rootScope, 
					$state,
					$ionicHistory, 
					$log,
					HistorialTabsFactory,
					UsuarioFactory,
					ControlDescargasFactory,
					CarritoFactory,
					OrdenesFactory,
					PopupFactory,
					AuthService,
					FormularioFactory,
					AUTH_EVENTS,
					APP_EVENTS,
					USER_ROLES) {

	$log.debug("AppCtrl", $scope.$id);

	$scope.historial = HistorialTabsFactory;
	$scope.carrito = CarritoFactory;
	$scope.$state = $state;
	$scope.formulario = FormularioFactory;
	
	//verificar si esta autenticado y autorizado.
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		//$log.debug("event:$stateChangeStart", toState, toParams, fromState, fromParams)
		var rolesAutorizados = toState.data.rolesAutorizados;
		if (!AuthService.estaAutorizado(rolesAutorizados)) {
			//$log.debug("no esta autorizado")
			// usuario no autorizado
			if (AuthService.estaAutenticado()) {
				//$log.debug("esta autenticado")
				event.preventDefault();
				if(toState.name.indexOf("autenticacion.") !== -1){
					// usuario quiere volver a autenticar?, no permitido
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				} else {
					//solicitud de estado desconocido
					$state.go('autenticacion.ingresar');
					$rootScope.$broadcast(AUTH_EVENTS.noAutorizado);
				}
				
			} else {
				//$log.debug("no esta autenticado")
				if(toState.name.indexOf("app.") !== -1){
					// usuario no esta autenticado y quiere ingresar a la app
					event.preventDefault();
					$rootScope.$broadcast(AUTH_EVENTS.noAutenticado);
				}
			}
		}
			
	});
	
	$scope.$on(AUTH_EVENTS.loginSuccess, function(event, args){
		$scope.usuario = UsuarioFactory.getUsuario();
		ControlDescargasFactory
		.cargaInicial()
		.finally(function() {
			$log.debug("Carga inicial finalizada.");
		});
		$state.go('app.panel');
	});


	$scope.$on(AUTH_EVENTS.loginFailed, function(event, args){
		var alertPopup = PopupFactory.alert({
			title: 'Verifica por favor!',
			template: args.msg
		});
	});

	$scope.$on(AUTH_EVENTS.noAutorizado, function(event) {
		var alertPopup = PopupFactory.alert({
			title: 'No es posible acceder!',
			template: 'Este recurso no está disponible para ti.'
		});
	});

	$scope.$on(AUTH_EVENTS.noAutenticado, function(event) {
		AuthService.logout();
		$state.go('autenticacion.ingresar');
		var alertPopup = PopupFactory.alert({
			title: 'Usuario no autenticado!',
			template: 'Debes iniciar sesion.'
		});
	});

	$scope.$on(AUTH_EVENTS.perfilActualizado, function(event, args) {
		$log.debug("event:AppCtrl.perfilActualizado");

		PopupFactory.alert({
			title: "Perfil de usuario",
			template: args.msg || "no hay mensaje"
		});
	});

	$scope.$on(APP_EVENTS.noAccesoServidor, function(event, args) {
		$log.debug("event:AppCtrl.noAccesoServidor");

		PopupFactory.alert({
			title: 'No se puede acceder',
			template: "Al parecer no tienes una conexión a internet. Por favor, intenta conectarte a una red e intenta ingresar de nuevo."
		});
	});

	$scope.$on(APP_EVENTS.servidorNoEncontrado, function(event, args) {
		$log.debug("event:AppCtrl.servidorNoEncontrado");

		PopupFactory.alert({
			title: 'No se encuentra',
			template: "Estamos experimentado problemas con nuestros servidores. Por favor, vuelve más tarde."
		});
	});

	$scope.irUltimoEstado = function() {
		if($state.current.name != $scope.historial.ultimoEstado) {
			$ionicHistory.nextViewOptions({
				disableBack:'true'
			});
			$state.go($scope.historial.ultimoEstado);
		}
	};

	$scope.irVentaDirecta = function() {
		var estadoVentaProductos = 'app.venta-productos';

		if($state.current.name != estadoVentaProductos) {
			$scope.carrito.vaciar();
			$ionicHistory.nextViewOptions({
				disableBack:'true'
			});
			$state.go(estadoVentaProductos);	
		}		
	};

	$scope.logout = function() {
		$log.debug("AppCtrl.logout():");	
		AuthService.logout();
		CarritoFactory.vaciar();
		$rootScope.$broadcast("limpiarLista");
		$state.go('autenticacion.ingresar');
	};
};

app.controller('AppCtrl', AppCtrl);
