
const formNuevoPedido = document.getElementById('agregarPedidos');

formNuevoPedido.addEventListener("submit", async (event) => {
  event.preventDefault();

  var errorFecha = document.getElementById("mensajeFecha");
  var errorIdProducto = document.getElementById("mensajeIdProducto");
  var errorDescripcion = document.getElementById("mensajeDescripcion");

  function limpiarMensajes() {
    errorFecha.textContent = "";
    errorIdProducto.textContent = "";
    errorDescripcion.textContent = "";
  }
  limpiarMensajes();

  //* Validacion simple del form
  //Obtengo los valores de los campos
  const formData = new FormData(formNuevoPedido);
  //Obtengo los valores de los inputs
  const id = formData.get("id");
  const fecha = formData.get("fecha");
  const idProducto = formData.get("idProducto");
  const descripcion = formData.get("descripcion");

  const listo = formData.get("listo");
  const pagado = formData.get("pagado");
  const entregado  = formData.get("entregado");


  const fechaValido = stringVacio(fecha);
  const idProductoValido = esInt(idProducto);
  const descripcionValido = stringVacio(descripcion);


  if (fechaValido || !idProductoValido || descripcionValido ) {
    errorFecha.textContent = !fechaValido
      ? ""
      : "Por favor, completa este campo.";
    errorIdProducto.textContent = idProductoValido
      ? ""
      : "Por favor, completa este campo.";
    errorDescripcion.textContent = !descripcionValido
        ? ""
        : "Por favor, completa este campo.";
    return;
  }



  let url = "http://localhost:8080/api/pedidos";
  let method = 'POST';

  const pedidoData = {
    fechaRecibido: fecha,
    idProducto: idProducto,
    descripcion: descripcion,
    productoListo: listo,
    pagado: pagado,
    entregado: entregado
  };

  if (id){
    
    pedidoData.id = id;
    method = 'PUT';

  }
  //Configuramos para la peticion 
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedidoData)
  };


  try {
    const response = await fetch(url,options);
    if (!response.ok){
      throw new Error('Error al guardar el pedido');
    }
    const responseData = await response.json();
    if (method === 'POST'){
      if (response.status !==201){//201 indica que se creo correctamente
        swal({
          title: "Error al guardar el pedido.",
          text: "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error('Error al guardar el pedido');
      }
      swal({
        title: "Pedido agregado correctamente",
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
          title: "Error al modificar el pedido.",
          text: "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error('Error al modificar el pedido');
      }
      swal({
        title: "Pedido modificada correctamente",
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
      title: "Error al agregar el pedido.",
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