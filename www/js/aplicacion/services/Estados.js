var EstadosFactory = function(CarritoFactory){
	return {
		//estados de la orden: 
		//'nueva','rutaRecoleccion','recolectada', 'rutaEntrega', 'entregada', 'cancelada'
		estados : function(orden) {
			var estados = [
				{id: 'nueva', titulo:'Validando datos', titulo2: 'orden nueva'},
				{id: 'rutaRecoleccion', titulo:'En ruta de recolección', titulo2: 'orden en recoleccion'},
				{id: 'recolectada', titulo:'En procesamiento', titulo2: 'orden recolectada'},
				{id: 'rutaEntrega', titulo:'En ruta de entrega', titulo2: 'orden en entrega'},
				{id: 'entregada', titulo:'Entregado', titulo2: 'orden entregada'},
				{id: 'cancelada', titulo:'Cancelada', titulo2: 'orden cancelada'},
			];

			if(orden.items && CarritoFactory.soloHayProductos(orden.items)) {
				estados = [estados[0],estados[3],estados[4],estados[5]];
			} 

			return estados;
		},

		getEstado: function(orden) {
			var estados = this.estados(orden);
			//orden.estado corresponde a id en estados[i].id
			for (var i in estados ){
				if(estados[i].id == orden.estado) {
					return estados[i];
				}
			}
			return {};
		}
	};
};

app.factory('EstadosFactory', EstadosFactory);
