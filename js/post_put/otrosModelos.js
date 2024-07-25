
const formNuevoProducto = document.getElementById('agregarProductos');

formNuevoProducto.addEventListener("submit", async (event) => {
  event.preventDefault();

  var errorNombre = document.getElementById("mensajeNombre");
  var errorDescripcion = document.getElementById("mensajeDescripcion");
  var errorCategoria = document.getElementById("mensajeCategoria");
  var errorPrecio = document.getElementById("mensajePrecio");
  var errorListado = document.getElementById("mensajeListado");

  function limpiarMensajes() {
    errorNombre.textContent = "";
    errorDescripcion.textContent = "";
    errorCategoria.textContent = "";
    errorPrecio.textContent = "";
    errorListado.textContent = "";
  }
  limpiarMensajes();

  //* Validacion simple del form
  //Obtengo los valores de los campos
  const formData = new FormData(formNuevoProducto);
  //Obtengo los valores de los inputs
  const id = formData.get("id");
  const nombre = formData.get("nombre");
  const descripcion = formData.get("descripcion");
  const idCategoria = formData.get("idCategoria");
  const precio = formData.get("precio");
  const listado = formData.get("listado");

  const nombreValido = stringVacio(nombre);
  const descripcionValido = stringVacio(descripcion);
  const precioValido = esFloat(precio);
  const categoriaValido = esInt(idCategoria);
  const listadoValido = esTiny(listado);


  if (nombreValido || descripcionValido || !categoriaValido || !precioValido || !listadoValido) {
    errorNombre.textContent = !nombreValido
      ? ""
      : "Por favor, completa este campo.";
    errorDescripcion.textContent = !descripcionValido
      ? ""
      : "Por favor, completa este campo.";
    errorCategoria.textContent = categoriaValido
      ? ""
      : "Por favor, ingrese un número entero."; //! Deberia validar si existe un id de categoria con ese numero?
    errorPrecio.textContent = precioValido
      ? ""
      : "Por favor, ingrese un número válido.";
    errorListado.textContent = listadoValido
      ? ""
      : "Por favor, ingrese un número válido"
    return;
  }



  let url = "http://localhost:8080/api/productos/admin";
  let method = 'POST';

  const productoData = {
    nombre: nombre,
    descripcion: descripcion,
    idCategoria: idCategoria,
    precio: precio,
    listado: listado
  };

  console.log(id);
  if (id){
    
    productoData.id = id;
    method = 'PUT';

  }
  //Configuramos para la peticion 
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productoData)
  };


  try {
    const response = await fetch(url,options);
    if (!response.ok){
      throw new Error('Error al guardar producto');
    }
    const responseData = await response.json();
    if (method === 'POST'){
      if (response.status !==201){//201 indica que se creo correctamente
        swal({
          title: "Error al guardar el producto.",
          text: "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error('Error al guardar el producto');
      }
      swal({
        title: "Producto agregado correctamente",
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
          title: "Error al modificar el producto.",
          text: "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error('Error al modificar el producto');
      }
      swal({
        title: "Producto modificado correctamente",
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
      title: "Error al agregar el producto.",
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

function esTiny(numero) {
  const valorNumerico = parseFloat(numero); // Convierte el valor a número
  if (!isNaN(valorNumerico) && Number.isInteger(valorNumerico) && (valorNumerico === 0 || valorNumerico === 1)) {
      return true;
  } else {
      return false;
  }
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