import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Topbar() {
  const { perfil } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [aberto, setAberto] = useState(false);
  const inputRef = useRef();
  const timerRef = useRef();
  const inicial = (nome) => (nome || '?').charAt(0).toUpperCase();

  // A8 FIX: busca real com debounce de 300ms
  function handleQuery(e) {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(timerRef.current);
    if (!v.trim()) { setResultados([]); setAberto(false); return; }
    setBuscando(true);
    timerRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('clientes')
        .select('id,nome,empresa')
        .or(`nome.ilike.%${v}%,empresa.ilike.%${v}%`)
        .limit(8);
      setResultados(data || []);
      setAberto(true);
      setBuscando(false);
    }, 300);
  }

  function irParaCliente(id) {
    setQuery(''); setResultados([]); setAberto(false);
    navigate('/clientes', { state: { clienteId: id } });
  }

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function fechar(e) { if (!e.target.closest('.search-wrap')) setAberto(false); }
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, []);

  // Atalho Ctrl+K
  useEffect(() => {
    function hotkey(e) { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); } }
    document.addEventListener('keydown', hotkey);
    return () => document.removeEventListener('keydown', hotkey);
  }, []);

  return (
    <div className="topbar">
      <div className="search-wrap" style={{ position:'relative', flex:1, maxWidth:440 }}>
        <div className="search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            ref={inputRef}
            placeholder="Buscar clientes, empresas... (Ctrl+K)"
            value={query}
            onChange={handleQuery}
            onFocus={() => resultados.length && setAberto(true)}
          />
          {buscando && <span style={{fontSize:11,color:'var(--muted)'}}>...</span>}
          <span className="kbd">Ctrl+K</span>
        </div>
        {aberto && resultados.length > 0 && (
          <div style={{
            position:'absolute', top:'calc(100% + 4px)', left:0, right:0,
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'var(--radius-sm)', boxShadow:'var(--shadow)', zIndex:50,
          }}>
            {resultados.map(c => (
              <div
                key={c.id}
                onClick={() => irParaCliente(c.id)}
                style={{
                  padding:'9px 12px', cursor:'pointer', fontSize:13,
                  borderBottom:'1px solid var(--border)',
                }}
                onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background=''}
              >
                <strong>{c.nome}</strong>
                {c.empresa && <span style={{color:'var(--muted)',fontSize:11,marginLeft:8}}>{c.empresa}</span>}
              </div>
            ))}
          </div>
        )}
        {aberto && query && resultados.length === 0 && !buscando && (
          <div style={{
            position:'absolute', top:'calc(100% + 4px)', left:0, right:0,
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'var(--radius-sm)', padding:'12px', fontSize:12,
            color:'var(--muted)', zIndex:50,
          }}>
            Nenhum cliente encontrado para "{query}"
          </div>
        )}
      </div>

      <div className="topbar-right">
        <button className="icon-btn" onClick={() => navigate('/tarefas')} title="Agenda">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 3v3M16 3v3"/>
          </svg>
        </button>
        <button className="user-chip" onClick={() => navigate('/configuracoes')}>
          <div className="avatar">{inicial(perfil?.nome)}</div>
          <div>
            <div className="user-name">{perfil?.nome || 'Usuário'}</div>
            <div className="user-role">{perfil?.papel === 'admin' ? 'Administrador' : 'Vendedor'}</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
