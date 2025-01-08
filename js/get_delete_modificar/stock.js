document.addEventListener('DOMContentLoaded',async()=>{
  const modalProducto = new bootstrap.Modal(document.getElementById('modalStock'));

    //* Datos API
    const API_URL = "http://localhost:8080/api/stock"; 
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    const response = await fetch(API_URL,options);
    const data = await response.json();
    const stock = data;
  
    const tbody = document.getElementById("bodyTableStock");
    tbody.innerHTML = "";
  
    stock.forEach((producto)=>{
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.classList.add("d-none");
      tdId.textContent = producto.id;

      const tdIdProducto = document.createElement("td");
      tdIdProducto.classList.add("p-2");
      tdIdProducto.textContent = producto.idProducto;
  
      const tdNombre = document.createElement("td");
      tdNombre.classList.add("p-2");
      tdNombre.textContent = producto.nombre;
  
      const tdCantidad = document.createElement("td");
      tdCantidad.classList.add("p-2");
      tdCantidad.textContent = producto.cantidad;
  
      //Añadimos los botones de accion
      const tdAccion = document.createElement("td");
      tdAccion.classList.add("p-2");
  
      const btnModificar = document.createElement("a");
      btnModificar.href = '#';
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
      tr.appendChild(tdIdProducto);
      tr.appendChild(tdNombre);
      tr.appendChild(tdCantidad );
      tr.appendChild(tdAccion);
  
      tbody.appendChild(tr);
    });
    
    document.querySelectorAll('.btnEliminar').forEach(button => {
      button.addEventListener('click', async (event) => {
        const row = event.target.closest('tr');
        const id = row.querySelector('td:first-child').innerText.trim();
    
        // Confirmación de eliminación
        swal({
          title: "¿Estás seguro?",
          text: "Una vez eliminado, no podrás recuperar este registro",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(async (willDelete) => {
          if (willDelete) {
            try {
              const response = await fetch(`http://localhost:8080/api/stock?id=${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
    
              if (!response.ok) {
                swal({
                  title: "Error al eliminar el registro",
                  text: "Por favor, intente de nuevo más tarde",
                  icon: "error",
                });
                throw new Error('Error al eliminar el registro');
              }
    
              const data = await response.json();
    
              // Si la eliminación fue exitosa, mostrar alerta de éxito
              swal({
                title: "Registro Eliminado Correctamente",
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
        const id = row.querySelector('td:first-child').innerText.trim();// de la fila levanto el id de la pelicula por su clase, por un selector de hijo primero
        const indicador = document.getElementById('indicador');
        indicador.classList.remove("d-none");

        try {
            const response = await fetch(`http://localhost:8080/api/stock?id=${id}`);
            if (!response.ok) {
                // lanzo una excepcion en caso de que no funcione el fetch, esto se ve en la consola
                throw new Error('Error al obtener los datos del registro');
            }
            const data = await response.json();
            const productoUnico = data[0];
            console.log(data);
            // son los id del formulario, como son unicos e irrepetibles dentro del html, sabe a quien insertarles los valores
            document.getElementById('id').value = productoUnico.id;
            document.getElementById('idProducto').value = productoUnico.idProducto;
            document.getElementById('cantidad').value = productoUnico.cantidad;
            modalProducto.show();

            // manejo de excepciones, levanto la excepcion si hay error y la muestro en consola
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
  
  });