import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Send, Sparkles, Loader2, Bot, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import type { FinancialAnalysisResult } from '@/lib/financialAnalysis'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'Como posso reduzir minhas despesas?',
  'Estou no caminho certo com minhas metas?',
  'Qual dívida devo quitar primeiro?',
  'Como melhorar meu score financeiro?',
]

function buildContext(result: FinancialAnalysisResult | null) {
  if (!result) return {}
  return {
    resumo: {
      receitas: result.totalReceitas,
      despesas: result.totalDespesas,
      saldo: result.saldo,
      taxaDePoupanca: `${result.savingsRate.toFixed(1)}%`,
      scoreFinanceiro: result.healthScore,
    },
    gastosPorCategoria: result.spendingByCategory.slice(0, 6).map((c) => ({
      categoria: c.name,
      total: c.total,
      percentual: `${c.percent}%`,
    })),
    dividasAtivas: {
      total: result.totalDividaAtiva,
      relacaoRendaMensal: `${result.debtToIncomeRatio.toFixed(1)}x`,
      maiorJuros: result.highestInterestDebt
        ? `${result.highestInterestDebt.nome_divida} (${result.highestInterestDebt.juros}% a.m.)`
        : 'nenhuma',
    },
    metas: {
      emDia: result.goalsOnTrack,
      emRisco: result.goalsAtRisk,
      proximaMeta: result.closestGoal?.nome ?? 'nenhuma',
    },
  }
}

interface AIChatProps {
  analysisResult: FinancialAnalysisResult | null
}

export function AIChat({ analysisResult }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  async function send(content: string) {
    if (!content.trim() || isSending) return
    setError(null)

    const userMsg: Message = { role: 'user', content: content.trim() }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setIsSending(true)

    try {
      const context = buildContext(analysisResult)
      const { data, error: fnError } = await supabase.functions.invoke('financial-assistant', {
        body: {
          messages: history,
          financialContext: context,
        },
      })

      if (fnError) throw new Error(fnError.message)

      const reply = data?.reply ?? 'Não consegui gerar uma resposta. Tente novamente.'
      setMessages([...history, { role: 'assistant', content: reply }])
    } catch (e) {
      console.error(e)
      setError('Não foi possível conectar ao assistente. Verifique se a Edge Function está publicada.')
      setMessages(history) // remove o user msg otimista em caso de erro
    } finally {
      setIsSending(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  return (
    <Card className="flex flex-col" style={{ minHeight: 480 }}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-soft text-purple">
            <Sparkles size={16} strokeWidth={2} />
          </div>
          <CardTitle className="text-[15px]">Chat com IA</CardTitle>
        </div>
        <span className="text-xs text-text-muted">Powered by Claude</span>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: 340 }}>
          {messages.length === 0 && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-soft text-purple">
                <Bot size={22} />
              </div>
              <p className="text-sm font-medium text-text-primary">Olá! Sou seu Assistente Financeiro IA.</p>
              <p className="mt-1 text-xs text-text-muted">
                Faço análises personalizadas com base nos seus dados reais. O que quer saber?
              </p>
              {/* Suggested questions */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-[12px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-soft text-purple">
                  <Bot size={14} />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-accent text-base rounded-tr-sm'
                    : 'bg-surface-elevated text-text-primary rounded-tl-sm',
                )}
              >
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className={j > 0 ? 'mt-1.5' : ''}>{line}</p>
                ))}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-soft text-purple">
                <Bot size={14} />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-surface-elevated px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {error && (
            <p className="text-center text-xs text-negative">{error}</p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border-subtle pt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre suas finanças..."
            disabled={isSending}
            className="flex-1 rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-base hover:bg-accent-hover disabled:opacity-40 disabled:pointer-events-none"
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
