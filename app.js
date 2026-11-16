var PRODUCTOS = [
  { nombre: "Alfajor", precio: 500 },
  { nombre: "Agua", precio: 800 },
  { nombre: "Gaseosa", precio: 1200 },
  { nombre: "Café", precio: 900 },
  { nombre: "Chipá", precio: 700 },
  { nombre: "Chocolate", precio: 1500 }
];

var carrito = [];

var selectProducto = document.getElementById("producto");
var inputCantidad = document.getElementById("cantidad");
var botonAgregar = document.getElementById("agregar");
var botonVaciar = document.getElementById("vaciar");
var tbodyFilas = document.getElementById("filas");
var spanTotal = document.getElementById("total");
var spanSubtotal = document.getElementById("subtotal");
var spanDescuento = document.getElementById("descuento");
var lineaDescuento = document.getElementById("linea-descuento");
var parrafoAviso = document.getElementById("aviso");

function pesos(numero) {
  return "$ " + numero.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function cargarProductos() {
  PRODUCTOS.forEach(function (producto) {
    var opcion = document.createElement("option");
    opcion.value = producto.nombre;
    opcion.textContent = producto.nombre + " — " + pesos(producto.precio);
    selectProducto.appendChild(opcion);
  });
}

function mostrarAviso(texto) {
  parrafoAviso.textContent = texto;
  parrafoAviso.hidden = false;
}

function ocultarAviso() {
  parrafoAviso.hidden = true;
  parrafoAviso.textContent = "";
}

function buscarProducto(nombre) {
  for (var i = 0; i < PRODUCTOS.length; i++) {
    if (PRODUCTOS[i].nombre === nombre) {
      return PRODUCTOS[i];
    }
  }
  return null;
}

function calcularSubtotal() {
  var subtotal = 0;
  carrito.forEach(function (fila) {
    subtotal = subtotal + fila.precio * fila.cantidad;
  });
  return subtotal;
}

function dibujarCarrito() {
  tbodyFilas.innerHTML = "";

  if (carrito.length === 0) {
    var filaVacia = document.createElement("tr");
    filaVacia.className = "fila-vacia";
    filaVacia.innerHTML = "<td colspan=\"4\">El carrito está vacío.</td>";
    tbodyFilas.appendChild(filaVacia);
  } else {
    carrito.forEach(function (fila) {
      var tr = document.createElement("tr");

      var tdNombre = document.createElement("td");
      tdNombre.textContent = fila.nombre;

      var tdCantidad = document.createElement("td");
      tdCantidad.className = "num";
      tdCantidad.textContent = fila.cantidad;

      var tdPrecio = document.createElement("td");
      tdPrecio.className = "num";
      tdPrecio.textContent = pesos(fila.precio);

      var tdSubtotal = document.createElement("td");
      tdSubtotal.className = "num";
      tdSubtotal.textContent = pesos(fila.precio * fila.cantidad);

      tr.appendChild(tdNombre);
      tr.appendChild(tdCantidad);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdSubtotal);
      tbodyFilas.appendChild(tr);
    });
  }

  var subtotal = calcularSubtotal();
  var descuento = subtotal > 5000 ? subtotal * 0.1 : 0;

  spanSubtotal.textContent = pesos(subtotal);
  spanDescuento.textContent = "-" + pesos(descuento);
  lineaDescuento.hidden = descuento === 0;
  spanTotal.textContent = pesos(subtotal - descuento);
}

function agregarAlCarrito() {
  var nombre = selectProducto.value;
  var cantidad = Number(inputCantidad.value);

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    mostrarAviso("Escribí una cantidad mayor a 0 para agregar el producto.");
    return;
  }

  var producto = buscarProducto(nombre);
  if (producto === null) {
    mostrarAviso("Elegí un producto de la lista.");
    return;
  }

  var fila = null;
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].nombre === producto.nombre) {
      fila = carrito[i];
    }
  }

  if (fila === null) {
    carrito.push({ nombre: producto.nombre, precio: producto.precio, cantidad: cantidad });
  } else {
    fila.cantidad = fila.cantidad + cantidad;
  }

  ocultarAviso();
  inputCantidad.value = "1";
  dibujarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  ocultarAviso();
  inputCantidad.value = "1";
  dibujarCarrito();
}

cargarProductos();
dibujarCarrito();

botonAgregar.addEventListener("click", agregarAlCarrito);
botonVaciar.addEventListener("click", vaciarCarrito);

inputCantidad.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    agregarAlCarrito();
  }
});
