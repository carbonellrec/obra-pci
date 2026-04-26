import { useState, useEffect } from 'react';
import { getPCIItens } from '../data/pci';
import { validarData } from '../utils/format';

const pciItens = getPCIItens();

export function Modal({ aberto, onFechar, onSalvar, itemEditar, etapaPreSel }) {
  const [form, setForm] = useState({
    etapaId: etapaPreSel || 1,
    data: '', desc: '', forn: '', valor: '', nfnum: '', obs: '', img: null,
  });
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (itemEditar) {
      const d = itemEditar.data || '';
      const dataFormatada = d.includes('-')
        ? d.split('-').reverse().join('/')
        : d;
      setForm({ ...itemEditar, data: dataFormatada });
    } else {
      setForm({ etapaId: etapaPreSel || 1, data: '', desc: '', forn: '', valor: '', nfnum: '', obs: '', img: null });
    }
    setErros({});
  }, [itemEditar, aberto, etapaPreSel]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErros(prev => ({ ...prev, [name]: '' }));
  }

  function handleDataChange(e) {
    let val = e.target.value.replace(/\D/g, '').substring(0, 8);
    let fmt = val;
    if (val.length > 4) fmt = val.substring(0,2) + '/' + val.substring(2,4) + '/' + val.substring(4);
    else if (val.length > 2) fmt = val.substring(0,2) + '/' + val.substring(2);
    setForm(prev => ({ ...prev, data: fmt }));
    setErros(prev => ({ ...prev, data: '' }));
  }

  function handleFoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, img: ev.target.result }));
    reader.readAsDataURL(file);
  }

  function validar() {
    const errs = {};
    if (!form.desc.trim()) errs.desc = 'Preencha a descrição';
    if (!form.valor || isNaN(form.valor) || +form.valor <= 0) errs.valor = 'Preencha um valor válido';
    if (!form.data) errs.data = 'Preencha a data';
    else if (!validarData(form.data)) errs.data = 'Preencha uma data válida';
    setErros(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSalvar() {
    if (!validar()) return;
    const partes = form.data.includes('/')
      ? form.data.split('/')
      : [form.data.substring(0,2), form.data.substring(2,4), form.data.substring(4,8)];
    const [dia, mes, ano] = partes;
    onSalvar({ ...form, data: `${ano}-${mes}-${dia}`, valor: +form.valor });
  }

  if (!aberto) return null;

  return (
    <div onClick={onFechar} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#1e1e1e', borderRadius: 12, padding: 24,
        width: 420, maxWidth: '95vw', maxHeight: '90vh',
        overflowY: 'auto', color: '#fff'
      }}>
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>
          {itemEditar ? '✏️ Editar lançamento' : '➕ Novo lançamento'}
        </h3>

        {/* Data */}
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Data</label>
          <input name="data" value={form.data} onChange={handleDataChange}
            placeholder="dd/mm/aaaa"
            style={{ ...inp, border: erros.data ? '1px solid #e24b4a' : '1px solid #444' }}
          />
          {erros.data && <span style={err}>{erros.data}</span>}
        </div>

        {/* Etapa */}
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Etapa PCI</label>
          <select name="etapaId" value={form.etapaId} onChange={handleChange} style={inp}>
            {pciItens.map(e => (
              <option key={e.id} value={e.id}>{e.id}. {e.nome}</option>
            ))}
          </select>
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Descrição</label>
          <input name="desc" value={form.desc} onChange={handleChange}
            placeholder="Ex: Concreto usinado fck25"
            style={{ ...inp, border: erros.desc ? '1px solid #e24b4a' : '1px solid #444' }}
          />
          {erros.desc && <span style={err}>{erros.desc}</span>}
        </div>

        {/* Fornecedor */}
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Fornecedor / Prestador</label>
          <input name="forn" value={form.forn} onChange={handleChange}
            placeholder="Ex: Concretex Ltda" style={inp} />
        </div>

        {/* Valor */}
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Valor (R$)</label>
          <input name="valor" value={form.valor} onChange={handleChange}
            type="number" min="0" step="0.01" placeholder="0,00"
            style={{ ...inp, border: erros.valor ? '1px solid #e24b4a' : '1px solid #444' }}
          />
          {erros.valor && <span style={err}>{erros.valor}</span>}
        </div>

        {/* NF */}
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Número NF / Recibo</label>
          <input name="nfnum" value={form.nfnum} onChange={handleChange}
            placeholder="Ex: NF-001234" style={inp} />
        </div>

        {/* Foto */}
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Foto da Nota Fiscal</label>
          <label style={{
            display: 'block', padding: 10, textAlign: 'center',
            border: '1.5px dashed #555', borderRadius: 8,
            cursor: 'pointer', color: '#aaa', fontSize: 12
          }}>
            📎 Clique para anexar foto
            <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
          </label>
          {form.img && (
            <img src={form.img} alt="NF"
              style={{ width: '100%', maxHeight: 160, objectFit: 'contain', borderRadius: 8, marginTop: 8 }} />
          )}
        </div>

        {/* Obs */}
        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Observação</label>
          <textarea name="obs" value={form.obs} onChange={handleChange}
            placeholder="Detalhes adicionais..."
            style={{ ...inp, height: 60, resize: 'vertical' }}
          />
        </div>

        {/* Botões */}
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

const lbl = { fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 };
const inp = { width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #444', background: '#2a2a2a', color: '#fff', fontSize: 13 };
const err = { color: '#e24b4a', fontSize: 11 };