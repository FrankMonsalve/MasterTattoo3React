import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import FormularioArtista from './FormularioArtista'; // Asegúrate de importar tu formulario de artistas
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';

const Home = () => {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [toast] = useState(null);

  // Función para manejar el login
  const handleLogin = () => {
    if (credentials.username === 'admin' && credentials.password === '12345') {
      setIsLoggedIn(true);
      setMostrarLogin(false); // Cierra el modal de login
      toast.current.show({ severity: 'success', summary: 'Bienvenido', detail: '¡Has iniciado sesión correctamente!' });
    } else {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas.' });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <header className="p-d-flex p-jc-between p-ai-center p-p-3" style={{ backgroundColor: '#f5f5f5' }}>
        <h1>Mi Aplicación</h1>
        
        {/* Icono de login */}
        {!isLoggedIn && (
          <Button
            icon="pi pi-sign-in"
            label="Login"
            className="p-button-text"
            onClick={() => setMostrarLogin(true)}
          />
        )}
      </header>
      
      {/* Ventana emergente (modal) para el login */}
      <Dialog
        header="Iniciar sesión"
        visible={mostrarLogin}
        style={{ width: '450px' }}
        onHide={() => setMostrarLogin(false)}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="username">Usuario</label>
            <InputText
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Introduce tu usuario"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <InputText
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Introduce tu contraseña"
            />
          </div>
          <Button
            label="Iniciar sesión"
            className="p-button-success"
            onClick={handleLogin}
          />
        </div>
      </Dialog>

      {/* Si está logueado, mostrar el CRUD */}
      {isLoggedIn && (
        <div className="p-4">
          <FormularioArtista /> {/* Aquí va el componente de CRUD que ya tienes */}
        </div>
      )}
    </div>
  );
};

export default Home;
