import { useState, useEffect } from 'react';
import useContratacion from '../hooks/useContratacion';
import { TipoServicioEnum, DatosContratacion } from '../services/contratacionService';
import '../styles/ContratarPage.css';

function ContratarPage() {
  const { cargando, error, exito, resultado, contratar, limpiar } = useContratacion();
  
  const [tipoServicio, setTipoServicio] = useState<TipoServicioEnum>(TipoServicioEnum.POR_HORAS);
  const [clienteId, setClienteId] = useState('');
  
  // Parámetros específicos según tipo de servicio
  const [tarifaPorHora, setTarifaPorHora] = useState('');
  const [horasEstimadas, setHorasEstimadas] = useState('');
  
  const [montoBase, setMontoBase] = useState('');
  const [complejidad, setComplejidad] = useState<'BAJA' | 'MEDIA' | 'ALTA'>('MEDIA');
  
  const [montoPorEntregable, setMontoPorEntregable] = useState('');
  const [cantidadEntregables, setCantidadEntregables] = useState('');
  
  const [descripcion, setDescripcion] = useState('');

  // Obtener cliente del localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setClienteId(usuario.id);
    }
  }, []);

  const handleContratar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion) {
      alert('Por favor, ingrese una descripción');
      return;
    }

    let parametrosServicio = {};

    // Validar y preparar parámetros según tipo de servicio
    if (tipoServicio === TipoServicioEnum.POR_HORAS) {
      if (!tarifaPorHora || !horasEstimadas) {
        alert('Complete tarifa y horas');
        return;
      }
      parametrosServicio = {
        tarifaPorHora: parseFloat(tarifaPorHora),
        horasEstimadas: parseFloat(horasEstimadas),
      };
    } else if (tipoServicio === TipoServicioEnum.POR_TAREA) {
      if (!montoBase) {
        alert('Complete el monto base');
        return;
      }
      parametrosServicio = {
        montoBase: parseFloat(montoBase),
        complejidad,
      };
    } else if (tipoServicio === TipoServicioEnum.POR_PAQUETE) {
      if (!montoPorEntregable || !cantidadEntregables) {
        alert('Complete monto por entregable y cantidad');
        return;
      }
      parametrosServicio = {
        montoPorEntregable: parseFloat(montoPorEntregable),
        cantidadEntregables: parseInt(cantidadEntregables),
      };
    }

    const datos: DatosContratacion = {
      clienteId,
      tipoServicio,
      descripcion,
      parametrosServicio,
    };

    await contratar(datos);
  };

  return (
    <div className="contratar-page">
      <h1>💼 Contratar Servicio</h1>

      <form onSubmit={handleContratar} className="contratar-form">
        {/* Tipo de Servicio */}
        <section className="form-section">
          <h2>Tipo de Servicio</h2>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value={TipoServicioEnum.POR_HORAS}
                checked={tipoServicio === TipoServicioEnum.POR_HORAS}
                onChange={(e) => {
                  setTipoServicio(e.target.value as TipoServicioEnum);
                  limpiar();
                }}
              />
              Por Horas ⏱️
            </label>
            <label>
              <input
                type="radio"
                value={TipoServicioEnum.POR_TAREA}
                checked={tipoServicio === TipoServicioEnum.POR_TAREA}
                onChange={(e) => {
                  setTipoServicio(e.target.value as TipoServicioEnum);
                  limpiar();
                }}
              />
              Por Tarea ✅
            </label>
            <label>
              <input
                type="radio"
                value={TipoServicioEnum.POR_PAQUETE}
                checked={tipoServicio === TipoServicioEnum.POR_PAQUETE}
                onChange={(e) => {
                  setTipoServicio(e.target.value as TipoServicioEnum);
                  limpiar();
                }}
              />
              Por Paquete 📦
            </label>
          </div>
        </section>

        {/* Descripción General */}
        <section className="form-section">
          <label>
            Descripción del Servicio:
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe lo que necesitas..."
              required
            />
          </label>
        </section>

        {/* Parámetros Por Horas */}
        {tipoServicio === TipoServicioEnum.POR_HORAS && (
          <section className="form-section">
            <h2>Parámetros - Por Horas</h2>
            <label>
              Tarifa por Hora ($):
              <input
                type="number"
                value={tarifaPorHora}
                onChange={(e) => setTarifaPorHora(e.target.value)}
                placeholder="Ej: 50"
                step="0.01"
                required
              />
            </label>
            <label>
              Horas Estimadas:
              <input
                type="number"
                value={horasEstimadas}
                onChange={(e) => setHorasEstimadas(e.target.value)}
                placeholder="Ej: 40"
                step="0.5"
                required
              />
            </label>
            <p className="preview">
              💰 Presupuesto estimado: ${
                tarifaPorHora && horasEstimadas
                  ? (parseFloat(tarifaPorHora) * parseFloat(horasEstimadas) * 1.1).toFixed(2)
                  : '0.00'
              }
            </p>
          </section>
        )}

        {/* Parámetros Por Tarea */}
        {tipoServicio === TipoServicioEnum.POR_TAREA && (
          <section className="form-section">
            <h2>Parámetros - Por Tarea</h2>
            <label>
              Monto Base ($):
              <input
                type="number"
                value={montoBase}
                onChange={(e) => setMontoBase(e.target.value)}
                placeholder="Ej: 500"
                step="0.01"
                required
              />
            </label>
            <label>
              Complejidad:
              <select
                value={complejidad}
                onChange={(e) => setComplejidad(e.target.value as 'BAJA' | 'MEDIA' | 'ALTA')}
              >
                <option value="BAJA">🟢 Baja (8 horas)</option>
                <option value="MEDIA">🟡 Media (16 horas)</option>
                <option value="ALTA">🔴 Alta (40 horas)</option>
              </select>
            </label>
            <p className="preview">
              ⏱️ Duración estimada: {complejidad === 'BAJA' ? 8 : complejidad === 'MEDIA' ? 16 : 40} horas
            </p>
          </section>
        )}

        {/* Parámetros Por Paquete */}
        {tipoServicio === TipoServicioEnum.POR_PAQUETE && (
          <section className="form-section">
            <h2>Parámetros - Por Paquete</h2>
            <label>
              Monto por Entregable ($):
              <input
                type="number"
                value={montoPorEntregable}
                onChange={(e) => setMontoPorEntregable(e.target.value)}
                placeholder="Ej: 100"
                step="0.01"
                required
              />
            </label>
            <label>
              Cantidad de Entregables:
              <input
                type="number"
                value={cantidadEntregables}
                onChange={(e) => setCantidadEntregables(e.target.value)}
                placeholder="Ej: 10"
                required
              />
            </label>
            <p className="preview">
              💰 Total del paquete: ${
                montoPorEntregable && cantidadEntregables
                  ? (parseFloat(montoPorEntregable) * parseInt(cantidadEntregables)).toFixed(2)
                  : '0.00'
              }
            </p>
          </section>
        )}

        {/* Mensajes */}
        {error && <div className="message error">❌ Error: {error}</div>}
        {exito && resultado && (
          <div className="message success">
            <h3>✅ Servicio Contratado Exitosamente</h3>
            <p>Orden: <strong>{resultado.ordenId}</strong></p>
            <p>Monto final: <strong>${resultado.montoFinal.toFixed(2)}</strong></p>
            <p>Duración: <strong>{resultado.duracionEstimada} horas</strong></p>
            <div className="pasos">
              <h4>Pasos ejecutados:</h4>
              <ul>
                {resultado.pasosSeguidos.map((paso, i) => (
                  <li key={i}>{paso}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="btn-contratar"
        >
          {cargando ? '⏳ Procesando...' : '🚀 Contratar Servicio'}
        </button>
      </form>
    </div>
  );
}

export default ContratarPage;
