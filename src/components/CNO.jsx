import { PCI_ITENS, OBRA_INFO } from '../data/pci';
import { fmtMoeda, fmtData } from '../utils/format';

export function CNO({ itens }) {
  const comDoc = itens.filter(i => i.img || i.nfnum);
  const semDoc = itens.filter(i => !i.img && !i.nfnum);
  const totalComDoc = comDoc.reduce((s, i) => s + i.valor, 0);
  const totalSemDoc = semDoc.reduce((s, i) => s + i.valor, 0);

  return (
    <div style={{ padding: 16 }}>

      {/* Aviso informativo */}
      <div style={{
        background: '#1a2a3a', borderRadius: 12, padding: 14,
        marginBottom: 14, borderLeft: '4px solid #185FA5'
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 6 }}>
          📋 CNO — Cadastro Nacional de Obras
        </div>
        <div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.7 }}>
          Para declarar na Receita Federal acesse:{' '}
          <span style={{ color: '#4A9EE0' }}>e-CAC → Serviços → CNO → Lançar obras</span>
          <br />
          Cada serviço precisa de nota fiscal ou recibo para comprovação.
          <br />
          Itens com NF anexada estão <span style={{ color: '#639922' }}>prontos para declarar</span>.
        </div>
      </div>

      {/* Cards resumo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 8, marginBottom: 14
      }}>
        <Card label="Com documentação" valor={`${comDoc.length} itens`} cor="#639922" />
        <Card label="Sem documentação" valor={`${semDoc.length} itens`} cor="#EF9F27" />
        <Card label="Valor documentado" valor={fmtMoeda(totalComDoc)} cor="#4A9EE0" />
        <Card label="Valor sem doc." valor={fmtMoeda(totalSemDoc)} cor="#EF9F27" />
      </div>

      {/* Tabela por etapa */}
      <div style={{ background: '#1e1e1e', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #2a2a2a' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>
            Resumo por etapa para CNO
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#2a2a2a' }}>
                <th style={th}>#</th>
                <th style={th}>Etapa</th>
                <th style={{ ...th, textAlign: 'right' }}>Valor total</th>
                <th style={{ ...th, textAlign: 'center' }}>Lançamentos</th>
                <th style={{ ...th, textAlign: 'center' }}>Com doc.</th>
                <th style={{ ...th, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {PCI_ITENS.map(e => {
                const ei = itens.filter(i => i.etapaId === e.id);
                if (!ei.length) return null;

                const g = ei.reduce((s, i) => s + i.valor, 0);
                const comD = ei.filter(i => i.img || i.nfnum).length;
                const status = comD === ei.length ? 'ok' : comD > 0 ? 'parcial' : 'sem doc';
                const corStatus = status === 'ok' ? '#639922' : status === 'parcial' ? '#EF9F27' : '#e24b4a';
                const bgStatus = status === 'ok' ? '#1a3a1a' : status === 'parcial' ? '#3a2a0a' : '#3a1a1a';
                const emoji = status === 'ok' ? '✅' : status === 'parcial' ? '⚠️' : '❌';

                return (
                  <tr key={e.id} style={{ borderTop: '1px solid #2a2a2a' }}>
                    <td style={{ ...td, color: '#aaa' }}>{e.id}</td>
                    <td style={td}>{e.nome}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 500 }}>{fmtMoeda(g)}</td>
                    <td style={{ ...td, textAlign: 'center', color: '#aaa' }}>{ei.length}</td>
                    <td style={{ ...td, textAlign: 'center', color: '#aaa' }}>{comD} / {ei.length}</td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 10,
                        background: bgStatus, color: corStatus, fontWeight: 500
                      }}>
                        {emoji} {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista detalhada dos sem documentação */}
      {semDoc.length > 0 && (
        <div style={{ background: '#1e1e1e', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>
              ⚠️ Lançamentos sem documentação
            </span>
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 10,
              background: '#3a2a0a', color: '#EF9F27'
            }}>
              {semDoc.length} itens — {fmtMoeda(totalSemDoc)}
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#2a2a2a' }}>
                  <th style={th}>Data</th>
                  <th style={th}>Descrição</th>
                  <th style={th}>Etapa</th>
                  <th style={{ ...th, textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {semDoc.map(i => {
                  const e = PCI_ITENS.find(p => p.id === i.etapaId);
                  return (
                    <tr key={i.id} style={{ borderTop: '1px solid #2a2a2a' }}>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmtData(i.data)}</td>
                      <td style={td}>{i.desc}</td>
                      <td style={{ ...td, color: '#aaa', fontSize: 11 }}>
                        {e ? `${e.id}. ${e.nome.substring(0, 25)}…` : '—'}
                      </td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 500 }}>
                        {fmtMoeda(i.valor)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ label, valor, cor }) {
  return (
    <div style={{ background: '#1e1e1e', borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: '#aaa', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: cor }}>{valor}</div>
    </div>
  );
}

const th = { padding: '7px 12px', textAlign: 'left', color: '#aaa', fontWeight: 500, whiteSpace: 'nowrap' };
const td = { padding: '7px 12px', color: '#ddd' };
