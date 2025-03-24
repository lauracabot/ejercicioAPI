// Usamos tu clave de Unsplash (recomendación: cambiarla después para protegerla)
const UNSPLASH_ACCESS_KEY = 'Gh0lEqW58QXoDBgrjfBptQBB2NlAM2lfT5QCIF9mnm0';

// Buscar imagen en Unsplash según el nombre
async function buscarImagenEnUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en Unsplash: ${response.status}`);
    }

    const data = await response.json();

    if (data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      console.warn(`No se encontró imagen para "${query}"`);
      return 'https://via.placeholder.com/250x300.png?text=Sin+Imagen';
    }

  } catch (error) {
    console.error('Error buscando en Unsplash:', error);
    return 'https://via.placeholder.com/250x300.png?text=Error';
  }
}

// Obtener personajes desde la API de Studio Ghibli
async function obtenerPersonajes() {
  const url = 'https://ghibliapi.vercel.app/people';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en Ghibli API: ${response.status}`);
    }

    const personajes = await response.json();
    mostrarPersonajes(personajes);

  } catch (error) {
    console.error('Error obteniendo personajes:', error);
    const contenedor = document.getElementById('personajes');
    contenedor.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

// Mostrar personajes en el HTML
async function mostrarPersonajes(personajes) {
    const contenedor = document.getElementById('personajes');
    contenedor.innerHTML = '';
  
    // Usamos for...of para poder usar continue sin errores
    for (const personaje of personajes) {
      const imagenURL = await buscarImagenEnUnsplash(personaje.name);
  
      // Si no hay imagen buena, salta al siguiente
      if (imagenURL.includes('placeholder') || imagenURL.includes('Error')) {
        console.warn(`No agregando tarjeta para: ${personaje.name}`);
        continue;
      }
  
      const card = document.createElement('div');
      card.classList.add('personaje-card');
  
      const img = document.createElement('img');
      img.src = imagenURL;
      img.alt = personaje.name;
  
      const info = document.createElement('div');
      info.classList.add('personaje-info');
  
      info.innerHTML = `
        <h2>${personaje.name}</h2>
        <p><strong>Género:</strong> ${personaje.gender}</p>
        <p><strong>Edad:</strong> ${personaje.age || 'Desconocida'}</p>
        <p><strong>Especie:</strong> ${personaje.species}</p>
      `;
  
      card.appendChild(img);
      card.appendChild(info);
  
      contenedor.appendChild(card);
    }
  }
  
// Agregar evento al botón
document.getElementById('btn-cargar-personajes').addEventListener('click', obtenerPersonajes);
