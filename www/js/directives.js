app.directive('elementoCentrado', function(){
	return {
		restrict: 'AEC',//'AEC' - matches either attribute or element or class name
		scope: {
				'heightPercent':'='//cunado @ es unidireccional & para llamar funciones, = para hacer binding
		},
		replace: true,//para reemplazar el contenedor 
		transclude:true, //reinserta el contenido original
		templateUrl:  function(elem, attr){
				return 'templates/directives/elemento-centrado.html';
		},
		link : function(scope, element, attrs) {
				//funcion para asignar eventos, css, y cosillas varias al elemento
		}
		
	};
})

		
/**
 * muestra el footer para permitir solicitar un servicio o para mostrar 
 * el numero de servicios que ha solicitado
 * @param  {String} ){                           return          {                  restrict: 'AEC',          scope:                                         {                       'heightPercent':' [description]
 * @param  {[type]} replace:        true          [description]
 * @param  {[type]} transclude:true [description]
 * @param  {[type]} templateUrl:                  function(elem,  attr){                                return 'templates/directives/elemento-centrado.html';      } [description]
 * @param  {[type]} link            :             function(scope, element, attrs) {                                                                                   }                                               };} [description]
 * @return {[type]}                 [description]
 */
.directive('footerCarrito', function(){
	return {
		restrict: 'AEC',//'AEC' - matches either attribute or element or class name
		scope: {
				carrito:'='//cunado @ es unidireccional & para llamar funciones, = para hacer binding
		},
		replace: true,//para reemplazar el contenedor  
		transclude:false, //reinserta el contenido original
		templateUrl:  function(elem, attr){
				return 'templates/directives/footer-carrito.html';
		},
		link : function(scope, element, attrs) {
				
				//funcion para asignar eventos, css, y cosillas varias al elemento
		}
		
	};
})



.directive('resumenTotales', function(){
	return {
		restrict: 'E',//'AEC' - matches either attribute or element or class name
		scope: {
				totales: '='//cunado @ es unidireccional & para llamar funciones, = para hacer binding
		},
		replace: false, //para reemplazar el contenedor 
		transclude: false, //reinserta el contenido original
		templateUrl:  function(elem, attr){
				return 'templates/directives/resumen-totales.html';
		}    
	};
})




.directive('menuTabs', function(){
	return {
		restrict: 'AEC',//'AEC' - matches either attribute or element or class name
		scope: {
				//carrito:'=',//cunado @ es unidireccional & para llamar funciones, = para hacer binding
				historial: '='
		},
		replace: false,//para reemplazar el contenedor  
		transclude:false, //reinserta el contenido original
		templateUrl:  function(elem, attr){
				return 'templates/directives/menu-tabs.html';
		}    
	};
})



.directive('tutorial', function(){
	return {
		restrict: 'E',//'AEC' - matches either attribute or element or class name
		/*scope: {
				tutorial:'=',//cunado @ es unidireccional & para llamar funciones, = para hacer binding
				tipo: '=',
				idLst: '='
		},*/
		replace: false,//para reemplazar el contenedor  
		transclude:false, //reinserta el contenido original
		templateUrl:  function(elem, attr){
				return 'templates/directives/tutorial.html';
		}
	};
})

.directive('ngEnter', function () {
	return function (scope, elements, attrs) {
		elements.bind('keydown keypress', function (event) {
			if (event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
})

.directive('fabMenu', function($timeout, $ionicGesture) {

    var options = {
        baseAngle: 182,
        rotationAngle: 60,
        distance: 130,
        animateInOut: 'all', // can be slide, rotate, all
      },
      buttons = [],
      buttonContainers = [],
      buttonsContainer = null,
      lastDragTime = 0,
      currentX = 0,
      currentY = 0,
      previousSpeed     = 15,

      init = function() {

        buttons = document.getElementsByClassName('fab-menu-button-item');
        buttonContainers = document.querySelectorAll('.fab-menu-items > li');
        buttonsContainer = document.getElementsByClassName('fab-menu-items');

        for (var i = 0; i < buttonContainers.length; i++) {

          var button = buttonContainers.item(i);
          var angle = (options.baseAngle + (options.rotationAngle * i));
          button.style.transform = "rotate(" + options.baseAngle + "deg) translate(0px) rotate(-" + options.baseAngle + "deg) scale(0)";
          button.style.WebkitTransform = "rotate(" + options.baseAngle + "deg) translate(0px) rotate(-" + options.baseAngle + "deg) scale(0)";
          button.setAttribute('angle', '' + angle);
        }
      },

      animateButtonsIn = function() {
        for (var i = 0; i < buttonContainers.length; i++) {

          var agregar = document.getElementById('btnFlotante');
          agregar.classList.remove('icons-desplegar');
          agregar.classList.add("icons-ocultar");

          var button = buttonContainers.item(i);
          var angle = button.getAttribute('angle');
          button.style.transform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
          button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
        }
      },
      animateButtonsOut = function() {
        for (var i = 0; i < buttonContainers.length; i++) {

          var agregar = document.getElementById('btnFlotante');
          agregar.classList.remove('icons-ocultar');
          agregar.classList.add("icons-desplegar");
          
          var button = buttonContainers.item(i);
          var angle = (options.baseAngle + (options.rotationAngle * i));
          button.setAttribute('angle', '' + angle);
          button.style.transform = "rotate(" + options.baseAngle + "deg) translate(0px) rotate(-" + options.baseAngle + "deg) scale(0)";
          button.style.WebkitTransform = "rotate(" + options.baseAngle + "deg) translate(0px) rotate(-" + options.baseAngle + "deg) scale(0)";
        }
      },

      rotateButtons = function(direction, speed) {

        // still looking for a better solution to handle the rotation speed
        // the direction will be used to define the angle calculation

        // max speed value is 25 // can change this :)
        // used previousSpeed to reduce the speed diff on each tick
        /*speed = (speed > 15) ? 15 : speed;
        speed = (speed + previousSpeed) / 2;
        previousSpeed = speed; 
        
        var moveAngle = (direction * speed);

        // if first item is on top right or last item on bottom left, move no more
        if ((parseInt(buttonContainers.item(0).getAttribute('angle')) + moveAngle >= 285 && direction > 0) ||
          (parseInt(buttonContainers.item(buttonContainers.length - 1).getAttribute('angle')) + moveAngle <= 345 && direction < 0)
        ) {
          return;
        }

        for (var i = 0; i < buttonContainers.length; i++) {

          var button = buttonContainers.item(i),
            angle = parseInt(button.getAttribute('angle'));

          angle = angle + moveAngle;

          button.setAttribute('angle', '' + angle);

          button.style.transform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
          button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
        }*/
      },

      endRotateButtons = function() {

        /*for (var i = 0; i < buttonContainers.length; i++) {

          var button = buttonContainers.item(i),
            angle = parseInt(button.getAttribute('angle')),
            diff = angle % options.rotationAngle;
          // Round the angle to realign the elements after rotation ends
          angle = diff > options.rotationAngle / 2 ? angle + options.rotationAngle - diff : angle - diff;

          button.setAttribute('angle', '' + angle);

          button.style.transform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
          button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
        }*/
      };

    return {
      templateUrl: "templates/directives/fab-menu.html",
      link: function(scope) {
        console.info("fab-menu :: link");

        init();

        scope.fabMenu = {
          active: false
        };

        var menuItems = angular.element(buttonsContainer);

        $ionicGesture.on('touch', function(event) {

          console.log('drag starts', event);
          lastDragTime = 0;
          currentX = event.gesture.deltaX;
          currentY = event.gesture.deltaY;
          previousSpeed = 0;

        }, menuItems)

        $ionicGesture.on('release', function(event) {
          console.log('drag ends');
          endRotateButtons();
        }, menuItems);

        $ionicGesture.on('drag', function(event) {

          if (event.gesture.timeStamp - lastDragTime > 100) {

            var direction = 1,
              deltaX = event.gesture.deltaX - currentX,
              deltaY = event.gesture.deltaY - currentY,
              delta = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

            if ((deltaX <= 0 && deltaY <= 0) || (deltaX <= 0 && Math.abs(deltaX) > Math.abs(deltaY))) {
              direction = -1;
            } else if ((deltaX >= 0 && deltaY >= 0) || (deltaY <= 0 && Math.abs(deltaX) < Math.abs(deltaY))) {
              direction = 1;
            }

            rotateButtons(direction, delta);

            lastDragTime = event.gesture.timeStamp;
            currentX = event.gesture.deltaX;
            currentY = event.gesture.deltaY;
          }
        }, menuItems);

        scope.fabMenuToggle = function() {

          if (scope.fabMenu.active) { // Close Menu
            animateButtonsOut();
          } else { // Open Menu
            animateButtonsIn();
          }
          scope.fabMenu.active = !scope.fabMenu.active;
        }

      }
    }
  })

