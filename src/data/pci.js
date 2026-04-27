export const PCI_ITENS = [
  { id: 1,  nome: "Barracão+lig. provisórias+projetos/aprovs.", inc: 1.20, pci: 2902.16,  min: 1.13, max: 0 },
  { id: 2,  nome: "Infraestrutura (estacas, brocas, baldrames, sapatas)", inc: 7.10, pci: 17171.11, min: 3.07, max: 7.43 },
  { id: 3,  nome: "Superestrutura (vigas, pilares, cintas, escadas)", inc: 17.60, pci: 42565.01, min: 12.17, max: 17.67 },
  { id: 4,  nome: "Paredes e painéis", inc: 9.40, pci: 22733.59, min: 4.80, max: 10.67 },
  { id: 5,  nome: "Esquadrias", inc: 7.40, pci: 17896.65, min: 4.16, max: 13.27 },
  { id: 6,  nome: "Vidros e plásticos", inc: 2.00, pci: 4836.93,  min: 0, max: 2.45 },
  { id: 7,  nome: "Coberturas (estrutura e telhas)", inc: 7.50, pci: 18138.50, min: 0, max: 12.94 },
  { id: 8,  nome: "Impermeabilizações", inc: 0.60, pci: 1451.08,  min: 0, max: 10.10 },
  { id: 9,  nome: "Revestimentos internos", inc: 7.40, pci: 17896.65, min: 6.81, max: 9.32 },
  { id: 10, nome: "Forros", inc: 1.10, pci: 2660.31,  min: 0, max: 2.18 },
  { id: 11, nome: "Revestimentos externos", inc: 4.30, pci: 10399.41, min: 3.87, max: 5.30 },
  { id: 12, nome: "Pinturas", inc: 6.40, pci: 15478.19, min: 3.63, max: 6.47 },
  { id: 13, nome: "Pisos", inc: 9.40, pci: 22733.59, min: 8.41, max: 11.51 },
  { id: 14, nome: "Acabamentos (soleiras, rodapés, peitoril etc.)", inc: 1.20, pci: 2902.16,  min: 1.01, max: 1.38 },
  { id: 15, nome: "Instalações elétricas e telefônicas", inc: 4.80, pci: 11608.64, min: 3.75, max: 4.85 },
  { id: 16, nome: "Instalações hidráulicas", inc: 4.20, pci: 10157.56, min: 3.63, max: 4.27 },
  { id: 17, nome: "Instalações: esgoto e águas pluviais", inc: 3.80, pci: 9190.17,  min: 3.65, max: 4.30 },
  { id: 18, nome: "Louças e metais", inc: 4.20, pci: 10157.56, min: 4.14, max: 4.87 },
  { id: 19, nome: "Complementos (limpeza final e calafete)", inc: 0.40, pci: 967.39,  min: 0.24, max: 0 },
  { id: 20, nome: "Outros (serviços adicionais)", inc: 0, pci: 0, min: 0, max: 0 },
];

export const OBRA_INFO = {
<<<<<<< HEAD
  proprietario: "Fabiano da Silva",
  cpf: "982.xxx.xxx-72",
  endereco: "Rua José de Alencar, 419 - ",
  cidade: "Pinhais/PR",
  cep: "83.321-000",
  matricula: "34xxx",
  rt: "Alysson C.",
  crea: "CREA-PR 176.xxx/D",
=======
  proprietario: "Fabiano C. da Silva",
  cpf: "982.7xx.xxx-02",
  endereco: "Rua José de Alencar, 419 - U 09",
  cidade: "Pinhais/PR",
  cep: "83.321-000",
  matricula: "34550",
  rt: "Alysson C. Vasconcelos",
  crea: "CREA-PR 176.xx1/D",
>>>>>>> 4d6bd29 (feat: add PDF report generator and statistics dashboard)
  totalPCI: 241846.66,
  prazoMeses: 8,
};

// Carrega valores editados do localStorage
export function getPCIItens() {
  try {
    const saved = localStorage.getItem('obra-pci-valores');
    if (saved) {
      const vals = JSON.parse(saved);
      return PCI_ITENS.map(item => ({
        ...item,
        pci: vals[item.id] ?? item.pci,
      }));
    }
  } catch (e) {}
  return [...PCI_ITENS];
}

export function savePCIValor(id, novoValor) {
  try {
    const saved = localStorage.getItem('obra-pci-valores');
    const vals = saved ? JSON.parse(saved) : {};
    vals[id] = novoValor;
    localStorage.setItem('obra-pci-valores', JSON.stringify(vals));
  } catch (e) {}
}
