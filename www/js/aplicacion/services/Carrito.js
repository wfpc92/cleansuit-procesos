var CarritoFactory = function(RecursosFactory, 
							PromocionesFactory,
							$log,
							$state,
							$ionicPopup,
							ConfiguracionesFactory,
							ServiciosFactory,
							API_ENDPOINT,
							$location){
	/**
	 * [this.items ]
	 * @type [{Object id:String producto o servicio
	 *		tipo:String "PRODUCTO" o "SERVICIO"
	 *		cantidad:Number cantidad agregada}]
	 */
	
	return {
		items: {},

		contProductos: 0,

		contPrendas: 0,

		domicilio: 0,

		totales: {},

		infoOrden: null, //referencia a una orden de recoleccion seleccionada 
		
		init: function(infoOrden) {
			this.items = {
				productos: {},
				prendas: {}
			};
			this.contPrendas = 0;
			this.contProductos = 0;

			delete this.infoOrden;
			this.infoOrden = infoOrden;
			//se convierte en tipo Date en caso que este en formato string
			if (typeof this.infoOrden.orden.recoleccion.fecha == 'string') { 
				this.infoOrden.orden.recoleccion.fecha = new Date(this.infoOrden.orden.recoleccion.fecha);
			}

			if (typeof this.infoOrden.orden.entrega.fecha == 'string') { 
				this.infoOrden.orden.entrega.fecha = new Date(this.infoOrden.orden.entrega.fecha);
			}
		},

		setProductosRecoleccion: function(infoOrden) {
			this.init(infoOrden);

			if (!((typeof this.infoOrden.recoleccion == 'undefined')
				&& (typeof this.infoOrden.recoleccion.items == 'undefined')
				&& (typeof this.infoOrden.recoleccion.items.productos == 'undefined'))) {
				console.log("se agregan por primera vez los productos al carrito.")
				//quitar los items de tipo servicio (puesto que es .items es una cotizacion hecha por cliente)
				for (i in infoOrden.items) {
					if (infoOrden.items[i].tipo == 'PRODUCTO') {
						this.agregar(infoOrden.items[i], 'PRODUCTO', infoOrden.items[i].cantidad);
					}
				}
			}

			this.actualizarContadores();
		},

		setOrdenRecolectada: function(infoOrden) {
			this.init(infoOrden);
			this.items = infoOrden.recoleccion.items;
			this.actualizarContadores();
		},

		setOrdenParaEntrega: function(infoOrden) {
			this.init(infoOrden);
			this.items = infoOrden.entrega.items || {};
			console.log(this.items)
			this.actualizarContadores();
		},

		setOrdenEntregada: function(infoOrden) {
			this.init(infoOrden);
			this.items = infoOrden.entrega.items || {};
			this.actualizarContadores();
		},

		setVentaDirecta: function() {
			if (!this.ventaDirecta) {
				this.init({
					cliente_id: {
						nombre: null
					},
					orden: {
						recoleccion: {
							direccion: null,
							fecha: new Date(),
							hora: ""
						},
						entrega: {
							direccion: null,
							fecha: new Date(),
							hora: ""
						},
						telefono: null,
						formaPago: null,
					},
				});
			} 

			this.ventaDirecta = true;
			this.actualizarContadores();
		},

		/**
		 * agregar un item a la lista de items del carrito
		 * @param  {object} item item de producto o prenda
		 * @param  {string} tipo      'PRODUCTO' o 'PRENDA'
		 * @param  {int} cantidad  cantidad que se adiciona al carrito 
		 * @return {void}
		 */
		agregar : function(item, tipo, cantidad){
			$log.debug("CarritoFactory.agregar()", tipo, cantidad);
			
			if(!item){ return; }

			if(tipo == "PRODUCTO") {
				//existe el item en el carrito de compra, aumentar cantidad
				if (typeof this.items.productos[item._id] !== 'undefined'){
					this.items.productos[item._id].cantidad += cantidad;
				} else {
					var index = item._id;
					this.items.productos[index] = item;
					this.items.productos[index].tipo = tipo;
					this.items.productos[index].cantidad = cantidad;	
				}
			} else {
				//no existe hay que agregarlo al carrito de compras
				var index = item.codigo;
				this.items.prendas[index] = item;
			}

			this.actualizarContadores();
			return true;
		},

		disminuir : function(item, tipo, cantidad){
			//$log.debug("CarritoFactory.disminuir()", item, tipo, cantidad);
			//existe el item en el carrito de compra, disminuri cantidad
			if(tipo == "PRODUCTO") {
				if(typeof this.items.productos[item._id] !== 'undefined'){
					this.items.productos[item._id].cantidad -= cantidad;
					if(this.items.productos[item._id].cantidad <= 0){
						this.items.productos[item._id].cantidad = 0;
					}
				}//si no existe no se hace nada
			}

			this.actualizarContadores();
			return true;
		},

		aumentarProducto: function(producto) {
			this.agregar(producto, "PRODUCTO", 1);
		},

		disminuirProducto: function(producto) {
			this.disminuir(producto, "PRODUCTO", 1);
		},

		editarPrenda: function(index) {
			$state.go("app.recoleccion-formulario-prenda", {indexPrenda: index});	
		},

		eliminarPrenda: function(index, cb) {
			var self = this;
			return $ionicPopup
			.confirm({
				title: 'Eliminar Servicio',
				template: '¿Está seguro que desea eliminar este servicio?',
				buttons: [
					{
						text: 'Si',
						onTap: function(e) {
							self.eliminar(index, 'PRENDA');
							if (cb) {
								cb();
							}
						}
					},
					{
						text: '<b>No</b>',
						type: 'button-positive'
					}
				]
			});
		},

		eliminarProducto: function(index, cb) {
			var self = this;

			$ionicPopup
			.confirm({
		    	title: 'Eliminar Productos',
		    	template: '¿Está seguro que desea eliminar este pedido?',
		    	buttons: [
			    	{
			    		text: 'Si',
			    		onTap: function(e) {
			    			self.eliminar(index, 'PRODUCTO');
			    			if (cb) {
			    				cb();
			    			}
			    		}
			    	},
			      	{
				    	text: '<b>No</b>',
				    	type: 'button-positive'
			      	}
			    ]
		    });	    
		},

		eliminar : function(index, tipo) {
			console.log("eliminar", index, tipo, this.items)
			if (tipo == 'PRODUCTO') {
				delete this.items.productos[index];
			} else {
				delete this.items.prendas[index];
			}
			this.actualizarContadores();
		},

		cantidad: function(id) {
			return (typeof this.items.productos !== 'undefined' && typeof this.items.productos[id] !== 'undefined') ? this.items.productos[id].cantidad : 0;
		},

		hayProductos: function() {
			var cont = 0; 

			for (var index in this.items.productos) {
				cont += 1;
			}
			return cont > 0;
		},

		calcularPrecioPrenda: function(prenda) {
			return prenda.subservicio.precio;
		},

		actualizarContadores : function(){
			this.contProductos = 0;
			this.contPrendas = 0;

			for (var i in this.items.productos) {
				this.contProductos += this.items.productos[i].cantidad;
			}

			for (var i in this.items.prendas) {
				this.contPrendas += 1;
			}

			this.calcularTotales();
		},
		
		calcularTotales : function(){//calcular precios de total y subtotal
			var subtotal = 0, descuento = 0;			
			
			for (var index in this.items.prendas) {
				//precio * cantidad
				
				subtotal += this.calcularPrecioPrenda(this.items.prendas[index])
				subtotal += this.calcularTotalesAdicionales(this.items.prendas[index])
				//revisar en lista de descuentos del cupon si este item aplica para descuento
				/*if(this.totales.promocion && this.totales.promocion.items[index]){
					//$log.debug("CarritoFactory.calcularTotales: ",	this.totales.promocion, this.totales.promocion.items[index]);
					descuento += item.precio * item.cantidad * (this.totales.promocion.items[index].descuento / 100.0);
				}*/
			}
			
			for (var index in this.items.productos) {
				//precio * cantidad
				var item = this.items.productos[index];
				subtotal += item.precio * item.cantidad;

				//revisar en lista de descuentos del cupon si este item aplica para descuento
				/*if(this.totales.promocion && this.totales.promocion.items[index]){
					//$log.debug("CarritoFactory.calcularTotales: ",	this.totales.promocion, this.totales.promocion.items[index]);
					descuento += item.precio * item.cantidad * (this.totales.promocion.items[index].descuento / 100.0);
				}*/	
			}
			
			this.totales.descuento = descuento !== 0 ? descuento * -1 : null;
			this.totales.domicilio = ConfiguracionesFactory.getConfiguraciones().domicilio || 0;
			this.totales.domicilio = (this.ventaDirecta ? 0 : this.totales.domicilio);	
			this.totales.subtotal = subtotal;
			this.totales.total = (subtotal !== 0 ? subtotal + this.domicilio - descuento: 0);

			//$log.debug("CarritoFactory.calcularTotales", this.totales)
			return this.totales;
		},

		calcularTotalesAdicionales: function(prenda) {
			var res = 0; 
			for (var ia in prenda.adicionales) {
				if (prenda.adicionales[ia].checked) {
					res += ServiciosFactory.getPrecioSubservicio(ia);
				}
			}
			return res;
		},

		/**
		 * [limpiar los items que tienen cantidad 0, deben ser eliminados.]
		 * @return {[type]} [description]
		 */
		limpiar : function(){//limpiar los items que no tienen cantidades.
			//$log.debug("CarritoFactory.limpiar(): antes", this.items);
			for(var i in this.items.productos){
				if(this.items.productos[i].cantidad == 0 ){
					delete this.items.productos[i];
				}
			}
			//$log.debug("CarritoFactory.limpiar(): despues", this.items);
			this.actualizarContadores();
		},


		soloHayProductos : function(){
			return this.contPrendas == 0 && this.contProductos >= 1;
		},

		getProductos: function(items) {
			var productos = [];

			if (!items) {
				items = this.items;
			}

			for (i in items){
				if (items[i].tipo == 'PRODUCTO'){
					productos.push(items[i]);
				}
			}

			return productos;
		},

		/**
		 * [vaciar eliminiar los items del carrito]
		 * @return {[type]} [description]
		 */
		vaciar: function() {
			this.ventaDirecta = false;

			for (var i in this.items.productos) {
				delete this.items.productos[i];
			}
			for (var i in this.items.prendas) {
				delete this.items.prendas[i];
			}
			
			this.infoOrden = null;
			this.actualizarContadores();
		},

		eliminarProductos: function() {
			for (var i in this.items.productos) {
				delete this.items.productos[i];
			}
			this.actualizarContadores();
		},

		aplicarPromocion: function(promocion) {
			//$log.debug("CarritoFactory.aplicarPromocion", promocion);
			this.totales.promocion = promocion;
			this.actualizarContadores();
		},

		getSrcFoto: function(prenda) {
			if (API_ENDPOINT.url == '/api') {
				src = "http://localhost:20987";
			} else {
				src = API_ENDPOINT.url
			}
			return src += "/updates/"+ prenda.fotos[0].nombre;
		},

		getTipoVenta: function(infoOrden, estado) {
			var tipo = "", items = {}, contProductos = 0, contPrendas = 0;
			if (estado == "RECOLECCION") {
				if (infoOrden.recoleccion) {
					items = infoOrden.recoleccion.items;
				}
			} else {
				if (infoOrden.entrega) {
					items = infoOrden.entrega.items;
				}
			}

			for (var index in items.productos) {
				contProductos++;
			}

			for (var index in items.prendas) {
				contPrendas++;
			}

			if (contPrendas == 0 && contProductos != 0) {
				tipo = "Órden de venta directa de producto"
			}

			if (contPrendas != 0 && contProductos != 0) {
				tipo = "Órden de servicio y producto"
			}

			if (contPrendas != 0 && contProductos == 0) {
				tipo = "Órden de servicio";
			}
			
			return tipo;
		}
	};
};

app.factory('CarritoFactory', CarritoFactory);
