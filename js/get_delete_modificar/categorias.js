document.addEventListener('DOMContentLoaded',async()=>{
  //* Datos API
  const API_URL = "http://localhost:8080/api/categorias"; 
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(API_URL,options);
  const data = await response.json();
  const categorias = data;

  const tbody = document.getElementById("bodyTableCategorias");
  tbody.innerHTML = "";

  categorias.forEach((categoria)=>{
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.classList.add("p-2");
    tdId.textContent = categoria.id;

    const tdDescripcion = document.createElement("td");
    tdDescripcion.classList.add("p-2");
    tdDescripcion.textContent = categoria.descripcion;

    const tdListado = document.createElement("td");
    tdListado.classList.add("p-2");
    tdListado.textContent = categoria.listado;

    //Añadimos los botones de accion
    const tdAccion = document.createElement("td");
    tdAccion.classList.add("p-2");

    const btnModificar = document.createElement("a");
    btnModificar.href = '#agregarProductos';
    btnModificar.type = "submit";
    btnModificar.classList.add("btn", "btn-warning", "my-1", "mx-1","btnModificar");
    btnModificar.innerHTML = "Modificar";

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "submit";
    btnEliminar.classList.add("btn", "btn-danger", "my-1", "mx-1","btnEliminar");
    btnEliminar.innerHTML = "Eliminar";

    tdAccion.appendChild(btnModificar);
    tdAccion.appendChild(btnEliminar);

    tr.appendChild(tdId);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdListado);
    tr.appendChild(tdAccion);

    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btnEliminar').forEach(button => {
    button.addEventListener('click', async (event) => {
      const row = event.target.closest('tr');
      const categoriaId = row.querySelector('td:first-child').innerText.trim();
  
      // Confirmación de eliminación
      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar esta categoria",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await fetch(`http://localhost:8080/api/categorias?id=${categoriaId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            });
  
            if (!response.ok) {
              swal({
                title: "Error al eliminar la categoria.",
                text: "Por favor, intente de nuevo más tarde",
                icon: "error",
              });
              throw new Error('Error al la categoria');
            }
  
            const data = await response.json();
  
            // Si la eliminación fue exitosa, mostrar alerta de éxito
            swal({
              title: "Categoria Eliminada Correctamente",
              icon: "success",
            }).then((value) => {
              if (value) {
                // Recargar la página
                location.reload();
              }
            });
  
          } catch (error) {
            console.error('Error:', error);
          }
        }
      });
    });
  });

  //evento para modificar
  // Agregar eventos después de crear los botones
  document.querySelectorAll('.btnModificar').forEach(button => {
    
    button.addEventListener('click', async (event) => {
        const row = event.target.closest('tr');
        const productoId = row.querySelector('td:first-child').innerText.trim();// de la fila levanto el id de la pelicula por su clase, por un selector de hijo primero
        const indicador = document.getElementById('indicador');
        indicador.classList.remove("d-none");

        try {
            const response = await fetch(`http://localhost:8080/api/categorias?id=${productoId}`);
            if (!response.ok) {
                // lanzo una excepcion en caso de que no funcione el fetch, esto se ve en la consola
                throw new Error('Error al obtener los datos del producto');
            }
            const data = await response.json();
            const categoriaUnica = data[0];
            // son los id del formulario, como son unicos e irrepetibles dentro del html, sabe a quien insertarles los valores
            document.getElementById('id').value = categoriaUnica.id;
            document.getElementById('descripcion').value = categoriaUnica.descripcion;
            document.getElementById('listado').value = categoriaUnica.listado;

          
            // manejo de excepciones, levanto la excepcion si hay error y la muestro en consola
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

});