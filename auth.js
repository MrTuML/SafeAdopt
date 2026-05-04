import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  // Toggle Tabs
  tabLogin.addEventListener('click', () => {
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    tabLogin.classList.add('bg-brand-green', 'text-black');
    tabLogin.classList.remove('hover:bg-zinc-200');
    tabRegister.classList.remove('bg-brand-green', 'text-black');
    tabRegister.classList.add('hover:bg-zinc-200');
  });

  tabRegister.addEventListener('click', () => {
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
    tabRegister.classList.add('bg-brand-green', 'text-black');
    tabRegister.classList.remove('hover:bg-zinc-200');
    tabLogin.classList.remove('bg-brand-green', 'text-black');
    tabLogin.classList.add('hover:bg-zinc-200');
  });

  // Handle Login
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    // Reset error
    errorDiv.classList.add('hidden');

    // Simulación de Login con Mock
    if (email === 'admin@safeadopt.es' && password === 'admin123') {
      console.log('Login mock exitoso:', email);
      localStorage.setItem('safeAdoptLoggedIn', 'true');
      
      // Mostrar feedback de éxito
      const submitBtn = formLogin.querySelector('button[type="submit"]');
      submitBtn.textContent = 'AUTENTICANDO...';
      submitBtn.classList.replace('bg-brand-green', 'bg-brand-purple');
      submitBtn.classList.add('text-white');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      // Mostrar mensaje de error en la UI
      errorDiv.classList.remove('hidden');
      errorDiv.textContent = '⚠️ Usuario o contraseña incorrectos. Use admin@safeadopt.es / admin123';
      
      // Feedback visual en el botón
      const submitBtn = formLogin.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'ERROR';
      submitBtn.classList.replace('bg-brand-green', 'bg-brand-orange');
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.classList.replace('bg-brand-orange', 'bg-brand-green');
      }, 2000);
    }
  });

  // Handle Register
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Recolectar datos
    const data = {
      ccaa: document.getElementById('reg-ccaa').value,
      municipio: document.getElementById('reg-municipio').value,
      nombre: document.getElementById('reg-nombre').value,
      cif: document.getElementById('reg-cif').value,
      nucleo: document.getElementById('reg-nucleo').value,
      email: document.getElementById('reg-email').value,
      telefono: document.getElementById('reg-telefono').value,
    };

    console.log('Register request:', data);

    // TODO: Usar supabase real
    /*
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: document.getElementById('reg-password').value,
    });
    
    // Insertar en tabla de protectoras con estado inactivo
    await supabase.from('protectoras').insert([{ ...data, user_id: authData.user.id, status: 'inactiva' }]);
    */

    alert('Solicitud enviada correctamente. Su cuenta está INACTIVA pendiente de validación.');
    
    // Volver a login
    tabLogin.click();
    formRegister.reset();
  });
});
