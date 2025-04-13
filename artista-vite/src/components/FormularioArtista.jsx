import { useEffect, useState } from 'react'; 
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ArtistaService } from '../services/ArtistaService';
import { Card } from 'primereact/card';

function FormularioArtista({ onNuevoArtista, artistaEnEdicion, onGuardarEdicion }) {
  const [formData, setFormData] = useState({ nombre: '', apellido: '', email: '' });
  const [loading, setLoading] = useState(false);

  const artistaService = new ArtistaService();

  useEffect(() => {
    if (artistaEnEdicion) {
      setFormData({
        id_artista: artistaEnEdicion.id_artista,
        nombre: artistaEnEdicion.nombre,
        apellido: artistaEnEdicion.apellido,
        email: artistaEnEdicion.email
      });
    } else {
      setFormData({ nombre: '', apellido: '', email: '' });
    }
  }, [artistaEnEdicion]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarEmail(formData.email)) {
      alert('Por favor ingresa un email válido.');
      return;
    }

    setLoading(true);
    try {
      if (formData.id_artista) {
        const actualizado = await artistaService.update(formData);
        onGuardarEdicion(actualizado);
      } else {
        const nuevo = await artistaService.create(formData);
        onNuevoArtista(nuevo);
      }
      setFormData({ nombre: '', apellido: '', email: '' });
    } catch (error) {
      console.error('Error al guardar artista:', error);
      alert('Hubo un error al guardar el artista.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setFormData({ nombre: '', apellido: '', email: '' });
    onGuardarEdicion(null);
  };

  return (
    <Card title={formData.id_artista ? 'Editar Artista' : 'Crear nuevo artista'} className="mb-4">
      <form onSubmit={handleSubmit} className="p-fluid grid formgrid">
        <div className="field col-12 md:col-4">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="field col-12 md:col-4">
          <label htmlFor="apellido">Apellido</label>
          <InputText id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
        </div>
        <div className="field col-12 md:col-4">
          <label htmlFor="email">Email</label>
          <InputText id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="col-12 flex gap-2">
          <Button
            type="submit"
            label={formData.id_artista ? 'Guardar Cambios' : 'Agregar Artista'}
            icon={formData.id_artista ? 'pi pi-check' : 'pi pi-plus'}
            className={formData.id_artista ? 'p-button-warning' : 'p-button-success'}
            loading={loading}
          />

          {artistaEnEdicion && (
            <Button
              label="Cancelar"
              className="p-button-secondary"
              icon="pi pi-times"
              type="button"
              onClick={handleCancelar}
              disabled={loading}
            />
          )}
        </div>
      </form>
    </Card>
  );
}

export default FormularioArtista;