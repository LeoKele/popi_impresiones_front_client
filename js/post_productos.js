
const formNuevoProducto = document.getElementById('agregarProductos');

formNuevoProducto.addEventListener("submit", async (event) => {
  event.preventDefault();

  var errorNombre = document.getElementById("mensajeNombre");
  var errorDescripcion = document.getElementById("mensajeDescripcion");
  var errorCategoria = document.getElementById("mensajeCategoria");
  var errorPrecio = document.getElementById("mensajePrecio");

  function limpiarMensajes() {
    errorNombre.textContent = "";
    errorDescripcion.textContent = "";
    errorCategoria.textContent = "";
    errorPrecio.textContent = "";
  }
  limpiarMensajes();

  //* Validacion simple del form
  //Obtengo los valores de los campos
  const formData = new FormData(formNuevoProducto);
  //Obtengo los valores de los inputs
  const nombre = formData.get("nombre");
  const descripcion = formData.get("descripcion");
  const idCategoria = formData.get("idCategoria");
  const precio = formData.get("precio");

  const nombreValido = stringVacio(nombre);
  const descripcionValido = stringVacio(descripcion);
  const precioValido = esFloat(precio);
  const categoriaValido = esInt(idCategoria);

  //limpio campos
  document.getElementById("reset").addEventListener("click", function () {
    var mensajesError = document.querySelectorAll(".mensaje-error");
    mensajesError.forEach(function (mensaje) {
      mensaje.textContent = "";
    });
  });

  if (nombreValido || descripcionValido || !categoriaValido || !precioValido) {
    errorNombre.textContent = !nombreValido ? "" : "Por favor, completa este campo.";
    errorDescripcion.textContent = !descripcionValido ? "" : "Por favor, completa este campo.";
    errorCategoria.textContent = categoriaValido ? "" : "Por favor, ingrese un numero entero."; //! Deberia validar si existe un id de categoria con ese numero?
    errorPrecio.textContent = precioValido ? "" : "Por favor, ingrese un numero válido.";
  } else {
    //* Datos API
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        descripcion: descripcion,
        idCategoria: idCategoria,
        precio: precio,
      }),
    };
    const response = await fetch(
      "http://localhost:8080/app/productos/admin",
      options
    );
    const data = await response.json();

    if (response.status === 201) {
      swal({
        title: "Producto agregado correctamente",
        icon: "success",
      }).then((value) => {
        if (value) {
          // que se recargue la pagina para ver el producto agregada
          location.reload();
        }
      });
    } else {
      swal({
        title: "Error al agregar la pelicula.",
        text: "Por Favor, intente de nuevo más tarde",
        icon: "error",
      });
    }
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
