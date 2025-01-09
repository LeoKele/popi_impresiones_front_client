document.addEventListener('DOMContentLoaded', async () => {
  const modalProducto = new bootstrap.Modal(document.getElementById('modalImagen'));

  //* Datos API
  const API_URL = "http://localhost:8080/api/imagenes"; 
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(API_URL, options);
  const data = await response.json();
  const imagenes = data;

  const tbody = document.getElementById("bodyTableImagenes");
  tbody.innerHTML = "";

  imagenes.forEach((imagen) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.classList.add("d-none");
    tdId.textContent = imagen.id;

    const tdIdProducto = document.createElement("td");
    tdIdProducto.classList.add("p-2");
    tdIdProducto.textContent = imagen.idProducto;

    const tdDescripcion = document.createElement("td");
    tdDescripcion.classList.add("p-2");
    tdDescripcion.textContent = imagen.imgPath;

    // Botones de acción
    const tdAccion = document.createElement("td");
    tdAccion.classList.add("p-2");

    // const btnModificar = document.createElement("a");
    // btnModificar.href = '#';
    // btnModificar.type = "submit";
    // btnModificar.classList.add("btn", "btn-warning", "my-1", "mx-1", "btnModificar");
    // btnModificar.innerHTML = "Modificar";

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "submit";
    btnEliminar.classList.add("btn", "btn-danger", "my-1", "mx-1", "btnEliminar");
    btnEliminar.innerHTML = "Eliminar";

    // tdAccion.appendChild(btnModificar);
    tdAccion.appendChild(btnEliminar);

    tr.appendChild(tdId);
    tr.appendChild(tdIdProducto);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdAccion);

    tbody.appendChild(tr);
  });

  // Eliminar imagen
  document.querySelectorAll('.btnEliminar').forEach(button => {
    button.addEventListener('click', async (event) => {
      const row = event.target.closest('tr');
      const imagenId = row.querySelector('td:first-child').innerText.trim();

      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar esta imagen",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await fetch(`http://localhost:8080/api/imagenes?id=${imagenId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              swal({
                title: "Error al eliminar la imagen.",
                text: "Por favor, intente de nuevo más tarde",
                icon: "error",
              });
              throw new Error('Error al eliminar la imagen');
            }

            swal({
              title: "Imagen Eliminada Correctamente",
              icon: "success",
            }).then(() => {
              location.reload();
            });

          } catch (error) {
            console.error('Error:', error);
          }
        }
      });
    });
  });

  // Modificar imagen
  document.querySelectorAll('.btnModificar').forEach(button => {
    button.addEventListener('click', async (event) => {
      const row = event.target.closest('tr');
      const imagenId = row.querySelector('td:first-child').innerText.trim();
      const indicador = document.getElementById('indicador');
      indicador.classList.remove("d-none");

      try {
        const response = await fetch(`http://localhost:8080/api/imagenes?id=${imagenId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la imagen');
        }
        const data = await response.json();
        const imagenUnica = data[0];

        document.getElementById('id').value = imagenUnica.id;
        document.getElementById('idProducto').value = imagenUnica.idProducto;
        document.getElementById('cantidadImagenes').value = 1; // Asumimos que se modifica una sola imagen
        modalProducto.show();

      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
});
