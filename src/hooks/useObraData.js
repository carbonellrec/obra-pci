
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'obra-pci-lancamentos';

const initialData = [
  { id: 1001, etapaId: 1, data: '2025-07-19', desc: 'Barracão+lig. provisórias', forn: '', valor: 2902.16, nfnum: '', obs: '', img: null },
  { id: 1002, etapaId: 1, data: '2025-07-19', desc: 'Alvará de construção', forn: 'Prefeitura Pinhais', valor: 336.28, nfnum: '', obs: '', img: null },
  { id: 1003, etapaId: 1, data: '2026-04-24', desc: 'Engenharia caixa vistoria', forn: 'Alysson Vasconcelos', valor: 750.00, nfnum: '', obs: '', img: null },
  { id: 1004, etapaId: 1, data: '2025-10-07', desc: 'Engenheiro projeto', forn: 'Alysson Vasconcelos', valor: 5000.00, nfnum: '', obs: '', img: null },
  { id: 1005, etapaId: 1, data: '2025-10-06', desc: 'Engenheiro planilha PCI', forn: 'Alysson Vasconcelos', valor: 1275.18, nfnum: '', obs: '', img: null },
  { id: 1006, etapaId: 1, data: '2025-10-08', desc: 'Registro de imóveis matrícula 34550', forn: 'Cartório Pinhais', valor: 62.79, nfnum: '', obs: '', img: null },
  { id: 1007, etapaId: 2, data: '2026-01-10', desc: 'Infraestrutura (estacas/brocas/baldrames/sapatas)', forn: '', valor: 17171.11, nfnum: '', obs: '', img: null },
  { id: 1008, etapaId: 3, data: '2026-02-05', desc: 'Superestrutura (vigas/pilares/cintas/escadas)', forn: '', valor: 42565.01, nfnum: '', obs: '', img: null },
];

export function useObraData() {
  const [itens, setItens] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialData;
    } catch {
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens]);

  function addItem(item) {
    setItens(prev => [...prev, { ...item, id: Date.now() }]);
  }

  function updateItem(id, data) {
    setItens(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  }

  function deleteItem(id) {
    setItens(prev => prev.filter(i => i.id !== id));
  }

  function totEtapa(etapaId) {
    return itens.filter(i => i.etapaId === etapaId).reduce((s, i) => s + (+i.valor || 0), 0);
  }

  function totGeral() {
    return itens.reduce((s, i) => s + (+i.valor || 0), 0);
  }

  return { itens, addItem, updateItem, deleteItem, totEtapa, totGeral };
}