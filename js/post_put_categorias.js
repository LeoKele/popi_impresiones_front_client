const formNuevaCategoria = document.getElementById('agregarCategorias');

formNuevaCategoria.addEventListener("submit", async (event)=>{
  event.preventDefault();

  var errorDescripcion = document.getElementById("mensajeDescripcion");
  errorDescripcion.textContent = "";

  const formData = new FormData(formNuevaCategoria);
  const id = formData.get("id");
  const descripcion = formData.get("descripcion");

  //comprobamos que no este vacio
  const descripcionValido = stringVacio(descripcion);


    if (descripcionValido){
        errorDescripcion.textContent = "Por favor, completa este campo.";
        return;

    }

    let url = "http://localhost:8080/api/categorias";
    let method = 'POST';

    const categoriaData = {
      descripcion: descripcion
    };

    if (id){
      categoriaData.id = id;
      method = 'PUT';
    }

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoriaData)
    };


    try {
      const response = await fetch(url,options);
      if (!response.ok){
        throw new Error('Error al guardar categoria');
      }
      const responseData = await response.json();
      if (method === 'POST'){
        if (response.status !==201){//201 indica que se creo correctamente
          swal({
            title: "Error al guardar la categoria.",
            text: "Por Favor, intente de nuevo más tarde",
            icon: "error",
          });
          throw new Error('Error al guardar la categoria.');
        }
        swal({
          title: "Categoria agregada correctamente",
          icon: "success",
        }).then((value) => {
          if (value) {
            // que se recargue la pagina para ver la categoria agregada
            location.reload();
          }
        });
      } else {
        console.log("put");
        //si es 200, el producto se modifico correctamente
        if (response.status !== 200){
          swal({
            title: "Error al modificar la categoria.",
            text: "Por Favor, intente de nuevo más tarde",
            icon: "error",
          });
          throw new Error('Error al modificar la categoria.');
        }
        swal({
          title: "Categoria modificada correctamente",
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
        title: "Error al agregar la categoria.",
        text: "Por Favor, intente de nuevo más tarde",
        icon: "error",
      });
    }

    
});

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