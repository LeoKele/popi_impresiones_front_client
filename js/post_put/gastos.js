
const formNuevoGasto = document.getElementById('agregarGastos');

formNuevoGasto.addEventListener("submit", async (event) => {
  event.preventDefault();

  var errorFecha = document.getElementById("mensajeFecha");
  var errorDescripcion = document.getElementById("mensajeDescripcion");
  var errorCosto = document.getElementById("mensajeCosto");

  function limpiarMensajes() {
    errorFecha.textContent = "";
    errorDescripcion.textContent = "";
    errorCosto.textContent = "";
  }
  limpiarMensajes();

  //* Validacion simple del form
  //Obtengo los valores de los campos
  const formData = new FormData(formNuevoGasto);
  //Obtengo los valores de los inputs
  const id = formData.get("id");
  const fecha = formData.get("fecha");
  const descripcion = formData.get("descripcion");
  const costo = formData.get("costo");

  const fechaValido = stringVacio(fecha);
  const descripcionValido = stringVacio(descripcion);
  const costoValido = esFloat(costo);

  console.log(descripcionValido);
  if (fechaValido || descripcionValido || !costoValido) {
    errorFecha.textContent = !fechaValido
      ? ""
      : "Por favor, completa este campo.";
    errorDescripcion.textContent = !descripcionValido
      ? ""
      : "Por favor, completa este campo.";
    errorCosto.textContent = costoValido
      ? ""
      : "Por favor, ingrese un número entero."; //! Deberia validar si existe un id de categoria con ese numero?
    return;
  }



  let url = "http://localhost:8080/api/gastos";
  let method = 'POST';

  const gastoData = {
    fecha: fecha,
    descripcion: descripcion,
    costo: costo
  };

  if (id){
    gastoData.id = id;
    method = 'PUT';

  }
  //Configuramos para la peticion 
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gastoData)
  };


  try {
    const response = await fetch(url,options);
    if (!response.ok){
      throw new Error('Error al guardar el gasto');
    }
    const responseData = await response.json();
    if (method === 'POST'){
      if (response.status !==201){//201 indica que se creo correctamente
        swal({
          title: "Error al guardar el gasto.",
          text: "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error('Error al guardar el gasto');
      }
      swal({
        title: "Gasto agregado correctamente",
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
          title: "Error al modificar el gasto.",
          text: "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error('Error al modificar el gasto');
      }
      swal({
        title: "Gasto modificado correctamente",
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
      title: "Error al agregar el gasto.",
      text: "Por Favor, intente de nuevo más tarde",
      icon: "error",
    });
  }
});



function esFloat(valor){
    const numero = parseFloat(valor);
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