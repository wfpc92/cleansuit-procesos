var IngresarCtrl = function($scope,
								AuthService,
								$ionicPopup,
								$rootScope,
								$log,
								AUTH_EVENTS) {

	$log.debug("IngresarCtrl", $scope.$id);
	
	$scope.error = "";
	$scope.formValido = [];
	$scope.usuario = {
		correo: "",
		contrasena: ""
	};

	$scope.ingresar = function() {
		if (!$scope.formValido[0]) {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed, {msg: "Escriba un córreo válido."});
			return;
		}
		if (!$scope.formValido[1]) {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed, {msg: "La contraseña debe tener mínimo 6 caracteres."});
			return;
		}

		AuthService
		.ingresar($scope.usuario)
		.then(function(msg) {
			$log.debug("IngresarCtrl.ingresar()", msg)
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {msg: msg});
		}, function(msg) {
			$log.debug("IngresarCtrl: err", msg);
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed, {msg: msg});
		});
	};

	$scope.$watchGroup([
		'usuario.correo',
		'usuario.contrasena',
		], function(newV, oldV, scope){
			$log.debug("IngresarCtrl.watch", newV)
			$scope.formValido = newV;
	});
};

app.controller('IngresarCtrl', IngresarCtrl);
