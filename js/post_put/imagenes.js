const formNuevaImagen = document.getElementById("agregarImagenes");

formNuevaImagen.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Limpiar mensajes de error
  const errorId = document.getElementById("mensajeId");
  const errorCantidad = document.getElementById("mensajeCantidad");
  errorId.textContent = "";
  errorCantidad.textContent = "";

  // Obtener datos del formulario
  const formData = new FormData(formNuevaImagen);
  const idProducto = formData.get("idProducto").trim();
  const cantidadImagenes = parseInt(formData.get("cantidadImagenes").trim(), 10);

  // Validar campos
  if (!idProducto || isNaN(cantidadImagenes) || cantidadImagenes <= 0) {
    errorId.textContent = !idProducto ? "Por favor, completa este campo." : "";
    errorCantidad.textContent = !cantidadImagenes || cantidadImagenes <= 0 
      ? "Por favor, ingresa un número válido de imágenes." 
      : "";
    return;
  }

  // URL y configuración de cabeceras para la API
  const url = "http://localhost:8080/api/imagenes";
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Verificar si ya existen imágenes para este producto
    const response = await fetch(`${url}?productoId=${idProducto}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Error al consultar imágenes existentes.");
    }

    const imagenesExistentes = await response.json();
    const rutasExistentes = imagenesExistentes.map((imagen) => imagen.imgPath);

    let maxIndex = 0;
    rutasExistentes.forEach((ruta) => {
      const match = ruta.match(new RegExp(`^${idProducto}_(\\d+)\\.png$`));
      if (match) {
        maxIndex = Math.max(maxIndex, parseInt(match[1], 10));
      }
    });

    if (rutasExistentes.length > 0) {
      const confirm = await swal({
        title: "Imágenes existentes",
        text: `Ya existen ${rutasExistentes.length} imágenes para este producto. ¿Deseas agregar ${cantidadImagenes} nuevas imágenes?`,
        icon: "info",
        buttons: ["Cancelar", "Agregar"],
      });

      if (!confirm) {
        return;
      }
    }

    // Crear las nuevas imágenes
    for (let i = 1; i <= cantidadImagenes; i++) {
      const imgPath = `${idProducto}_${maxIndex + i}.png`;
      const imgData = {
        idProducto: idProducto,
        imgPath: imgPath,
      };

      const createResponse = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(imgData),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(errorText || `Error al guardar la imagen ${imgPath}`);
      }
    }

    // Mostrar mensaje de éxito
    swal({
      title: "Imágenes agregadas correctamente",
      text: `Se agregaron ${cantidadImagenes} nuevas imágenes para el producto con ID ${idProducto}.`,
      icon: "success",
    }).then(() => {
      location.reload();
    });

  } catch (error) {
    console.error("Error: ", error);
    swal({
      title: "Error al agregar imágenes",
      text: error.message || "Por favor, inténtelo de nuevo más tarde",
      icon: "error",
    });
  }
});
