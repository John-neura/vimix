// 1. Conexión a Supabase
const supabaseUrl = 'https://rspiwnprbsxxojhkhqun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcGl3bnByYnN4eG9qaGtocXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTYwMTcsImV4cCI6MjA2Mjk5MjAxN30.LGiby4wzYEkZ5MEkwR0ogT_fzrzfUaCbDyiKuJ9aknY';
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey); // ✅ Nombre correcto

// 2. Mostrar formulario de admin al hacer clic en el botón
document.getElementById("btnAdmin").addEventListener("click", function () {
  document.getElementById("form_admin").style.display = "block";
});

// 3. Cerrar formulario de admin
document.getElementById("cerrar_admin").addEventListener("click", () => {
  document.getElementById("form_admin").style.display = "none";
});

// 4. Validación de login
document.getElementById("form_admin").addEventListener("submit", function (event) {
  event.preventDefault();

  const correo = document.querySelector('input[name="correo"]').value;
  const clave = document.querySelector('input[name="clave"]').value;

  const correoAdmin = "johnjairopinzonquintana@gmail.com";
  const claveAdmin = "1234";

  if (correo === correoAdmin && clave === claveAdmin) {
    document.getElementById("formulario").style.display = "block";
    document.getElementById("form_admin").style.display = "none";
  } else {
    alert("Credenciales incorrectas");
  }
});

// 5. Insertar URL de video en Supabase
document.getElementById("formulario").addEventListener("submit", async function (event) {
  event.preventDefault();

  const url = document.getElementById("videoUrl").value;
  const embedUrl = transformarUrl(url);

  if (embedUrl) {
    // ✅ USO CORRECTO DE supabaseClient
    const { data, error } = await supabaseClient
      .from('videos')
      .insert([{ url: url, titulo:"" }]);

    if (error) {
      alert("Error al subir a Supabase");
      console.error(error);
    } else {
      alert("Video subido");
      console.log("Insertado:", data); // ✅ Para verificar que se insertó
      document.getElementById("videoUrl").value = "";
      cargarVideos(); // recargar lista
    }
  } else {
    alert("URL no válida o no es de YouTube.");
  }
});

// 6. Función para transformar URL a formato embebido
function transformarUrl(url) {
  const regExp = /^.*(?:youtu.be\/|youtube\.com\/watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
}

// 7. Mostrar videos guardados en Supabase
async function cargarVideos() {
  const { data, error } = await supabaseClient
    .from('videos')
    .select('*')
    .order('creado_en', { ascending: false });

  const contenedor = document.getElementById("videos");
  contenedor.innerHTML = "";

  if (error) {
    console.error("Error cargando videos:", error);
    return;
  }

  if (data.length === 0) {
    contenedor.innerHTML = "<p>No hay videos aún.</p>";
    return;
  }

  data.forEach(video => {
    const embedUrl = transformarUrl(video.url);
    if (embedUrl) {
      const iframe = document.createElement("iframe");
      iframe.src = embedUrl;
      iframe.width = "350";
      iframe.height = "650";
      iframe.frameBorder = "0";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      contenedor.appendChild(iframe);
    }
  });
}

// 8. Cargar videos al abrir la página
cargarVideos();
