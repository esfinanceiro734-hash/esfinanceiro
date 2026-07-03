import React,{useEffect,useState}from'react';
import{useLocation}from'react-router-dom';
import Modal from'../components/Modal';
import{useAuth}from'../context/AuthContext';
import{useToast}from'../context/ToastContext';
import{supabase}from'../services/supabaseClient';

export default function Agenda(){
  const{session}=useAuth();
  const{notify,notifyError}=useToast();
  const location=useLocation();
  const[tarefas,setTarefas]=useState([]);
  const[clientes,setClientes]=useState([]);
  const[modal,setModal]=useState(false);
  const[loading,setLoading]=useState(true);
  const[form,setForm]=useState(()=>({titulo:'',data:new Date().toISOString().slice(0,10),hora:'',cliente_id:''}));
  const[salvando,setSalvando]=useState(false);

  useEffect(()=>{if(location.state?.abrirNovo)setModal(true);},[location.state]);

  async function carregar(){
    setLoading(true);
    const[r1,r2]=await Promise.all([
      supabase.from('tarefas').select('*,clientes(nome)').order('data').order('hora').limit(200),
      supabase.from('clientes').select('id,nome').order('nome').limit(500),
    ]);
    if(r1.data)setTarefas(r1.data);
    if(r2.data)setClientes(r2.data);
    setLoading(false);
  }
  useEffect(()=>{carregar();},[]);

  async function salvar(e){
    e.preventDefault();setSalvando(true);
    const{error}=await supabase.from('tarefas').insert({titulo:form.titulo,data:form.data,hora:form.hora||null,cliente_id:form.cliente_id||null,responsavel_id:session.user.id});
    if(error)notifyError(error);else{notify('Tarefa adicionada.');setModal(false);setForm({titulo:'',data:new Date().toISOString().slice(0,10),hora:'',cliente_id:''});carregar();}
    setSalvando(false);
  }

  const dias=[...new Set(tarefas.map(t=>t.data))].sort();
  const hoje=new Date().toISOString().slice(0,10);

  return(
    <div className="content">
      <div className="page-head">
        <div><h1>Agenda</h1><p>Próximos compromissos e retornos</p></div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Nova tarefa</button>
      </div>
      {loading?<p className="help-text" style={{padding:'20px 0'}}>Carregando agenda...</p>:dias.length===0?<div className="panel"><div className="empty-state"><h3>Agenda livre</h3><p>Nenhuma tarefa cadastrada ainda.</p></div></div>:(
        dias.map(dia=>(
          <div className="panel" key={dia} style={{marginBottom:12}}>
            <div className="panel-head"><h2>{new Date(dia+'T00:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}{dia===hoje&&<span style={{marginLeft:8,fontSize:11,background:'var(--green)',color:'#fff',padding:'2px 8px',borderRadius:4}}>Hoje</span>}</h2></div>
            {tarefas.filter(t=>t.data===dia).map(t=>(
              <div className="task-row" key={t.id}>
                <span className={`task-check${t.concluida?' done':''}`}>{t.concluida?'✓':''}</span>
                <div className={`task-title${t.concluida?' done':''}`}>{t.titulo}{t.clientes?.nome?` — ${t.clientes.nome}`:''}</div>
                <div className="task-time">{t.hora||''}</div>
              </div>
            ))}
          </div>
        ))
      )}
      {modal&&(
        <Modal title="Nova tarefa" onClose={()=>setModal(false)}>
          <form onSubmit={salvar}>
            <div className="field"><label>Título *</label><input required value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})}/></div>
            <div className="row2">
              <div className="field"><label>Data</label><input type="date" value={form.data} onChange={e=>setForm({...form,data:e.target.value})}/></div>
              <div className="field"><label>Hora</label><input type="time" value={form.hora} onChange={e=>setForm({...form,hora:e.target.value})}/></div>
            </div>
            <div className="field"><label>Cliente</label>
              <select value={form.cliente_id} onChange={e=>setForm({...form,cliente_id:e.target.value})}>
                <option value="">Nenhum</option>
                {clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" type="submit" disabled={salvando}>{salvando?'Salvando...':'Adicionar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
