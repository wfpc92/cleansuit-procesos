app.config(function($stateProvider,
					$urlRouterProvider,
					$logProvider,
					$provide,
					$compileProvider,
					$ionicConfigProvider,
					$httpProvider,
					$localStorageProvider,
					USER_ROLES) {


	//forzar a ionic que tenga las tabs arriba para todas las plataformas
	$ionicConfigProvider.tabs.position('top');

	$logProvider.debugEnabled(true);

	var toJSON = function(argumentos) {
		var args = null;
		args = [].slice.call(argumentos);
    	args[0] = ["CleanSuit", ': ', typeof args[0] == 'object' ? JSON.stringify(args[0]) : args[0]].join('');

    	if(typeof args == 'object') {
    		for(var i = 1; i < args.length; i++) {
    			if(typeof args[i] == 'object') {
    				args[i] = JSON.stringify(args[i]);
    			}
    		}
    	} else {
				return argumentos;
			}
		return args;
	};

    $provide.decorator('$log', function ($delegate) {
        //Original methods
        var origLog = $delegate.log,
        	origInfo = $delegate.info,
        	origWarn = $delegate.warn,
        	origError = $delegate.error,
        	origDebug = $delegate.debug;

        if ($logProvider.debugEnabled()) {

        	$delegate.log = function () {
                origLog.apply(null, toJSON(arguments));
	        };

	        $delegate.debug = function () {
	            origDebug.apply(null, toJSON(arguments));
	        };
        }

        return $delegate;
    });


	$compileProvider.debugInfoEnabled(false);
	$ionicConfigProvider.scrolling.jsScrolling(false);

	var isAndroid = ionic.Platform.isAndroid();

	$ionicConfigProvider.backButton.text("");
	$ionicConfigProvider.backButton.previousTitleText("");
	$ionicConfigProvider.views.forwardCache(true);
	$ionicConfigProvider.views.maxCache(5);

	$httpProvider.interceptors.push("Interceptor");

	$localStorageProvider.setKeyPrefix('CleanSuit-D-');




	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	/**
	 * Rutas para autenticacion
	 */
	.state('autenticacion', {
		url: "/autenticacion",
    	abstract: true,
      	templateUrl: "templates/autenticacion/plantilla.html",
		data: {
	    	rolesAutorizados: [USER_ROLES.public]
	    }
	})

	.state('autenticacion.ingresar', {
		url: '/inicio',
		views: {
        	'contenedor-app' : {
         		templateUrl: "templates/autenticacion/ingresar.html",
        		controller : "IngresarCtrl"
        	}
      	}
	})


	/**
	 * Rutas del dashboard y la aplicacion
	 */
	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/app/menu.html',//aqui estan las tabs,
		data: {
	    	rolesAutorizados: [USER_ROLES.procesos]
	    }
	})

	// vista principal por defecto mostrar ordenes pendientes de recoleccion.
	.state('app.panel', {
		url: '/panel',
		views: {
			'contenedor-panel': {
				templateUrl: 'templates/app/panel.html',
				controller: 'PanelCtrl'
			}
		}
	})


	//$urlRouterProvider.otherwise('/autenticacion/inicio');
	$urlRouterProvider.otherwise( function($injector, $location) {
    	var $state = $injector.get("$state");
    	$state.go("autenticacion.ingresar");
    });

});
