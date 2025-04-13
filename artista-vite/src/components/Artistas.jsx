import { useEffect, useRef, useState } from 'react';
import { ArtistaService } from '../services/ArtistaService';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';

const Artistas = () => {
  const [artistas, setArtistas] = useState([]);
  const [nuevoArtista, setNuevoArtista] = useState({
    id_artista: null,
    nombre: '',
    apellido: '',
    email: ''
  });
  const [editando, setEditando] = useState(false);
  const toast = useRef(null);
  const service = new ArtistaService();

  useEffect(() => {
    cargarArtistas();
  }, []);

  const cargarArtistas = () => {
    service.getAll().then(data => setArtistas(data));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoArtista({ ...nuevoArtista, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await service.modificar(nuevoArtista);
        toast.current.show({ severity: 'info', summary: 'Actualizado', detail: 'Artista actualizado.' });
      } else {
        await service.crear(nuevoArtista);
        toast.current.show({ severity: 'success', summary: 'Creado', detail: 'Artista creado exitosamente.' });
      }

      setNuevoArtista({ id_artista: null, nombre: '', apellido: '', email: '' });
      setEditando(false);
      cargarArtistas();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar.' });
    }
  };

  const handleEditar = (artista) => {
    setNuevoArtista(artista);
    setEditando(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este artista?')) {
      try {
        await service.eliminar(id);
        toast.current.show({ severity: 'warn', summary: 'Eliminado', detail: 'Artista eliminado correctamente.' });
        cargarArtistas();
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el artista.' });
      }
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="mb-3">{editando ? 'Editar Artista' : 'Crear Artista'}</h2>

      <form onSubmit={handleSubmit} className="p-fluid grid formgrid">
        <div className="field col-12 md:col-3">
          <InputText
            name="nombre"
            value={nuevoArtista.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
            required
          />
        </div>
        <div className="field col-12 md:col-3">
          <InputText
            name="apellido"
            value={nuevoArtista.apellido}
            onChange={handleInputChange}
            placeholder="Apellido"
            required
          />
        </div>
        <div className="field col-12 md:col-4">
          <InputText
            type="email"
            name="email"
            value={nuevoArtista.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="field col-12 md:col-2 flex align-items-center">
          <Button type="submit" label={editando ? 'Guardar' : 'Crear'} className="p-button-success mr-2" />
          {editando && (
            <Button
              type="button"
              label="Cancelar"
              className="p-button-secondary"
              onClick={() => {
                setNuevoArtista({ id_artista: null, nombre: '', apellido: '', email: '' });
                setEditando(false);
              }}
            />
          )}
        </div>
      </form>

      <table className="p-datatable table mt-4" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '10px' }}>Nombre</th>
            <th style={{ padding: '10px' }}>Apellido</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {artistas.map((artista) => (
            <tr key={artista.id_artista || artista.email}>
              <td style={{ padding: '10px' }}>{artista.nombre}</td>
              <td style={{ padding: '10px' }}>{artista.apellido}</td>
              <td style={{ padding: '10px' }}>{artista.email}</td>
              <td style={{ padding: '10px' }}>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-text p-button-info mr-2"
                  onClick={() => handleEditar(artista)}
                  tooltip="Editar"
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-text p-button-danger"
                  onClick={() => handleEliminar(artista.id_artista)}
                  tooltip="Eliminar"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Artistas;