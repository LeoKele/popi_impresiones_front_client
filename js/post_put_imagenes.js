const formNuevaImagen = document.getElementById("agregarImagenes");

formNuevaImagen.addEventListener("submit", async (event) => {
  event.preventDefault();
  var errorId = document.getElementById("mensajeId");
  var errorRuta = document.getElementById("mensajeRuta");
  errorRuta.textContent = "";
  errorId.textContent = "";

  const formData = new FormData(formNuevaImagen);
  const id = formData.get("id");
  const idProducto = formData.get("idProducto");
  const ruta = formData.get("ruta");

  //comprobamos que no este vacio
  const idValido = stringVacio(idProducto);
  const rutaValido = stringVacio(ruta)

 

  if (idValido || rutaValido) {
    errorId.textContent = !idValido ? "" : "Por favor, completa este campo.";
    errorRuta.textContent = !rutaValido ? "" : "Por favor, completa este campo";
    return;
  } 
    //* Datos API

    
    let url = "http://localhost:8080/api/imagenes";
    let method = 'POST';

    const imgData = {
      idProducto: idProducto,
      imgPath: ruta
    };
    if (id){
      imgData.id = id;
      method = 'PUT';
    }

      //Configuramos para la peticion 
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imgData),
    };


    try {
      const response = await fetch(url, options);
    
      if (!response.ok) {
        const errorText = await response.text(); // Obtener el texto del error
        throw new Error(errorText || 'Error al guardar imagen');
      }
    
      const responseData = await response.json();
    
      if (method === 'POST') {
        if (response.status !== 201) {
          swal({
            title: "Error al agregar la imagen.",
            text: responseData.message || 'Error desconocido', // Mostrar el mensaje de error recibido
            icon: "error",
          });
          throw new Error(responseData.message || 'Error al agregar la imagen.');
        }
        swal({
          title: "Imagen agregada correctamente",
          icon: "success",
        }).then((value) => {
          if (value) {
            // Recargar la página para ver la imagen agregada
            location.reload();
          }
        });
      } else {
        // Si es 200, el producto se modificó correctamente
        if (response.status !== 200) {
          swal({
            title: "Error al modificar la imagen.",
            text: responseData.message || 'Error desconocido', // Mostrar el mensaje de error recibido
            icon: "error",
          });
          throw new Error(responseData.message || 'Error al modificar la imagen.');
        }
        swal({
          title: "Imagen modificada correctamente",
          icon: "success",
        }).then((value) => {
          if (value) {
            // Recargar la página para ver la imagen modificada
            location.reload();
          }
        });
      }
    
    } catch (error) {
      console.log('Error: ', error);
      swal({
        title: "Error al agregar la imagen.",
        text: error.message || "Por favor, inténtelo de nuevo más tarde",
        icon: "error",
      });
    }
    
    
  
});

function stringVacio(string) {
  if (string === "") return true;
};

 //limpio campos
 document.getElementById("reset").addEventListener("click", function () {
  const indicador = document.getElementById('indicador');
  indicador.classList.add("d-none");
  var mensajesError = document.querySelectorAll(".mensaje-error");
  mensajesError.forEach(function (mensaje) {
    mensaje.textContent = "";
  });
});
