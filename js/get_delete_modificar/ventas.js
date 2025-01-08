document.addEventListener('DOMContentLoaded',async()=>{
  const modalProducto = new bootstrap.Modal(document.getElementById('modalVenta'));
    //* Datos API
    const API_URL = "http://localhost:8080/api/ventas";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    //*Valor default para el input type date
    // Establecer la fecha actual como valor predeterminado
    var today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    var formattedDate = today.toISOString().substring(0, 10);
    document.getElementById("fecha").value = formattedDate;
    


    const response = await fetch(API_URL, options);
    const data = await response.json();
    const ventas = data;
    //Obtenemos el body de la tabla
    const tbody = document.getElementById("bodyTableVentas");
    tbody.innerHTML = "";
    
    ventas.forEach((venta) => {
      const tr = document.createElement("tr");
  
      const tdId = document.createElement("td");
      tdId.classList.add("d-none");
      tdId.textContent = venta.id;
  
      const tdFecha = document.createElement("td");
      tdFecha.classList.add("p-2");
      var fechaConvertida = convertirFecha(venta.fechaVenta);
      tdFecha.textContent = fechaConvertida;
  
      const tdIdProducto = document.createElement("td"); //! Revisar overflow
      tdIdProducto.classList.add("p-2");
      tdIdProducto.textContent = venta.idProducto;
  
      const tdNombre = document.createElement("td");
      tdNombre.classList.add("p-2");
      tdNombre.textContent = venta.nombre;
  
      
      const tdCantidad = document.createElement("td");
      tdCantidad.classList.add("p-2");
      tdCantidad.textContent = venta.cantidad;
      
      const tdPrecio = document.createElement("td");
      tdPrecio.classList.add("p-2");
      tdPrecio.textContent = `$${venta.precioUnitario}`;

      const tdTotal = document.createElement("td");
      tdTotal.classList.add("p-2");
      tdTotal.textContent = `$${venta.total}`;

      const tdGanancia = document.createElement("td");
      tdGanancia.classList.add("p-2");
      tdGanancia.textContent = `$${venta.ganancia}`;


      //Añadimos los botones de accion
      const tdAccion = document.createElement("td");
      tdAccion.classList.add("p-2");
  
      const btnModificar = document.createElement("a");
      btnModificar.href = '#agregarVentas';
      btnModificar.type = "submit";
      btnModificar.classList.add("btn", "btn-warning", "my-1", "mx-1","btnModificar");
      btnModificar.innerHTML = "Modificar";
      const btnEliminar = document.createElement("button");
      btnEliminar.type = "submit";
      btnEliminar.classList.add("btn", "btn-danger", "my-1", "mx-1","btnEliminar");
      btnEliminar.innerHTML = "Eliminar";
  
      tdAccion.appendChild(btnModificar);
      tdAccion.appendChild(btnEliminar);
  
      //Añadimos los td al tr
      tr.appendChild(tdId);
      tr.appendChild(tdFecha);
      tr.appendChild(tdIdProducto);
      tr.appendChild(tdNombre);
      tr.appendChild(tdCantidad);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdTotal);
      tr.appendChild(tdGanancia);
      tr.appendChild(tdAccion);
      //Añadimos el tr al tbody
      tbody.appendChild(tr);
    });
  
 
    document.querySelectorAll('.btnEliminar').forEach(button => {
      button.addEventListener('click', async (event) => {
        const row = event.target.closest('tr');
        const ventaId = row.querySelector('td:first-child').innerText.trim();
    
        // Confirmación de eliminación
        swal({
          title: "¿Estás seguro?",
          text: "Una vez eliminado, no podrás recuperar este venta",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(async (willDelete) => {
          if (willDelete) {
            try {
              const response = await fetch(`http://localhost:8080/api/ventas?id=${ventaId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
    
              if (!response.ok) {
                swal({
                  title: "Error al eliminar la venta.",
                  text: "Por favor, intente de nuevo más tarde",
                  icon: "error",
                });
                throw new Error('Error al eliminar la venta');
              }
    
              const data = await response.json();
    
              // Si la eliminación fue exitosa, mostrar alerta de éxito
              swal({
                title: "Venta Eliminada Correctamente",
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
            const ventaId = row.querySelector('td:first-child').innerText.trim();// de la fila levanto el id de la pelicula por su clase, por un selector de hijo primero
            const indicador = document.getElementById('indicador');
            indicador.classList.remove("d-none");
  
            try {
                const response = await fetch(`http://localhost:8080/api/ventas?id=${ventaId}`);
                if (!response.ok) {
                    // lanzo una excepcion en caso de que no funcione el fetch, esto se ve en la consola
                    throw new Error('Error al obtener los datos de la venta');
                }
                const data = await response.json();
                const ventaUnica = data[0];
                // son los id del formulario, como son unicos e irrepetibles dentro del html, sabe a quien insertarles los valores
                document.getElementById('id').value = ventaUnica.id;
                document.getElementById('fecha').value = ventaUnica.fechaVenta;
                document.getElementById('idProducto').value = ventaUnica.idProducto;
                document.getElementById('cantidad').value = ventaUnica.cantidad;
                document.getElementById('precio').value = ventaUnica.precioUnitario;
                modalProducto.show();

                // manejo de excepciones, levanto la excepcion si hay error y la muestro en consola
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
    
  
  });
  

//Funcion para convertir la fecha a formato "DD-MM-YYYY"
function convertirFecha(fechaYyyymmdd) {
  try {
      const fechaObj = new Date(fechaYyyymmdd);
      const dia = fechaObj.getDate() + 1;
      const mes = fechaObj.getMonth() + 1; // Los meses en JavaScript son base 0 (enero = 0)
      const anio = fechaObj.getFullYear();

      // Formatea la fecha como "DD-MM-YYYY"
      const fechaDdmmyyyy = `${dia}-${mes}-${anio}`;
      return fechaDdmmyyyy;
  } catch (error) {
      return "Fecha inválida";
  }
}
