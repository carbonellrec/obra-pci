import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modo, setModo] = useState('login'); // 'login' ou 'cadastro'

  async function handleSubmit() {
    setErro('');
    if (!email || !senha) { setErro('Preencha email e senha'); return; }
    if (senha.length < 6) { setErro('Senha mínima de 6 caracteres'); return; }
    setCarregando(true);

    try {
      if (modo === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) { setErro('Email ou senha incorretos'); return; }
        onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password: senha });
        if (error) { setErro('Erro ao cadastrar: ' + error.message); return; }
        if (data.user && !data.session) {
          setErro('');
          alert('Cadastro realizado! Verifique seu email para confirmar.');
          setModo('login');
        } else {
          onLogin(data.user);
        }
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#121212',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#1e1e1e', borderRadius: 16, padding: 32,
        width: 360, maxWidth: '95vw', border: '1px solid #2a2a2a'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            Obra<span style={{ color: '#185FA5' }}>PCI</span>
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            Controle de Obra — Caixa Econômica Federal
          </div>
        </div>

        {/* Abas */}
        <div style={{ display: 'flex', marginBottom: 20, background: '#2a2a2a', borderRadius: 8, padding: 3 }}>
          {['login', 'cadastro'].map(m => (
            <button key={m} onClick={() => { setModo(m); setErro(''); }} style={{
              flex: 1, padding: '7px 0', borderRadius: 6, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: modo === m ? '#185FA5' : 'transparent',
              color: modo === m ? '#fff' : '#aaa',
              transition: 'all 0.15s'
            }}>
              {m === 'login' ? '🔐 Entrar' : '📝 Cadastrar'}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #444', background: '#2a2a2a',
              color: '#fff', fontSize: 13
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>Senha</label>
          <input
            type="password" value={senha} onChange={e => setSenha(e.target.value)}
            placeholder="mínimo 6 caracteres"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #444', background: '#2a2a2a',
              color: '#fff', fontSize: 13
            }}
          />
        </div>

        {/* Erro */}
        {erro && (
          <div style={{
            background: '#3a1a1a', border: '1px solid #e24b4a',
            borderRadius: 8, padding: '8px 12px', marginBottom: 12,
            fontSize: 12, color: '#e24b4a'
          }}>
            ⚠️ {erro}
          </div>
        )}

        {/* Botão */}
        <button onClick={handleSubmit} disabled={carregando} style={{
          width: '100%', padding: '11px 0', borderRadius: 8, border: 'none',
          background: carregando ? '#333' : '#185FA5', color: '#fff',
          fontSize: 14, fontWeight: 600, cursor: carregando ? 'not-allowed' : 'pointer'
        }}>
          {carregando ? '⏳ Aguarde...' : modo === 'login' ? '🔐 Entrar' : '📝 Criar conta'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#555' }}>
          Acesso restrito — apenas usuários autorizados
        </div>
      </div>
    </div>
  );
}
