import { supabase } from './supabase.js';

// Función para hashear el DNI (SHA-256)
async function hashDNI(dni) {
  const msgBuffer = new TextEncoder().encode(dni.trim().toUpperCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

document.addEventListener('DOMContentLoaded', () => {
  // Verificación de Sesión Mock
  if (localStorage.getItem('safeAdoptLoggedIn') !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  // Elementos UI
  const btnLogout = document.getElementById('btn-logout');
  const btnOpenModal = document.getElementById('btn-open-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalReport = document.getElementById('modal-report');
  const formReport = document.getElementById('form-report');
  
  const searchInput = document.getElementById('search-input');
  const btnSearch = document.getElementById('btn-search');
  const resultsContainer = document.getElementById('results-container');
  const noResults = document.getElementById('no-results');

  // Funciones Modal
  const openModal = () => {
    modalReport.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  };

  const closeModal = () => {
    modalReport.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  btnOpenModal.addEventListener('click', openModal);
  btnCloseModal.addEventListener('click', closeModal);

  // Logout
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('safeAdoptLoggedIn');
    window.location.href = 'index.html';
  });

  // Cerrar al hacer clic fuera del modal
  modalReport.addEventListener('click', (e) => {
    if (e.target === modalReport) {
      closeModal();
    }
  });

  // Manejar envío del formulario
  formReport.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const rawDNI = document.getElementById('rep-dni').value;
    const hashedDni = await hashDNI(rawDNI);
    
    const reportData = {
      dni_hash: hashedDni,
      nombre: document.getElementById('rep-nombre').value,
      edad: document.getElementById('rep-edad').value,
      cp: document.getElementById('rep-cp').value,
      direccion: document.getElementById('rep-direccion').value,
      motivo: document.getElementById('rep-motivo').value,
      pruebas_texto: document.getElementById('rep-pruebas').value,
      // Archivos no se manejan en este mockup directamente a BD
    };

    console.log('Datos a insertar:', reportData);

    // TODO: Supabase real
    /*
    const { error } = await supabase.from('personas_no_aptas').insert([reportData]);
    if (error) {
      alert('Error al registrar: ' + error.message);
      return;
    }
    */

    alert(`Simulación: Registro exitoso.\nHash generado: ${hashedDni.substring(0, 16)}...`);
    formReport.reset();
    closeModal();
    
    // Simular que aparece en la búsqueda automáticamente si buscara
    searchInput.value = rawDNI;
    btnSearch.click();
  });

  // Manejar Búsqueda
  btnSearch.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // Si parece un DNI (números y letra), lo hasheamos para buscar
    let searchQuery = query;
    const isDni = /^[0-9]{8}[A-Za-z]$/.test(query) || /^[XYZxyz][0-9]{7}[A-Za-z]$/.test(query);
    
    if (isDni) {
      searchQuery = await hashDNI(query);
      console.log('Buscando por Hash:', searchQuery);
    } else {
      console.log('Buscando por Nombre:', searchQuery);
    }

    // TODO: Supabase real
    /*
    let request = supabase.from('personas_no_aptas').select('*');
    if (isDni) {
      request = request.eq('dni_hash', searchQuery);
    } else {
      request = request.ilike('nombre', `%${searchQuery}%`);
    }
    const { data, error } = await request;
    */

    // Simulación UI
    resultsContainer.innerHTML = '';
    
    // Mostramos resultados simulados solo si escriben "123" o algo parecido para testear
    if (query.includes('123')) {
      noResults.classList.add('hidden');
      const hashCorto = isDni ? searchQuery.substring(0, 16) : 'a8f5f167f44f4964';
      
      resultsContainer.innerHTML = `
        <div class="p-4 border-4 border-black bg-brand-orange/20 flex flex-col md:flex-row gap-4 justify-between md:items-center shadow-brutal mt-4">
          <div>
            <h3 class="font-bold text-lg mb-1">DNI Hash: ${hashCorto}...</h3>
            <p class="mb-1"><span class="font-bold bg-black text-white px-1">Motivo:</span> ${isDni ? 'Abandono' : 'Maltrato'}</p>
            <p class="text-sm">Registro encontrado mediante simulación de búsqueda.</p>
          </div>
          <div>
            <button class="bg-brand-purple text-white px-4 py-2 font-bold border-4 border-black shadow-brutal hover:bg-purple-400 active:shadow-brutal-hover active:translate-y-0.5 active:translate-x-0.5 transition-all">
              Ver Detalles
            </button>
          </div>
        </div>
      `;
    } else {
      noResults.classList.remove('hidden');
    }
  });
});
