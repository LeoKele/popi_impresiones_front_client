document.addEventListener('DOMContentLoaded',async()=>{
  //* Datos API
  const API_URL = "http://localhost:8080/app/productos/admin";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(API_URL, options);
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

    //Añadimos los botones de accion
    const tdAccion = document.createElement("td");
    tdAccion.classList.add("p-2");

    const btnModificar = document.createElement("button");
    btnModificar.type = "submit";
    btnModificar.classList.add("btn", "btn-warning", "my-1", "mx-1");
    btnModificar.innerHTML = "Modificar";
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "submit";
    btnEliminar.classList.add("btn", "btn-danger", "my-1", "mx-1");
    btnEliminar.innerHTML = "Eliminar";

    tdAccion.appendChild(btnModificar);
    tdAccion.appendChild(btnEliminar);

    //Añadimos los td al tr
    tr.appendChild(tdId);
    tr.appendChild(tdNombre);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdIdCategoria);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdAccion);
    //Añadimos el tr al tbody
    tbody.appendChild(tr);
  });
  document.getElementById('btnIndex').addEventListener('click', async() =>{
    const response = await fetch('http://localhost:8080/app/productos/index',options);
    const data = await response.json();
    const productos = data;

    const blob = new Blob([JSON.stringify(productos)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
      
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productos_index.json';
    link.click();
    
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnDetalle').addEventListener('click', async() =>{
    const response = await fetch('http://localhost:8080/app/productos/detalle',options);
    const data = await response.json();
    const productos = data;

    const blob = new Blob([JSON.stringify(productos)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
      
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productos_detalle.json';
    link.click();
    
    URL.revokeObjectURL(url);
  });
});

