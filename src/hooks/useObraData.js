import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useObraData() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('lancamentos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setItens(data.map(i => ({
          id: i.id,
          etapaId: i.etapa_id,
          data: i.data,
          desc: i.descricao,
          forn: i.forn,
          valor: +i.valor,
          nfnum: i.nfnum,
          obs: i.obs,
          img: i.img,
        })));
      }
      setCarregando(false);
    }
    carregar();
  }, []);

  async function addItem(item) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('lancamentos')
      .insert([{
        user_id: user.id,
        etapa_id: item.etapaId,
        data: item.data || null,
        descricao: item.desc,
        forn: item.forn || null,
        valor: item.valor,
        nfnum: item.nfnum || null,
        obs: item.obs || null,
        img: item.img || null,
      }])
      .select()
      .single();

    if (!error && data) {
      setItens(prev => [{
        id: data.id,
        etapaId: data.etapa_id,
        data: data.data,
        desc: data.descricao,
        forn: data.forn,
        valor: +data.valor,
        nfnum: data.nfnum,
        obs: data.obs,
        img: data.img,
      }, ...prev]);
    } else {
      console.error('Erro ao salvar:', error);
    }
  }

  async function updateItem(id, item) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('lancamentos')
      .update({
        etapa_id: item.etapaId,
        data: item.data || null,
        descricao: item.desc,
        forn: item.forn || null,
        valor: item.valor,
        nfnum: item.nfnum || null,
        obs: item.obs || null,
        img: item.img || null,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setItens(prev => prev.map(i => i.id === id ? {
        ...i,
        etapaId: item.etapaId,
        data: item.data,
        desc: item.desc,
        forn: item.forn,
        valor: item.valor,
        nfnum: item.nfnum,
        obs: item.obs,
        img: item.img,
      } : i));
    } else {
      console.error('Erro ao atualizar:', error);
    }
  }

  async function deleteItem(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('lancamentos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setItens(prev => prev.filter(i => i.id !== id));
    } else {
      console.error('Erro ao deletar:', error);
    }
  }

  function totEtapa(etapaId) {
    return itens.filter(i => i.etapaId === etapaId).reduce((s, i) => s + (+i.valor || 0), 0);
  }

  function totGeral() {
    return itens.reduce((s, i) => s + (+i.valor || 0), 0);
  }

  return { itens, carregando, addItem, updateItem, deleteItem, totEtapa, totGeral };
}
