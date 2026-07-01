// supabase/functions/financial-assistant/index.ts
// Deploy: supabase functions deploy financial-assistant
// Secrets: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    // Autentica o usuário via JWT do Supabase
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401, headers: CORS })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return new Response('Unauthorized', { status: 401, headers: CORS })

    const { messages, financialContext } = await req.json()

    // Monta o system prompt com o contexto financeiro real do usuário
    const systemPrompt = buildSystemPrompt(financialContext)

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    })

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text()
      console.error('Anthropic error:', err)
      return new Response(JSON.stringify({ error: 'AI indisponível momentaneamente.' }), {
        status: 502,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const data = await anthropicRes.json()
    const reply = data.content?.[0]?.text ?? 'Não consegui gerar uma resposta.'

    return new Response(JSON.stringify({ reply }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Erro interno.' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})

function buildSystemPrompt(ctx: Record<string, unknown>): string {
  return `Você é o Assistente Financeiro IA do FinancePro — um consultor financeiro pessoal brasileiro, simpático, direto e sem jargões desnecessários.

## Dados financeiros do usuário (mês atual)

${JSON.stringify(ctx, null, 2)}

## Suas responsabilidades

- Responda SOMENTE sobre finanças pessoais. Se o usuário perguntar algo fora do tema, redirecione gentilmente.
- Use os dados acima para dar respostas PERSONALIZADAS. Nunca dê conselhos genéricos quando há dados concretos disponíveis.
- Cite valores reais (R$) quando relevante.
- Seja conciso: 2–4 parágrafos no máximo por resposta.
- Fale em português do Brasil, tom amigável mas profissional.
- Se os dados estiverem zerados, peça ao usuário para cadastrar lançamentos primeiro.
- Nunca invente dados que não estão no contexto acima.`
}
