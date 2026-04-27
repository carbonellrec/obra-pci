import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fmtMoeda, fmtData } from '../utils/format';

export function ModalPDF({ aberto, onFechar, itens, pciItens, obraInfo, totalPCI }) {
  const [selecionadas, setSelecionadas] = useState(() =>
    pciItens.reduce((acc, e) => ({ ...acc, [e.id]: true }), {})
  );
  const [gerando, setGerando] = useState(false);

  function toggleEtapa(id) {
    setSelecionadas(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleTodos(val) {
    setSelecionadas(pciItens.reduce((acc, e) => ({ ...acc, [e.id]: val }), {}));
  }

  function gerarPDF() {
    setGerando(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = doc.internal.pageSize.getWidth();
      let y = 15;

      // ── Cabeçalho ──
      doc.setFillColor(24, 95, 165);
      doc.rect(0, 0, W, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTROLE DE OBRA — PCI CAIXA', W / 2, 12, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, W / 2, 20, { align: 'center' });
      y = 35;

      // ── Dados da obra ──
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(240, 245, 255);
      doc.rect(10, y, W - 20, 30, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('IDENTIFICAÇÃO DA OBRA', 14, y + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Proprietário: ${obraInfo.proprietario}   CPF: ${obraInfo.cpf}`, 14, y + 14);
      doc.text(`Endereço: ${obraInfo.endereco} — ${obraInfo.cidade}   CEP: ${obraInfo.cep || ''}`, 14, y + 20);
      doc.text(`RT: ${obraInfo.rt}   ${obraInfo.crea}   Matrícula: ${obraInfo.matricula || ''}`, 14, y + 26);
      y += 38;

      // ── Resumo financeiro ──
      const totalGasto = itens.reduce((s, i) => s + (+i.valor || 0), 0);
      const diff = totalGasto - totalPCI;
      const pct = totalPCI > 0 ? (totalGasto / totalPCI * 100).toFixed(1) : 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('RESUMO FINANCEIRO', 14, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        margin: { left: 10, right: 10 },
        head: [['Total PCI Caixa', 'Total Gasto', 'Diferença', '% Executado']],
        body: [[
          fmtMoeda(totalPCI),
          fmtMoeda(totalGasto),
          (diff >= 0 ? '+' : '') + fmtMoeda(diff),
          pct + '%'
        ]],
        headStyles: { fillColor: [24, 95, 165], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: {
          2: { textColor: diff > 0 ? [220, 50, 50] : [60, 140, 60] }
        }
      });
      y = doc.lastAutoTable.finalY + 8;

      // ── Tabela por etapa ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('RESUMO POR ETAPA', 14, y);
      y += 5;

      const etapasRows = pciItens
        .filter(e => selecionadas[e.id])
        .map(e => {
          const g = itens.filter(i => i.etapaId === e.id).reduce((s, i) => s + (+i.valor || 0), 0);
          const d = g - e.pci;
          const p = e.pci > 0 ? Math.min(100, (g / e.pci) * 100).toFixed(0) : 0;
          return [
            e.id,
            e.nome,
            e.pci > 0 ? fmtMoeda(e.pci) : '—',
            g > 0 ? fmtMoeda(g) : '—',
            (d >= 0 ? '+' : '') + fmtMoeda(d),
            p + '%'
          ];
        });

      autoTable(doc, {
        startY: y,
        margin: { left: 10, right: 10 },
        head: [['#', 'Serviço', 'PCI Caixa', 'Gasto', 'Diferença', '%']],
        body: etapasRows,
        headStyles: { fillColor: [24, 95, 165], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        columnStyles: { 0: { cellWidth: 8 }, 5: { cellWidth: 12 } },
        didParseCell: (data) => {
          if (data.column.index === 4 && data.section === 'body') {
            const val = data.cell.raw;
            if (val && val.startsWith('+')) data.cell.styles.textColor = [220, 50, 50];
            else data.cell.styles.textColor = [60, 140, 60];
          }
        }
      });
      y = doc.lastAutoTable.finalY + 8;

      // ── Lançamentos por etapa ──
      const etapasSel = pciItens.filter(e => selecionadas[e.id]);

      etapasSel.forEach(e => {
        const ei = itens.filter(i => i.etapaId === e.id);
        if (!ei.length) return;

        if (y > 240) { doc.addPage(); y = 15; }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(24, 95, 165);
        doc.text(`Item ${e.id} — ${e.nome}`, 14, y);
        doc.setTextColor(0, 0, 0);
        y += 4;

        autoTable(doc, {
          startY: y,
          margin: { left: 10, right: 10 },
          head: [['Data', 'Descrição', 'Fornecedor', 'NF', 'Valor']],
          body: ei.map(i => [
            fmtData(i.data),
            i.desc,
            i.forn || '—',
            i.nfnum || '—',
            fmtMoeda(i.valor)
          ]),
          headStyles: { fillColor: [50, 50, 80], fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          foot: [[
            '', '', '', 'TOTAL',
            fmtMoeda(ei.reduce((s, i) => s + (+i.valor || 0), 0))
          ]],
          footStyles: { fillColor: [230, 230, 240], fontStyle: 'bold', fontSize: 8 },
        });
        y = doc.lastAutoTable.finalY + 6;
      });

      // ── Rodapé ──
      const pages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`ObraPCI — ${obraInfo.proprietario} — Página ${i} de ${pages}`, W / 2, 290, { align: 'center' });
      }

      doc.save(`relatorio-obra-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      alert('Erro ao gerar PDF: ' + e.message);
    }
    setGerando(false);
    onFechar();
  }

  if (!aberto) return null;

  const todasMarcadas = pciItens.every(e => selecionadas[e.id]);

  return (
    <div onClick={onFechar} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#1e1e1e', borderRadius: 12, padding: 24,
        width: 480, maxWidth: '95vw', maxHeight: '85vh',
        overflowY: 'auto', color: '#fff', border: '1px solid #2a2a2a'
      }}>
        <h3 style={{ fontSize: 15, marginBottom: 6 }}>📄 Gerar Relatório PDF</h3>
        <p style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>
          Selecione as etapas que deseja incluir no relatório
        </p>

        {/* Selecionar todos */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 12,
          paddingBottom: 10, borderBottom: '1px solid #2a2a2a'
        }}>
          <button onClick={() => toggleTodos(true)} style={{
            padding: '4px 12px', borderRadius: 6, border: '1px solid #444',
            background: todasMarcadas ? '#185FA5' : '#2a2a2a',
            color: '#fff', cursor: 'pointer', fontSize: 12
          }}>✅ Selecionar todos</button>
          <button onClick={() => toggleTodos(false)} style={{
            padding: '4px 12px', borderRadius: 6, border: '1px solid #444',
            background: '#2a2a2a', color: '#aaa', cursor: 'pointer', fontSize: 12
          }}>☐ Limpar seleção</button>
        </div>

        {/* Lista de etapas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
          {pciItens.map(e => {
            const g = itens.filter(i => i.etapaId === e.id).reduce((s, i) => s + (+i.valor || 0), 0);
            const qtd = itens.filter(i => i.etapaId === e.id).length;
            return (
              <label key={e.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                background: selecionadas[e.id] ? '#1a2a3a' : '#2a2a2a',
                border: `1px solid ${selecionadas[e.id] ? '#185FA5' : '#333'}`
              }}>
                <input
                  type="checkbox" checked={selecionadas[e.id] || false}
                  onChange={() => toggleEtapa(e.id)}
                  style={{ accentColor: '#185FA5', width: 15, height: 15 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#fff' }}>
                    <span style={{ color: '#185FA5', fontWeight: 600 }}>{e.id}.</span> {e.nome}
                  </div>
                  <div style={{ fontSize: 10, color: '#aaa' }}>
                    {qtd} lançamento(s) — {g > 0 ? fmtMoeda(g) : 'sem gastos'}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onFechar} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #555',
            background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: 13
          }}>Cancelar</button>
          <button onClick={gerarPDF} disabled={gerando} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none',
            background: gerando ? '#333' : '#185FA5',
            color: '#fff', cursor: gerando ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 500
          }}>
            {gerando ? '⏳ Gerando...' : '📄 Gerar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
