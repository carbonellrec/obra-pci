import { useState, useEffect } from 'react';

export function ModalEditarPCI({ etapa, onFechar, onSalvar }) {
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (etapa) {
      setValor(etapa.pci > 0 ? etapa.pci.toString() : '');
      setErro('');
    }
  }, [etapa]);

  function handleSalvar() {
    const v = parseFloat(valor);
    if (isNaN(v) || v < 0) {
      setErro('Informe um valor válido');
      return;
    }
    onSalvar(etapa.id, v);
    onFechar();
  }

  if (!etapa) return null;

  return (
    <div onClick={onFechar} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#1e1e1e', borderRadius: 12, padding: 24,
        width: 380, maxWidth: '95vw', color: '#fff'
      }}>
        <h3 style={{ fontSize: 15, marginBottom: 6 }}>✏️ Editar valor PCI</h3>
        <p style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>
          Item {etapa.id} — {etapa.nome}
        </p>

        <div style={{
          background: '#2a2a2a', borderRadius: 8, padding: '10px 12px',
          marginBottom: 14, fontSize: 12
        }}>
          <div style={{ color: '#aaa', marginBottom: 4 }}>Referência Caixa</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Incidência: <strong style={{ color: '#4A9EE0' }}>{etapa.inc}%</strong></span>
            {etapa.min > 0 && <span>Mín: <strong style={{ color: '#639922' }}>{etapa.min}%</strong></span>}
            {etapa.max > 0 && <span>Máx: <strong style={{ color: '#e24b4a' }}>{etapa.max}%</strong></span>}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>
            Novo valor (R$)
          </label>
          <input
            type="number" value={valor}
            onChange={e => { setValor(e.target.value); setErro(''); }}
            min="0" step="0.01" placeholder="0,00" autoFocus
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: erro ? '1px solid #e24b4a' : '1px solid #444',
              background: '#2a2a2a', color: '#fff', fontSize: 15
            }}
          />
          {erro && <span style={{ color: '#e24b4a', fontSize: 11 }}>{erro}</span>}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onFechar} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #555',
            background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: 13
          }}>Cancelar</button>
          <button onClick={handleSalvar} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: '#185FA5', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500
          }}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
