import { useState, useEffect, useCallback } from 'react';
import { useObraData } from './hooks/useObraData';
import { Dashboard } from './components/Dashboard';
import { Etapas } from './components/Etapas';
import { NotasFiscais } from './components/NotasFiscais';
import { CNO } from './components/CNO';
import { Modal } from './components/Modal';
import { ModalEditarPCI } from './components/ModalEditarPCI';
import { OBRA_INFO as dadosIniciais, getPCIItens, savePCIValor } from './data/pci';

const ABAS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'etapas',    label: '🏗️ Por Etapa'  },
  { id: 'nf',        label: '🧾 Notas Fiscais' },
  { id: 'cno',       label: '📋 CNO' },
];

export default function App() {
  const { itens, addItem, updateItem, deleteItem, totEtapa, totGeral } = useObraData();

  // PCI com valores editáveis
  const [pciItens, setPciItens] = useState(() => getPCIItens());
  const totalPCI = pciItens.reduce((s, e) => s + e.pci, 0);

  const atualizarPCI = useCallback((id, novoValor) => {
    savePCIValor(id, novoValor);
    setPciItens(prev => prev.map(e => e.id === id ? { ...e, pci: novoValor } : e));
  }, []);

  // Dados da obra editáveis
  const [obraInfo, setObraInfo] = useState(() => {
    try {
      const s = localStorage.getItem('obra_pci_info');
      return s ? JSON.parse(s) : dadosIniciais;
    } catch { return dadosIniciais; }
  });

  useEffect(() => {
    localStorage.setItem('obra_pci_info', JSON.stringify(obraInfo));
  }, [obraInfo]);

  function handleObraChange(e) {
    const { name, value } = e.target;
    setObraInfo(prev => ({ ...prev, [name]: value }));
  }

  const [abaAtiva, setAbaAtiva]             = useState('dashboard');
  const [modalAberto, setModalAberto]       = useState(false);
  const [modalObraAberta, setModalObraAberta] = useState(false);
  const [etapaEditPCI, setEtapaEditPCI]     = useState(null);
  const [itemEditar, setItemEditar]         = useState(null);
  const [etapaPreSel, setEtapaPreSel]       = useState(1);

  function abrirNovo(etapaId) {
    setItemEditar(null);
    setEtapaPreSel(etapaId || 1);
    setModalAberto(true);
  }

  function abrirEditar(item) {
    setItemEditar(item);
    setModalAberto(true);
  }

  function handleSalvar(dados) {
    if (itemEditar) updateItem(itemEditar.id, dados);
    else addItem({ ...dados, etapaId: dados.etapaId || etapaPreSel });
    setModalAberto(false);
    setItemEditar(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{
        background: '#1e1e1e', borderBottom: '1px solid #2a2a2a',
        padding: '10px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>
              Obra<span style={{ color: '#185FA5' }}>PCI</span>
            </div>
            <div style={{ fontSize: 10, color: '#666' }}>
              {obraInfo.cidade} — {obraInfo.proprietario}
            </div>
          </div>
          <button onClick={() => setModalObraAberta(true)} style={{
            background: '#2a2a2a', border: '1px solid #444', borderRadius: 6,
            padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#fff'
          }}>
            ⚙️ Editar Obra
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ABAS.map(aba => (
            <button key={aba.id} onClick={() => setAbaAtiva(aba.id)} style={{
              padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: abaAtiva === aba.id ? 500 : 400,
              background: abaAtiva === aba.id ? '#185FA5' : '#2a2a2a',
              color: abaAtiva === aba.id ? '#fff' : '#aaa',
            }}>
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      {abaAtiva === 'dashboard' && (
        <Dashboard itens={itens} pciItens={pciItens} totalPCI={totalPCI}
          obraInfo={obraInfo} totEtapa={totEtapa} totGeral={totGeral}
          onNovoLancamento={() => abrirNovo(null)} onEditarPCI={setEtapaEditPCI} />
      )}
      {abaAtiva === 'etapas' && (
        <Etapas itens={itens} pciItens={pciItens} totEtapa={totEtapa}
          onNovo={abrirNovo} onEditar={abrirEditar} onDeletar={deleteItem}
          onEditarPCI={setEtapaEditPCI} />
      )}
      {abaAtiva === 'nf' && <NotasFiscais itens={itens} onEditar={abrirEditar} />}
      {abaAtiva === 'cno' && <CNO itens={itens} pciItens={pciItens} />}

      {/* Modal lançamento */}
      <Modal aberto={modalAberto}
        onFechar={() => { setModalAberto(false); setItemEditar(null); }}
        onSalvar={handleSalvar} itemEditar={itemEditar} etapaPreSel={etapaPreSel} />

      {/* Modal editar valor PCI */}
      <ModalEditarPCI etapa={etapaEditPCI}
        onFechar={() => setEtapaEditPCI(null)} onSalvar={atualizarPCI} />

      {/* Modal editar obra */}
      {modalObraAberta && (
        <div onClick={() => setModalObraAberta(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1e1e1e', padding: 24, borderRadius: 12,
            width: '100%', maxWidth: 500, border: '1px solid #333'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 15 }}>⚙️ Informações da Obra</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'proprietario', label: 'Proprietário' },
                { key: 'cpf',         label: 'CPF' },
                { key: 'endereco',    label: 'Endereço' },
                { key: 'cidade',      label: 'Cidade/UF' },
                { key: 'cep',         label: 'CEP' },
                { key: 'matricula',   label: 'Matrícula' },
                { key: 'rt',          label: 'Responsável Técnico' },
                { key: 'crea',        label: 'CREA/CAU' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input name={key} value={obraInfo[key] || ''} onChange={handleObraChange}
                    style={{ width: '100%', background: '#2a2a2a', border: '1px solid #444', color: '#fff', padding: '8px 12px', borderRadius: 6, fontSize: 13 }} />
                </div>
              ))}
            </div>
            <button onClick={() => setModalObraAberta(false)} style={{
              width: '100%', marginTop: 20, padding: 12, borderRadius: 8,
              background: '#185FA5', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600
            }}>✅ Salvar e Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
