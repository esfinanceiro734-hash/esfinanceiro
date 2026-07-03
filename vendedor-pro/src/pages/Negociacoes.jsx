import { fmtMoeda } from '../utils/format';
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useToast } from '../context/ToastContext';

const ETAPAS = [
  { id:'novo_cliente', label:'Novo contato' },
  { id:'contato_feito', label:'Primeiro atendimento' },
  { id:'cotacao', label:'Proposta enviada' },
  { id:'negociacao', label:'Negociação' },
];

const QUERY_NEGOCIACOES = () =>
  supabase
    .from('orcamentos')
    .select('*,clientes(nome,empresa)')
    .in('status', ['novo_cliente','contato_feito','cotacao','negociacao'])
    .order('updated_at', { ascending:false })
    .limit(200);

export default function Negociacoes() {
  const { notifyError } = useToast();
  const [orcs, setOrcs] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await QUERY_NEGOCIACOES();
      if (error) throw error;
      setOrcs(data || []);
    } catch (err) {
      notifyError(err, 'Não foi possível carregar as negociações');
    } finally {
      // C4 FIX: setLoading(false) sempre executa, mesmo em caso de erro
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => { carregar(); }, [carregar]);

  async function avancar(orc) {
    const idx = ETAPAS.findIndex(e => e.id === orc.status);
    // Sem etapa anterior reconhecida ou já na última etapa — não faz nada
    if (idx === -1 || idx >= ETAPAS.length - 1) return;

    const novoStatus = ETAPAS[idx + 1].id;

    // C4 FIX: atualiza estado local otimisticamente, reverte em caso de erro
    setOrcs(prev => prev.map(o => o.id === orc.id ? { ...o, status: novoStatus } : o));

    const { error } = await supabase.from('orcamentos').update({ status: novoStatus }).eq('id', orc.id);
    if (error) {
      notifyError(error, 'Não foi possível avançar a etapa');
      // Reverte para o estado anterior
      setOrcs(prev => prev.map(o => o.id === orc.id ? { ...o, status: orc.status } : o));
    }
  }

  return (
    <div className="content">
      <div className="page-head">
        <div><h1>Negociações</h1><p>Oportunidades em andamento</p></div>
      </div>
      <div className="panel">
        {loading ? (
          <p className="help-text">Carregando negociações...</p>
        ) : orcs.length === 0 ? (
          <div className="empty-state"><h3>Nenhuma negociação em andamento</h3></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Cliente</th><th>Empresa</th><th>Etapa</th>
                <th>Valor</th><th>Aberto em</th><th></th>
              </tr>
            </thead>
            <tbody>
              {orcs.map(o => {
                const et = ETAPAS.find(e => e.id === o.status);
                return (
                  <tr key={o.id}>
                    <td><strong>{o.clientes?.nome || '—'}</strong></td>
                    <td style={{color:'var(--muted)',fontSize:11}}>{o.clientes?.empresa || '—'}</td>
                    <td>
                      <span className="badge" style={{background:'var(--surface-2)',border:'1px solid var(--border)'}}>
                        {et?.label || o.status}
                      </span>
                    </td>
                    <td style={{fontFamily:'monospace'}}>{fmtMoeda(o.valor_total)}</td>
                    <td style={{fontSize:11}}>{o.created_at?.slice(0,10)}</td>
                    <td>
                      {ETAPAS.findIndex(e => e.id === o.status) < ETAPAS.length - 1 && (
                        <button className="btn btn-ghost btn-sm" onClick={() => avancar(o)}>
                          Avançar etapa
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
