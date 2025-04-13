// src/services/ArtistaService.js
import axios from 'axios';

export class ArtistaService {
  constructor() {
    this.baseUrl = 'http://localhost:8080/artista';
  }

  async getAll() {
    const response = await axios.get(`${this.baseUrl}/mostrar`);
    return response.data;
  }

  async create(artista) {
    const response = await axios.post(`${this.baseUrl}/nuevo`, artista);
    return response.data;
  }
    async eliminar(id) {
    const response = await axios.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async update(artista) {
    const response = await axios.put(`${this.baseUrl}/modificar`, artista);
    return response.data;
  }
  
  
}
