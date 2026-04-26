import { useState } from 'react';
import { fmtMoeda, fmtData } from '../utils/format';

export function Etapas({ itens, pciItens, totEtapa, onNovo, onEditar, onDeletar, onEditarPCI }) {
  const [abertos, setAbertos] = useState({});

  function toggle(id) {
    setAbertos(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div style={{ padding: 16 }}>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button onClick={() => onNovo(null)} style={{
          padding: '8px 16px', background: '#185FA5', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500
        }}>
          + Novo lançamento
        </button>
      </div>

      {pciItens.map(e => {
        const g = totEtapa(e.id);
        const d = g - e.pci;
        const p = e.pci > 0 ? Math.min(100, (g / e.pci) * 100) : 0;
        const cor = d > 500 ? '#e24b4a' : d < -500 ? '#639922' : '#EF9F27';
        const aberto = abertos[e.id];
        const ei = itens.filter(i => i.etapaId === e.id);

        return (
          <div key={e.id} style={{
            background: '#1e1e1e', borderRadius: 12,
            marginBottom: 8, overflow: 'hidden'
          }}>
            {/* Cabeçalho */}
            <div onClick={() => toggle(e.id)} style={{
              padding: '10px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 8,
              borderBottom: aberto ? '1px solid #2a2a2a' : 'none'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', marginBottom: 4 }}>
                  Item {e.id} — {e.nome}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, background: '#333', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${p.toFixed(1)}%`, height: '100%', background: cor, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 10, color: '#aaa', whiteSpace: 'nowrap' }}>{p.toFixed(0)}%</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                <Badge label={`PCI ${e.pci > 0 ? fmtMoeda(e.pci) : 'livre'}`} bg="#1a3a5c" cor="#4A9EE0" />
                <Badge label={fmtMoeda(g)} bg="#1a3a1a" cor="#639922" />
                <Badge
                  label={(d >= 0 ? '+' : '') + fmtMoeda(d)}
                  bg={d > 500 ? '#3a1a1a' : d < -500 ? '#1a3a1a' : '#3a2a0a'}
                  cor={d > 500 ? '#e24b4a' : d < -500 ? '#639922' : '#EF9F27'}
                />
                {/* Engrenagem editar PCI */}
                <button
                  onClick={ev => { ev.stopPropagation(); onEditarPCI(e); }}
                  title={`Editar valor PCI — Item ${e.id}`}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#555', fontSize: 14, padding: '2px 4px', borderRadius: 4
                  }}
                  onMouseEnter={ev => ev.currentTarget.style.color = '#4A9EE0'}
                  onMouseLeave={ev => ev.currentTarget.style.color = '#555'}
                >
                  ⚙️
                </button>
                <span style={{ color: '#aaa', fontSize: 16 }}>{aberto ? '▾' : '›'}</span>
              </div>
            </div>

            {/* Conteúdo expandido */}
            {aberto && (
              <div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#2a2a2a' }}>
                        <th style={th}>Data</th>
                        <th style={th}>Descrição</th>
                        <th style={th}>Fornecedor</th>
                        <th style={th}>NF</th>
                        <th style={{ ...th, textAlign: 'center' }}>Foto</th>
                        <th style={{ ...th, textAlign: 'right' }}>Valor</th>
                        <th style={th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ei.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: 14, textAlign: 'center', color: '#666', fontSize: 12 }}>
                            Nenhum lançamento nesta etapa
                          </td>
                        </tr>
                      ) : (
                        ei.map(i => (
                          <tr key={i.id} style={{ borderTop: '1px solid #2a2a2a' }}>
                            <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmtData(i.data)}</td>
                            <td style={td}>{i.desc}</td>
                            <td style={{ ...td, color: '#aaa' }}>{i.forn || '—'}</td>
                            <td style={{ ...td, color: '#aaa' }}>{i.nfnum || '—'}</td>
                            <td style={{ ...td, textAlign: 'center' }}>
                              {i.img
                                ? <img src={i.img} alt="NF"
                                    style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: '1px solid #444' }}
                                    onClick={() => window.open(i.img)}
                                  />
                                : <span style={{ fontSize: 10, color: '#555' }}>sem foto</span>
                              }
                            </td>
                            <td style={{ ...td, textAlign: 'right', fontWeight: 500 }}>{fmtMoeda(i.valor)}</td>
                            <td style={{ ...td, whiteSpace: 'nowrap' }}>
                              <button onClick={() => onEditar(i)} style={btnAcao}>✎</button>
                              <button onClick={() => { if (window.confirm('Excluir?')) onDeletar(i.id); }} style={btnAcao}>✕</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <button onClick={() => onNovo(e.id)} style={{
                  width: '100%', padding: '8px 14px', background: 'transparent',
                  border: 'none', borderTop: '1px solid #2a2a2a',
                  color: '#aaa', cursor: 'pointer', textAlign: 'left', fontSize: 12
                }}>
                  + Adicionar lançamento nesta etapa
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Badge({ label, bg, cor }) {
  return (
    <span style={{
      fontSize: 10, padding: '2px 7px', borderRadius: 10,
      background: bg, color: cor, fontWeight: 500, whiteSpace: 'nowrap'
    }}>
      {label}
    </span>
  );
}

const th = { padding: '7px 12px', textAlign: 'left', color: '#aaa', fontWeight: 500, whiteSpace: 'nowrap' };
const td = { padding: '7px 12px', color: '#ddd' };
const btnAcao = { background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 13, padding: '2px 6px', borderRadius: 4 };