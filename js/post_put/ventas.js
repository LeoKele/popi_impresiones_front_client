
const formNuevaVenta = document.getElementById('agregarVentas');

formNuevaVenta.addEventListener("submit", async (event) => {
  event.preventDefault();

  var errorFecha = document.getElementById("mensajeFecha");
  var errorIdProducto = document.getElementById("mensajeIdProducto");
  var errorCantidad = document.getElementById("mensajeCantidad");
  var errorPrecio = document.getElementById("mensajePrecio");

  function limpiarMensajes() {
    errorFecha.textContent = "";
    errorIdProducto.textContent = "";
    errorCantidad.textContent = "";
    errorPrecio.textContent = "";
  }
  limpiarMensajes();

  //* Validacion simple del form
  //Obtengo los valores de los campos
  const formData = new FormData(formNuevaVenta);
  //Obtengo los valores de los inputs
  const id = formData.get("id");
  const fecha = formData.get("fecha");
  const idProducto = formData.get("idProducto");
  const cantidad = formData.get("cantidad");
  const precio = formData.get("precio");

  const fechaValido = stringVacio(fecha);
  const idProductoValido = esInt(idProducto);
  const cantidadValido = esInt(cantidad);
  const precioValido = esFloat(precio)


  if (fechaValido || !idProductoValido || !cantidadValido || !precioValido) {
    errorFecha.textContent = !fechaValido
      ? ""
      : "Por favor, completa este campo.";
    errorIdProducto.textContent = idProductoValido
      ? ""
      : "Por favor, completa este campo.";
    errorCantidad.textContent = cantidadValido
      ? ""
      : "Por favor, ingrese un número entero."; //! Deberia validar si existe un id de categoria con ese numero?
    errorPrecio.textContent = precioValido
      ? ""
      : "Por favor, ingrese un número válido.";
    return;
  }



  let url = "http://localhost:8080/api/ventas";
  let method = 'POST';

  const ventaData = {
    fechaVenta: fecha,
    idProducto: idProducto,
    cantidad: cantidad,
    precioUnitario: precio
  };

  console.log(id);
  if (id){
    
    ventaData.id = id;
    method = 'PUT';

  }
  //Configuramos para la peticion 
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ventaData)
  };


  try {
    const response = await fetch(url,options);
    if (!response.ok){
      throw new Error('Error al guardar la venta');
    }
    const responseData = await response.json();
    if (method === 'POST'){
      if (response.status !==201){//201 indica que se creo correctamente
        swal({
          title: "Error al guardar la venta.",
          text: "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error('Error al guardar la venta');
      }
      swal({
        title: "Venta agregada correctamente",
        icon: "success",
      }).then((value) => {
        if (value) {
          // que se recargue la pagina para ver la categoria agregada
          location.reload();
        }
      });
    } else {
      // console.log("put");
      //si es 200, el producto se modifico correctamente
      if (response.status !== 200){
        swal({
          title: "Error al modificar la venta.",
          text: "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error('Error al modificar la venta');
      }
      swal({
        title: "Venta modificada correctamente",
        icon: "success",
      }).then((value) => {
        if (value) {
          // que se recargue la pagina para ver la categoria agregada
          location.reload();
        }
      });
    }
  }catch (error){
    console.log('Error: ', error);
    swal({
      title: "Error al agregar la venta.",
      text: "Por Favor, intente de nuevo más tarde",
      icon: "error",
    });
  }
});



function esFloat(valor){
    const numero = parseFloat(valor);
    return !isNaN(numero);
}

function esInt(valor){
    const numero = parseInt(valor);
    return !isNaN(numero);
}

function stringVacio(string){
    if (string === '') return true;
}

  //limpio campos
  document.getElementById("reset").addEventListener("click", function () {
    const indicador = document.getElementById('indicador');
    indicador.classList.add("d-none");
    var mensajesError = document.querySelectorAll(".mensaje-error");
    mensajesError.forEach(function (mensaje) {
      mensaje.textContent = "";
    });
  });