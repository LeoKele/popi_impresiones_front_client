document.addEventListener('DOMContentLoaded',async()=>{
  const modalProducto = new bootstrap.Modal(document.getElementById('modalOtroProducto'));

    //* Datos API
    const API_URL = "http://localhost:8080/api/productos/admin?listado=0";
    //*Construimos URL con el parametro listado
    // const url = new URL(API_URL);
    // const params = new URLSearchParams();
    // params.append('listado','0');
    // url.search = params.toString;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
        const response = await fetch(API_URL, options);
        if(!response.ok){
            throw new Error (`HTTP error! Status: ${response.status}`);
        }
            const data = await response.json();
            const productos = data;
            //Obtenemos el body de la tabla
            const tbody = document.getElementById("bodyTableProductos");
            tbody.innerHTML = "";
            //Recorremos todos los productos
            productos.forEach((producto) => {
              const tr = document.createElement("tr");

              const tdId = document.createElement("td");
              tdId.classList.add("p-2");
              tdId.textContent = producto.id;

              const tdNombre = document.createElement("td");
              tdNombre.classList.add("p-2");
              tdNombre.textContent = producto.nombre;

              const tdDescripcion = document.createElement("td"); //! Revisar overflow
              tdDescripcion.classList.add("p-2");
              tdDescripcion.textContent = producto.descripcion;

              const tdIdCategoria = document.createElement("td");
              tdIdCategoria.classList.add("p-2");
              tdIdCategoria.textContent = producto.idCategoria;

              const tdPrecio = document.createElement("td");
              tdPrecio.classList.add("p-2");
              tdPrecio.textContent = `$${producto.precio}`;

              const tdCosto = document.createElement("td");
              tdCosto.classList.add("p-2");
              tdCosto.textContent = `$${producto.costo}`;

              const tdListado = document.createElement("td");
              tdListado.classList.add("d-none");
              tdListado.textContent = producto.listado;

              //Añadimos los botones de accion
              const tdAccion = document.createElement("td");
              tdAccion.classList.add("p-2");

              const btnModificar = document.createElement("a");
              btnModificar.href = "#agregarProductos";
              btnModificar.type = "submit";
              btnModificar.classList.add(
                "btn",
                "btn-warning",
                "my-1",
                "mx-1",
                "btnModificar"
              );
              btnModificar.innerHTML = "Modificar";
              const btnEliminar = document.createElement("button");
              btnEliminar.type = "submit";
              btnEliminar.classList.add(
                "btn",
                "btn-danger",
                "my-1",
                "mx-1",
                "btnEliminar"
              );
              btnEliminar.innerHTML = "Eliminar";

              tdAccion.appendChild(btnModificar);
              tdAccion.appendChild(btnEliminar);

              //Añadimos los td al tr
              tr.appendChild(tdId);
              tr.appendChild(tdNombre);
              tr.appendChild(tdDescripcion);
              tr.appendChild(tdIdCategoria);
              tr.appendChild(tdPrecio);
              tr.appendChild(tdCosto);
              tr.appendChild(tdListado);
              tr.appendChild(tdAccion);
              //Añadimos el tr al tbody
              tbody.appendChild(tr);
            });
    }
    catch (error){
        console.error('Error al hacer la solicitud:', error);
    }
    
    document.querySelectorAll('.btnEliminar').forEach(button => {
      button.addEventListener('click', async (event) => {
        const row = event.target.closest('tr');
        const productoId = row.querySelector('td:first-child').innerText.trim();
    
        // Confirmación de eliminación
        swal({
          title: "¿Estás seguro?",
          text: "Una vez eliminado, no podrás recuperar este producto",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(async (willDelete) => {
          if (willDelete) {
            try {
              const response = await fetch(`http://localhost:8080/api/productos/admin?id=${productoId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
    
              if (!response.ok) {
                swal({
                  title: "Error al eliminar el producto.",
                  text: "Por favor, intente de nuevo más tarde",
                  icon: "error",
                });
                throw new Error('Error al eliminar el producto');
              }
    
              const data = await response.json();
    
              // Si la eliminación fue exitosa, mostrar alerta de éxito
              swal({
                title: "Producto Eliminado Correctamente",
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
                const response = await fetch(`http://localhost:8080/api/productos/admin?id=${productoId}&listado=0`);
                if (!response.ok) {
                    // lanzo una excepcion en caso de que no funcione el fetch, esto se ve en la consola
                    throw new Error('Error al obtener los datos del producto');
                }
                const data = await response.json();
                const productoUnico = data[0];
                console.log(data);
                // son los id del formulario, como son unicos e irrepetibles dentro del html, sabe a quien insertarles los valores
                document.getElementById('id').value = productoUnico.id;
                document.getElementById('nombre').value = productoUnico.nombre;
                document.getElementById('descripcion').value = productoUnico.descripcion;
                document.getElementById('idCategoria').value = productoUnico.idCategoria;
                document.getElementById('precio').value = productoUnico.precio;
                document.getElementById('costo').value = productoUnico.costo
                document.getElementById('listado').value = productoUnico.listado;
                modalProducto.show();

                // manejo de excepciones, levanto la excepcion si hay error y la muestro en consola
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
    
  
  });
  
  