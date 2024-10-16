// Seleccionar el enlace o botón que va a activar el desplazamiento
const historyLink = document.querySelector(".history-link");

// Seleccionar la sección a la que se va a desplazar
const historySection = document.querySelector(".history");

// Agregar un evento al hacer clic en el enlace
historyLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevenir el comportamiento por defecto

  // Desplazar suavemente hacia la sección de "history"
  historySection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});