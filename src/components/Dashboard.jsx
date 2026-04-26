import { fmtMoeda, fmtPct } from '../utils/format';

export function Dashboard({ itens, pciItens, totalPCI, obraInfo, totEtapa, totGeral, onNovoLancamento, onEditarPCI }) {
  const total = totGeral();
  const diff  = total - totalPCI;
  const pct   = totalPCI > 0 ? (total / totalPCI) * 100 : 0;
  const etapasCom = pciItens.filter(e => totEtapa(e.id) > 0).length;
  const comFoto   = itens.filter(i => i.img).length;

  return (
    <div style={{ padding: 16 }}>

      {/* Cabeçalho obra */}
      <div style={{
        background: '#1e1e1e', borderRadius: 12, padding: 14,
        marginBottom: 14, borderLeft: '4px solid #185FA5'
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
          {obraInfo.proprietario}
        </div>
        <div style={{ fontSize: 11, color: '#aaa' }}>
          {obraInfo.endereco} — {obraInfo.cidade}
        </div>
        <div style={{ fontSize: 11, color: '#aaa' }}>
          RT: {obraInfo.rt} — {obraInfo.crea}
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 8, marginBottom: 14
      }}>
        <Card label="Total PCI Caixa"  valor={fmtMoeda(totalPCI)} cor="#aaa" />
        <Card label="Total gasto"      valor={fmtMoeda(total)}    cor="#fff" />
        <Card label="Diferença"
          valor={(diff >= 0 ? '+' : '') + fmtMoeda(diff)}
          cor={diff > 2000 ? '#e24b4a' : diff < -5000 ? '#639922' : '#EF9F27'}
        />
        <Card label="% executado"      valor={fmtPct(pct)}         cor="#4A9EE0" />
        <Card label="Etapas iniciadas" valor={`${etapasCom} / 20`} cor="#aaa" />
        <Card label="NFs anexadas"     valor={`${comFoto} / ${itens.length}`} cor="#aaa" />
      </div>

      {/* Botão novo */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button onClick={onNovoLancamento} style={{
          padding: '8px 16px', background: '#185FA5', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500
        }}>
          + Novo lançamento
        </button>
      </div>

      {/* Tabela */}
      <div style={{ background: '#1e1e1e', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #2a2a2a' }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Resumo por etapa PCI</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#2a2a2a' }}>
                <th style={th}>#</th>
                <th style={th}>Serviço</th>
                <th style={{ ...th, textAlign: 'right' }}>PCI Caixa</th>
                <th style={{ ...th, textAlign: 'right' }}>Gasto</th>
                <th style={{ ...th, textAlign: 'right' }}>Diferença</th>
                <th style={{ ...th, minWidth: 90 }}>Progresso</th>
              </tr>
            </thead>
            <tbody>
              {pciItens.map(e => {
                const g = totEtapa(e.id);
                const d = g - e.pci;
                const p = e.pci > 0 ? Math.min(100, (g / e.pci) * 100) : 0;
                const cor = d > 500 ? '#e24b4a' : d < -500 ? '#639922' : '#EF9F27';
                return (
                  <tr key={e.id} style={{ borderTop: '1px solid #2a2a2a' }}>
                    <td style={td}>{e.id}</td>
                    <td style={td}>{e.nome}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        {e.pci > 0 ? fmtMoeda(e.pci) : '—'}
                        <button
                          onClick={() => onEditarPCI(e)}
                          title={`Editar valor PCI — Item ${e.id}`}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#555', fontSize: 13, padding: '2px 4px',
                            borderRadius: 4, transition: 'color 0.15s'
                          }}
                          onMouseEnter={ev => ev.currentTarget.style.color = '#4A9EE0'}
                          onMouseLeave={ev => ev.currentTarget.style.color = '#555'}
                        >
                          ⚙️
                        </button>
                      </div>
                    </td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 500 }}>
                      {g > 0 ? fmtMoeda(g) : '—'}
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <span style={{
                        fontSize: 11, padding: '2px 7px', borderRadius: 10,
                        background: cor + '22', color: cor, fontWeight: 500
                      }}>
                        {d >= 0 ? '+' : ''}{fmtMoeda(d)}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ background: '#333', borderRadius: 3, height: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${p.toFixed(1)}%`, height: '100%', background: cor, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 10, color: '#aaa' }}>{p.toFixed(0)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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

const th = { padding: '8px 12px', textAlign: 'left', color: '#aaa', fontWeight: 500, whiteSpace: 'nowrap' };
const td = { padding: '8px 12px', color: '#ddd' };