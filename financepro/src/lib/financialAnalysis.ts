/**
 * Motor de análise financeira do FinancePro.
 * Puro TypeScript, sem dependências externas.
 * Recebe os dados brutos do Supabase e produz insights tipados,
 * recomendações e um score de saúde financeira (0–100).
 */

import type { TransactionRow, DebtRow, GoalRow } from '@/types/database'

// ─────────────────────────────────────────
// Tipos de saída
// ─────────────────────────────────────────

export type InsightSeverity = 'info' | 'warning' | 'danger' | 'success'

export interface Insight {
  id: string
  severity: InsightSeverity
  icon: string          // lucide icon name
  title: string
  message: string
  value?: number        // número relevante para o insight
  category?: string
}

export interface Recommendation {
  id: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  action?: string       // texto do botão de ação
  actionPath?: string   // rota interna
  estimatedImpact?: string
}

export interface SpendingByCategory {
  name: string
  total: number
  percent: number
  count: number
  avg: number
}

export interface FinancialAnalysisResult {
  // Resumo
  totalReceitas: number
  totalDespesas: number
  saldo: number
  savingsRate: number         // % poupada da receita
  healthScore: number         // 0–100
  healthLabel: string
  healthColor: string

  // Análises
  spendingByCategory: SpendingByCategory[]
  topCategory: SpendingByCategory | null
  mostExpensiveCategory: SpendingByCategory | null

  // Dívidas
  totalDividaAtiva: number
  debtToIncomeRatio: number   // dívidas / receita mensal
  highestInterestDebt: DebtRow | null

  // Metas
  goalsOnTrack: number
  goalsAtRisk: number
  closestGoal: GoalRow | null

  // Insights e recomendações
  insights: Insight[]
  recommendations: Recommendation[]
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function pct(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

function round2(n: number) { return Math.round(n * 100) / 100 }

function monthsUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24 * 30)))
}

// ─────────────────────────────────────────
// Score de saúde financeira
// ─────────────────────────────────────────

function computeHealthScore(params: {
  savingsRate: number
  debtToIncomeRatio: number
  goalsOnTrack: number
  totalGoals: number
  negativeSaldo: boolean
}): number {
  let score = 100

  // Penaliza saldo negativo imediatamente
  if (params.negativeSaldo) score -= 30

  // Taxa de poupança (peso 40)
  if (params.savingsRate < 0)        score -= 40
  else if (params.savingsRate < 10)  score -= 25
  else if (params.savingsRate < 20)  score -= 10
  else if (params.savingsRate >= 30) score += 5

  // Relação dívida/renda (peso 30)
  if (params.debtToIncomeRatio > 5)       score -= 30
  else if (params.debtToIncomeRatio > 3)  score -= 20
  else if (params.debtToIncomeRatio > 1)  score -= 10
  else if (params.debtToIncomeRatio < 0.5) score += 5

  // Metas em dia (peso 10)
  if (params.totalGoals > 0) {
    const goalRate = params.goalsOnTrack / params.totalGoals
    score += Math.round(goalRate * 10)
  }

  return Math.max(0, Math.min(100, score))
}

function healthLabel(score: number) {
  if (score >= 80) return 'Excelente'
  if (score >= 60) return 'Boa'
  if (score >= 40) return 'Regular'
  if (score >= 20) return 'Atenção'
  return 'Crítica'
}

function healthColor(score: number) {
  if (score >= 80) return 'positive'
  if (score >= 60) return 'info'
  if (score >= 40) return 'warning'
  return 'negative'
}

// ─────────────────────────────────────────
// Gerador de insights
// ─────────────────────────────────────────

function generateInsights(params: {
  savingsRate: number
  saldo: number
  totalReceitas: number
  totalDespesas: number
  spendingByCategory: SpendingByCategory[]
  topCategory: SpendingByCategory | null
  debtToIncomeRatio: number
  highestInterestDebt: DebtRow | null
  totalDividaAtiva: number
  goalsAtRisk: number
  closestGoal: GoalRow | null
}): Insight[] {
  const insights: Insight[] = []
  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // ── Saldo
  if (params.saldo < 0) {
    insights.push({
      id: 'negative-balance',
      severity: 'danger',
      icon: 'AlertTriangle',
      title: 'Saldo negativo',
      message: `Suas despesas superaram as receitas em ${fmt(Math.abs(params.saldo))} este mês. Ação imediata necessária.`,
      value: params.saldo,
    })
  } else if (params.savingsRate >= 30) {
    insights.push({
      id: 'great-savings',
      severity: 'success',
      icon: 'TrendingUp',
      title: 'Ótima taxa de poupança',
      message: `Você guardou ${params.savingsRate.toFixed(0)}% da sua renda este mês — acima da meta recomendada de 20%.`,
      value: params.savingsRate,
    })
  } else if (params.savingsRate < 10 && params.totalReceitas > 0) {
    insights.push({
      id: 'low-savings',
      severity: 'warning',
      icon: 'PiggyBank',
      title: 'Taxa de poupança baixa',
      message: `Você poupou apenas ${params.savingsRate.toFixed(0)}% da renda. Especialistas recomendam poupar pelo menos 20%.`,
      value: params.savingsRate,
    })
  }

  // ── Categoria dominante
  if (params.topCategory && params.totalDespesas > 0) {
    const { name, total, percent } = params.topCategory
    const severity: InsightSeverity = percent > 40 ? 'warning' : 'info'
    insights.push({
      id: 'top-category',
      severity,
      icon: 'Tag',
      title: `Maior custo: ${name}`,
      message: `${name} representa ${percent}% das suas despesas este mês (${fmt(total)}).`,
      value: percent,
      category: name,
    })
  }

  // ── Alimentação acima da média (>20% das despesas)
  const foodCat = params.spendingByCategory.find(
    (c) => c.name.toLowerCase().includes('alimenta'),
  )
  if (foodCat && foodCat.percent > 20) {
    insights.push({
      id: 'food-above-avg',
      severity: 'warning',
      icon: 'Utensils',
      title: 'Gastos com alimentação acima da média',
      message: `Você gastou ${fmt(foodCat.total)} em alimentação (${foodCat.percent}% das despesas). A média recomendada é até 15%.`,
      value: foodCat.total,
      category: 'Alimentação',
    })
  }

  // ── Dívidas
  if (params.debtToIncomeRatio > 3) {
    insights.push({
      id: 'high-debt-ratio',
      severity: 'danger',
      icon: 'CreditCard',
      title: 'Comprometimento alto com dívidas',
      message: `Suas dívidas equivalem a ${params.debtToIncomeRatio.toFixed(1)}x sua renda mensal. O limite saudável é 2x.`,
      value: params.debtToIncomeRatio,
    })
  } else if (params.debtToIncomeRatio > 1) {
    insights.push({
      id: 'moderate-debt',
      severity: 'warning',
      icon: 'CreditCard',
      title: 'Dívidas acima da renda mensal',
      message: `Suas dívidas ativas totalizam ${fmt(params.totalDividaAtiva)}. Priorize a quitação para melhorar sua saúde financeira.`,
      value: params.totalDividaAtiva,
    })
  }

  if (params.highestInterestDebt) {
    const debt = params.highestInterestDebt
    insights.push({
      id: 'high-interest-debt',
      severity: 'warning',
      icon: 'Landmark',
      title: 'Atenção: juros altos',
      message: `"${debt.nome_divida}" tem ${Number(debt.juros).toFixed(2)}% de juros ao mês — a dívida mais cara que você tem. Quitar primeiro economiza mais.`,
      value: Number(debt.juros),
    })
  }

  // ── Metas em risco
  if (params.goalsAtRisk > 0) {
    insights.push({
      id: 'goals-at-risk',
      severity: 'warning',
      icon: 'Target',
      title: `${params.goalsAtRisk} meta(s) em risco`,
      message: `Você tem ${params.goalsAtRisk} meta(s) com prazo próximo e progresso insuficiente. Revise os aportes.`,
      value: params.goalsAtRisk,
    })
  }

  // ── Meta mais próxima
  if (params.closestGoal) {
    const g = params.closestGoal
    const remaining = Number(g.valor_meta) - Number(g.valor_atual)
    const months = monthsUntil(g.prazo)
    if (months !== null && months > 0 && remaining > 0) {
      const monthly = round2(remaining / months)
      insights.push({
        id: 'closest-goal',
        severity: 'info',
        icon: 'Trophy',
        title: `Meta próxima: ${g.nome}`,
        message: `Faltam ${fmt(remaining)} para atingir "${g.nome}". Guardando ${fmt(monthly)}/mês você chega lá em ${months} mes(es).`,
        value: monthly,
      })
    }
  }

  return insights
}

// ─────────────────────────────────────────
// Gerador de recomendações
// ─────────────────────────────────────────

function generateRecommendations(insights: Insight[], params: {
  savingsRate: number
  saldo: number
  highestInterestDebt: DebtRow | null
  closestGoal: GoalRow | null
  totalReceitas: number
  debtToIncomeRatio: number
}): Recommendation[] {
  const recs: Recommendation[] = []
  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const hasInsight = (id: string) => insights.some((i) => i.id === id)

  if (hasInsight('negative-balance')) {
    recs.push({
      id: 'rec-cut-expenses',
      priority: 'high',
      title: 'Reduza despesas imediatamente',
      description: 'Seu saldo está negativo. Identifique gastos variáveis (lazer, assinaturas, alimentação fora) que podem ser cortados esta semana.',
      action: 'Ver despesas',
      actionPath: '/despesas',
      estimatedImpact: 'Reduzir déficit atual',
    })
  }

  if (hasInsight('high-interest-debt') && params.highestInterestDebt) {
    const debt = params.highestInterestDebt
    recs.push({
      id: 'rec-pay-high-interest',
      priority: 'high',
      title: 'Método Avalanche: quite a dívida mais cara',
      description: `Priorize pagar "${debt.nome_divida}" (${Number(debt.juros).toFixed(2)}% a.m.). Cada mês de atraso aumenta o total devido.`,
      action: 'Ver dívidas',
      actionPath: '/dividas',
      estimatedImpact: `Até ${fmt(Number(debt.valor_total) * (Number(debt.juros) / 100))} economizados por mês em juros`,
    })
  }

  if (params.savingsRate < 20 && params.totalReceitas > 0) {
    const target = round2(params.totalReceitas * 0.2)
    const current = round2(params.totalReceitas * (params.savingsRate / 100))
    recs.push({
      id: 'rec-increase-savings',
      priority: 'medium',
      title: 'Aumente sua taxa de poupança para 20%',
      description: `Você poupa ${params.savingsRate.toFixed(0)}% da renda. Para chegar em 20%, precisa economizar mais ${fmt(target - current)}/mês.`,
      action: 'Ver receitas',
      actionPath: '/receitas',
      estimatedImpact: `${fmt(target)}/mês guardados`,
    })
  }

  if (hasInsight('food-above-avg')) {
    recs.push({
      id: 'rec-food',
      priority: 'medium',
      title: 'Reduza gastos com alimentação',
      description: 'Planejar refeições semanais, cozinhar em casa e evitar delivery durante a semana pode reduzir esse gasto em até 30%.',
      action: 'Ver despesas',
      actionPath: '/despesas',
      estimatedImpact: 'Economia de até 30% na categoria',
    })
  }

  if (params.closestGoal) {
    const g = params.closestGoal
    const remaining = Number(g.valor_meta) - Number(g.valor_atual)
    if (remaining > 0) {
      recs.push({
        id: 'rec-goal-contribution',
        priority: 'medium',
        title: `Aporte mensal para "${g.nome}"`,
        description: `Crie um aporte automático mensal dedicado a esta meta para garantir que você chegue lá no prazo.`,
        action: 'Ver metas',
        actionPath: '/metas',
        estimatedImpact: `Meta atingida no prazo`,
      })
    }
  }

  if (params.saldo > 0 && params.debtToIncomeRatio < 0.5 && params.savingsRate > 20) {
    recs.push({
      id: 'rec-invest',
      priority: 'low',
      title: 'Considere investir o excedente',
      description: 'Sua saúde financeira está boa! Coloque o excedente em Tesouro Selic, CDB ou fundos de índice para fazer seu dinheiro trabalhar.',
      action: 'Ver carteira',
      actionPath: '/carteira',
      estimatedImpact: 'Rendimento acima da inflação',
    })
  }

  if (recs.length === 0) {
    recs.push({
      id: 'rec-add-data',
      priority: 'low',
      title: 'Adicione mais lançamentos para análises completas',
      description: 'Com receitas, despesas, dívidas e metas cadastradas, o Assistente consegue gerar recomendações muito mais precisas.',
      action: 'Adicionar receita',
      actionPath: '/receitas',
    })
  }

  return recs.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })
}

// ─────────────────────────────────────────
// Função principal de análise
// ─────────────────────────────────────────

export function analyzeFinances(
  transactions: TransactionRow[],
  debts: DebtRow[],
  goals: GoalRow[],
): FinancialAnalysisResult {
  // ── Receitas e despesas
  const receitas = transactions.filter((t) => t.tipo === 'receita')
  const despesas = transactions.filter((t) => t.tipo === 'despesa')

  const totalReceitas = receitas.reduce((s, t) => s + Number(t.valor), 0)
  const totalDespesas = despesas.reduce((s, t) => s + Number(t.valor), 0)
  const saldo = totalReceitas - totalDespesas
  const savingsRate = totalReceitas > 0 ? round2((saldo / totalReceitas) * 100) : 0

  // ── Gastos por categoria
  const catMap: Record<string, { total: number; count: number }> = {}
  for (const t of despesas) {
    const key = t.categoria_id ?? 'Outros'
    catMap[key] = catMap[key] ?? { total: 0, count: 0 }
    catMap[key].total += Number(t.valor)
    catMap[key].count++
  }
  const spendingByCategory: SpendingByCategory[] = Object.entries(catMap)
    .map(([name, { total, count }]) => ({
      name,
      total: round2(total),
      percent: pct(total, totalDespesas),
      count,
      avg: round2(total / count),
    }))
    .sort((a, b) => b.total - a.total)

  const topCategory = spendingByCategory[0] ?? null
  const mostExpensiveCategory = [...spendingByCategory].sort((a, b) => b.avg - a.avg)[0] ?? null

  // ── Dívidas
  const activeDebts = debts.filter((d) => d.status !== 'quitada')
  const totalDividaAtiva = activeDebts.reduce((s, d) => s + Number(d.valor_total), 0)
  const debtToIncomeRatio = totalReceitas > 0 ? round2(totalDividaAtiva / totalReceitas) : 0
  const highestInterestDebt = activeDebts.length
    ? activeDebts.reduce((max, d) => (Number(d.juros) > Number(max.juros) ? d : max))
    : null

  // ── Metas
  const now = Date.now()
  const goalsOnTrack = goals.filter((g) => {
    if (!g.prazo) return Number(g.valor_atual) / Number(g.valor_meta) > 0.5
    const months = monthsUntil(g.prazo)
    if (months === null || months === 0) return Number(g.valor_atual) >= Number(g.valor_meta)
    const needed = (Number(g.valor_meta) - Number(g.valor_atual)) / months
    return needed <= totalReceitas * 0.3 // considerado em dia se precisa <30% da renda
  }).length

  const goalsAtRisk = goals.filter((g) => {
    if (!g.prazo) return false
    const months = monthsUntil(g.prazo)
    if (months === null) return false
    const pctDone = Number(g.valor_atual) / Number(g.valor_meta)
    return months <= 3 && pctDone < 0.8
  }).length

  const closestGoal = goals
    .filter((g) => g.prazo && new Date(g.prazo).getTime() > now && Number(g.valor_atual) < Number(g.valor_meta))
    .sort((a, b) => new Date(a.prazo!).getTime() - new Date(b.prazo!).getTime())[0] ?? null

  // ── Score
  const score = computeHealthScore({
    savingsRate,
    debtToIncomeRatio,
    goalsOnTrack,
    totalGoals: goals.length,
    negativeSaldo: saldo < 0,
  })

  // ── Insights e recomendações
  const insightParams = {
    savingsRate, saldo, totalReceitas, totalDespesas,
    spendingByCategory, topCategory,
    debtToIncomeRatio, highestInterestDebt, totalDividaAtiva,
    goalsAtRisk, closestGoal,
  }
  const insights = generateInsights(insightParams)
  const recommendations = generateRecommendations(insights, {
    savingsRate, saldo, highestInterestDebt, closestGoal, totalReceitas, debtToIncomeRatio,
  })

  return {
    totalReceitas, totalDespesas, saldo, savingsRate,
    healthScore: score,
    healthLabel: healthLabel(score),
    healthColor: healthColor(score),
    spendingByCategory, topCategory, mostExpensiveCategory,
    totalDividaAtiva, debtToIncomeRatio, highestInterestDebt,
    goalsOnTrack, goalsAtRisk, closestGoal,
    insights, recommendations,
  }
}
