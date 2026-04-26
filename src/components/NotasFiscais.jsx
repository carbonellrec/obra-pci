import { useState } from 'react';
import { PCI_ITENS } from '../data/pci';
import { fmtMoeda, fmtData } from '../utils/format';

export function NotasFiscais({ itens, onEditar }) {
  const [visualizar, setVisualizar] = useState(null);

  const comFoto = itens.filter(i => i.img);
  const semFoto = itens.filter(i => !i.img);
  const totalComDoc = comFoto.reduce((s, i) => s + i.valor, 0);

  const sorted = [...itens].sort((a, b) =>
    (b.data || '').localeCompare(a.data || '')
  );

  return (
    <div style={{ padding: 16 }}>

      {/* Cards resumo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 8, marginBottom: 14
      }}>
        <Card label="Com foto de NF" valor={comFoto.length} cor="#639922" />
        <Card label="Sem foto" valor={semFoto.length} cor="#EF9F27" />
        <Card label="Total lançamentos" valor={itens.length} cor="#aaa" />
        <Card label="Valor documentado" valor={fmtMoeda(totalComDoc)} cor="#4A9EE0" />
      </div>

      {/* Tabela */}
      <div style={{ background: '#1e1e1e', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #2a2a2a' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>
            Todos os lançamentos
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#2a2a2a' }}>
                <th style={th}>Data</th>
                <th style={th}>Descrição</th>
                <th style={th}>Etapa</th>
                <th style={th}>NF nº</th>
                <th style={{ ...th, textAlign: 'center' }}>Foto NF</th>
                <th style={{ ...th, textAlign: 'right' }}>Valor</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(i => {
                const e = PCI_ITENS.find(p => p.id === i.etapaId);
                return (
                  <tr key={i.id} style={{ borderTop: '1px solid #2a2a2a' }}>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmtData(i.data)}</td>
                    <td style={td}>{i.desc}</td>
                    <td style={{ ...td, color: '#aaa', fontSize: 11 }}>
                      {e ? `${e.id}. ${e.nome.substring(0, 22)}…` : '—'}
                    </td>
                    <td style={{ ...td, color: '#aaa' }}>{i.nfnum || '—'}</td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      {i.img ? (
                        <img
                          src={i.img} alt="NF"
                          onClick={() => setVisualizar(i.img)}
                          style={{
                            width: 36, height: 36, objectFit: 'cover',
                            borderRadius: 6, cursor: 'pointer',
                            border: '1px solid #444'
                          }}
                        />
                      ) : (
                        <button
                          onClick={() => onEditar(i)}
                          style={{
                            fontSize: 10, padding: '2px 8px',
                            border: '1px dashed #555', borderRadius: 6,
                            background: 'none', color: '#aaa', cursor: 'pointer'
                          }}
                        >
                          + foto
                        </button>
                      )}
                    </td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 500 }}>
                      {fmtMoeda(i.valor)}
                    </td>
                    <td style={td}>
                      <button onClick={() => onEditar(i)} style={btnAcao}>✎</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualizador de imagem em tela cheia */}
      {visualizar && (
        <div
          onClick={() => setVisualizar(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, cursor: 'zoom-out'
          }}
        >
          <img
            src={visualizar} alt="NF"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 10 }}
          />
          <button
            onClick={() => setVisualizar(null)}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: '#333', border: 'none', color: '#fff',
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 14
            }}
          >
            ✕ Fechar
          </button>
        </div>
      )}
    </div>
  );
}

function Card({ label, valor, cor }) {
  return (
    <div style={{ background: '#1e1e1e', borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: '#aaa', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 500, color: cor }}>{valor}</div>
    </div>
  );
}

const th = { padding: '7px 12px', textAlign: 'left', color: '#aaa', fontWeight: 500, whiteSpace: 'nowrap' };
const td = { padding: '7px 12px', color: '#ddd' };
const btnAcao = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#aaa', fontSize: 13, padding: '2px 6px', borderRadius: 4
};
