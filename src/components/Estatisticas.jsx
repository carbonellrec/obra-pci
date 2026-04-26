import { useMemo } from 'react';
import { fmtMoeda, fmtPct } from '../utils/format';

export function Estatisticas({ itens, pciItens, totalPCI }) {

  const stats = useMemo(() => {
    const totalGasto = itens.reduce((s, i) => s + (+i.valor || 0), 0);
    const pctExecutado = totalPCI > 0 ? totalGasto / totalPCI : 0;

    // 1. Projeção de custo final
    // Se gastou X% do PCI e executou X% da obra, projeta o total
    const projecaoFinal = pctExecutado > 0 ? totalGasto / pctExecutado : totalPCI;
    const variacaoProjecao = projecaoFinal - totalPCI;

    // 2. IDC — Índice de Desempenho de Custos
    // IDC = Valor PCI das etapas executadas / Gasto real nessas etapas
    const etapasComGasto = pciItens.filter(e => {
      const g = itens.filter(i => i.etapaId === e.id).reduce((s, i) => s + (+i.valor || 0), 0);
      return g > 0;
    });
    const valorPCIExecutado = etapasComGasto.reduce((s, e) => s + e.pci, 0);
    const idc = totalGasto > 0 ? valorPCIExecutado / totalGasto : 1;

    // 3. Pareto Top 5
    const gastosPorEtapa = pciItens.map(e => {
      const g = itens.filter(i => i.etapaId === e.id).reduce((s, i) => s + (+i.valor || 0), 0);
      return { id: e.id, nome: e.nome, gasto: g, pci: e.pci };
    }).filter(e => e.gasto > 0)
      .sort((a, b) => b.gasto - a.gasto)
      .slice(0, 5);

    // 4. NFs vs Lançamentos
    const comNF = itens.filter(i => i.img || i.nfnum).length;
    const semNF = itens.length - comNF;
    const valorComNF = itens.filter(i => i.img || i.nfnum).reduce((s, i) => s + (+i.valor || 0), 0);
    const pctNF = itens.length > 0 ? (comNF / itens.length) * 100 : 0;

    // 5. Burn-down — gastos por mês
    const gastosPorMes = {};
    itens.forEach(i => {
      if (!i.data) return;
      const mes = i.data.substring(0, 7); // "2026-01"
      gastosPorMes[mes] = (gastosPorMes[mes] || 0) + (+i.valor || 0);
    });
    const meses = Object.entries(gastosPorMes)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6); // últimos 6 meses

    const maxMes = Math.max(...meses.map(m => m[1]), 1);

    return {
      totalGasto, pctExecutado, projecaoFinal, variacaoProjecao,
      idc, gastosPorEtapa, comNF, semNF, valorComNF, pctNF,
      meses, maxMes
    };
  }, [itens, pciItens, totalPCI]);

  const idcCor = stats.idc >= 1 ? '#639922' : stats.idc >= 0.8 ? '#EF9F27' : '#e24b4a';
  const idcLabel = stats.idc >= 1 ? '✅ Dentro do orçamento' : stats.idc >= 0.8 ? '⚠️ Atenção' : '🔴 Acima do orçamento';

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 14 }}>
        📈 Estatísticas da Obra
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>

        {/* 1. Projeção de Custo Final */}
        <div style={card}>
          <div style={cardTitle}>🎯 Projeção de Custo Final</div>
          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 10 }}>
            Estimativa baseada no ritmo atual de gastos
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
            {fmtMoeda(stats.projecaoFinal)}
          </div>
          <div style={{ fontSize: 12, color: stats.variacaoProjecao > 0 ? '#e24b4a' : '#639922' }}>
            {stats.variacaoProjecao >= 0 ? '+' : ''}{fmtMoeda(stats.variacaoProjecao)} em relação ao PCI
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa', marginBottom: 4 }}>
              <span>Executado</span>
              <span>{fmtPct(stats.pctExecutado * 100)}</span>
            </div>
            <div style={{ background: '#333', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, stats.pctExecutado * 100).toFixed(1)}%`,
                height: '100%', background: '#185FA5', borderRadius: 4
              }} />
            </div>
          </div>
        </div>

        {/* 2. IDC */}
        <div style={card}>
          <div style={cardTitle}>📊 Índice de Desempenho de Custos (IDC)</div>
          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 10 }}>
            IDC &gt; 1.0 = abaixo do orçamento &nbsp;|&nbsp; IDC &lt; 1.0 = estouro
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: idcCor, marginBottom: 4 }}>
            {stats.idc.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: idcCor }}>{idcLabel}</div>
          <div style={{ marginTop: 10, fontSize: 11, color: '#aaa' }}>
            <div>PCI das etapas executadas: <strong style={{ color: '#fff' }}>{fmtMoeda(stats.idc * stats.totalGasto)}</strong></div>
            <div>Gasto real: <strong style={{ color: '#fff' }}>{fmtMoeda(stats.totalGasto)}</strong></div>
          </div>
        </div>

        {/* 3. Pareto Top 5 */}
        <div style={card}>
          <div style={cardTitle}>🏆 Top 5 Maiores Gastos (Pareto)</div>
          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 10 }}>
            Etapas que mais impactam o orçamento
          </div>
          {stats.gastosPorEtapa.length === 0 ? (
            <div style={{ color: '#555', fontSize: 12 }}>Nenhum gasto registrado</div>
          ) : (
            stats.gastosPorEtapa.map((e, idx) => {
              const pct = stats.totalGasto > 0 ? (e.gasto / stats.totalGasto) * 100 : 0;
              return (
                <div key={e.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: '#ddd' }}>
                      <span style={{ color: '#185FA5', fontWeight: 600 }}>#{idx + 1}</span>{' '}
                      {e.nome.length > 28 ? e.nome.substring(0, 28) + '…' : e.nome}
                    </span>
                    <span style={{ color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 8 }}>
                      {fmtPct(pct)}
                    </span>
                  </div>
                  <div style={{ background: '#333', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${pct.toFixed(1)}%`, height: '100%', background: '#185FA5', borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{fmtMoeda(e.gasto)}</div>
                </div>
              );
            })
          )}
        </div>

        {/* 4. NFs vs Lançamentos */}
        <div style={card}>
          <div style={cardTitle}>🧾 Notas Fiscais vs Lançamentos</div>
          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 10 }}>
            Percentual de gastos com documentação
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#639922' }}>{stats.comNF}</div>
              <div style={{ fontSize: 10, color: '#aaa' }}>com NF</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#e24b4a' }}>{stats.semNF}</div>
              <div style={{ fontSize: 10, color: '#aaa' }}>sem NF</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#4A9EE0' }}>{stats.pctNF.toFixed(0)}%</div>
              <div style={{ fontSize: 10, color: '#aaa' }}>documentado</div>
            </div>
          </div>
          {/* Barra NF */}
          <div style={{ background: '#333', borderRadius: 4, height: 10, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${stats.pctNF.toFixed(1)}%`, height: '100%', background: '#639922', borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 11, color: '#aaa' }}>
            Valor documentado: <strong style={{ color: '#fff' }}>{fmtMoeda(stats.valorComNF)}</strong>
          </div>
        </div>

        {/* 5. Burn-down por mês */}
        <div style={{ ...card, gridColumn: 'span 2' }}>
          <div style={cardTitle}>🔥 Velocidade de Execução (Burn-down)</div>
          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 12 }}>
            Gastos mensais nos últimos meses
          </div>
          {stats.meses.length === 0 ? (
            <div style={{ color: '#555', fontSize: 12 }}>Nenhum dado por período</div>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
              {stats.meses.map(([mes, valor]) => {
                const altura = Math.max(8, (valor / stats.maxMes) * 90);
                const [ano, m] = mes.split('-');
                const nomeMes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][parseInt(m) - 1];
                return (
                  <div key={mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 9, color: '#aaa' }}>{fmtMoeda(valor).replace('R$','').trim()}</div>
                    <div style={{
                      width: '100%', height: altura, background: '#185FA5',
                      borderRadius: '4px 4px 0 0', minHeight: 8
                    }} />
                    <div style={{ fontSize: 10, color: '#aaa' }}>{nomeMes}/{ano.substring(2)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const card = {
  background: '#1e1e1e', borderRadius: 12, padding: 16,
  border: '1px solid #2a2a2a'
};

const cardTitle = {
  fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 4
};
