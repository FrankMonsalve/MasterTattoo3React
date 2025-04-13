import { useEffect, useState, useRef } from 'react';
import { ArtistaService } from './services/ArtistaService';
import FormularioArtista from './components/FormularioArtista';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './styles/tablaArtistas.css';
import LoginForm from './components/LoginForm';  // Importamos el formulario de login

function App() {
  const [artistas, setArtistas] = useState([]);
  const [artistaEnEdicion, setArtistaEnEdicion] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Estado para controlar el login
  const artistaService = new ArtistaService();
  const toast = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {  // Solo trae los artistas si el usuario está logueado
      artistaService.getAll().then(data => {
        setArtistas(data);
      }).catch(error => {
        console.error("Error al traer los artistas:", error);
      });
    }
  }, [isLoggedIn]);

  const agregarArtista = (nuevo) => {
    setArtistas(prev => [...prev, nuevo]);
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Artista agregado' });
  };

  const eliminarArtista = async (rowData) => {
    try {
      const confirmado = window.confirm(`¿Estás seguro de eliminar a ${rowData.nombre}?`);
      if (!confirmado) return;

      const resultado = await artistaService.eliminar(rowData.id_artista);
      if (resultado) {
        setArtistas(prev => prev.filter(a => a.id_artista !== rowData.id_artista));
        toast.current.show({ severity: 'warn', summary: 'Eliminado', detail: `Artista ${rowData.nombre} eliminado` });
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el artista' });
      }
    } catch (error) {
      console.error("Error al eliminar el artista:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar el artista' });
    }
  };

  const editarArtista = (rowData) => {
    setArtistaEnEdicion(rowData); // Cargamos el artista al formulario
  };

  const guardarEdicion = (artistaEditado) => {
    if (!artistaEditado) {
      setArtistaEnEdicion(null);
      return;
    }

    setArtistas(prev =>
      prev.map(a => (a.id_artista === artistaEditado.id_artista ? artistaEditado : a))
    );
    setArtistaEnEdicion(null);
    toast.current.show({ severity: 'info', summary: 'Actualizado', detail: 'Artista modificado correctamente' });
  };

  const accionesTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" className="p-button-text p-button-sm" onClick={() => editarArtista(rowData)} />
      <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" onClick={() => eliminarArtista(rowData)} />
    </div>
  );

  const handleLogin = (status) => {
    setIsLoggedIn(status); // Cambiamos el estado de login
  };

  return (
    <div className="tabla-artistas-container">
      <Toast ref={toast} />
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />  // Si no está logueado, mostramos el login
      ) : (
        <>
          <h2>Lista de Artistas</h2>

          <FormularioArtista
            onNuevoArtista={agregarArtista}
            artistaEnEdicion={artistaEnEdicion}
            onGuardarEdicion={guardarEdicion}
          />

          <DataTable value={artistas} paginator rows={5} responsiveLayout="scroll" className="p-mt-4">
            <Column field="nombre" header="Nombre" />
            <Column field="apellido" header="Apellido" />
            <Column field="email" header="Email" />
            <Column header="Acciones" body={accionesTemplate} style={{ width: '150px' }} />
          </DataTable>
        </>
      )}
    </div>
  );
}

export default App;
