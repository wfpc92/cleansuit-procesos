
var HistorialTabsFactory = function () {
	
	return {
		recoleccion: true,

		entrega: false,
		
		ultimoEstado: "app.recoleccion"
	};
};

app.factory('HistorialTabsFactory', HistorialTabsFactory);
