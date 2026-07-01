/**
 * Tipos gerados manualmente a partir do schema em supabase/migrations.
 * Quando o Supabase CLI estiver configurado, este arquivo pode ser
 * substituído por `supabase gen types typescript` para manter 100% de
 * paridade automática com o banco.
 */

export type TransactionType = 'receita' | 'despesa'
export type DebtStatus = 'aberta' | 'negociando' | 'quitada'

// ---------------------------------------------------------------------
// users_profile
// ---------------------------------------------------------------------
export type UsersProfileRow = {
  id: string
  nome: string
  email: string
  avatar: string | null
  created_at: string
}
export type UsersProfileInsert = {
  id: string
  nome: string
  email: string
  avatar?: string | null
  created_at?: string
}
export type UsersProfileUpdate = {
  nome?: string
  email?: string
  avatar?: string | null
}

// ---------------------------------------------------------------------
// categories
// ---------------------------------------------------------------------
export type CategoryRow = {
  id: string
  user_id: string
  nome: string
  tipo: TransactionType
  created_at: string
}
export type CategoryInsert = {
  user_id: string
  nome: string
  tipo: TransactionType
}
export type CategoryUpdate = {
  nome?: string
  tipo?: TransactionType
}

// ---------------------------------------------------------------------
// transactions
// ---------------------------------------------------------------------
export type TransactionRow = {
  id: string
  user_id: string
  tipo: TransactionType
  categoria_id: string | null
  descricao: string | null
  valor: number
  data: string
  created_at: string
}
export type TransactionInsert = {
  user_id: string
  tipo: TransactionType
  categoria_id?: string | null
  descricao?: string | null
  valor: number
  data?: string
}
export type TransactionUpdate = {
  tipo?: TransactionType
  categoria_id?: string | null
  descricao?: string | null
  valor?: number
  data?: string
}

// ---------------------------------------------------------------------
// debts
// ---------------------------------------------------------------------
export type DebtRow = {
  id: string
  user_id: string
  nome_divida: string
  instituicao: string | null
  valor_total: number
  juros: number
  parcelas: number
  valor_parcela: number
  status: DebtStatus
  created_at: string
  updated_at: string
}
export type DebtInsert = {
  user_id: string
  nome_divida: string
  instituicao?: string | null
  valor_total: number
  juros?: number
  parcelas?: number
  valor_parcela: number
  status?: DebtStatus
}
export type DebtUpdate = {
  nome_divida?: string
  instituicao?: string | null
  valor_total?: number
  juros?: number
  parcelas?: number
  valor_parcela?: number
  status?: DebtStatus
}

// ---------------------------------------------------------------------
// goals
// ---------------------------------------------------------------------
export type GoalRow = {
  id: string
  user_id: string
  nome: string
  valor_meta: number
  valor_atual: number
  prazo: string | null
  created_at: string
  updated_at: string
}
export type GoalInsert = {
  user_id: string
  nome: string
  valor_meta: number
  valor_atual?: number
  prazo?: string | null
}
export type GoalUpdate = {
  nome?: string
  valor_meta?: number
  valor_atual?: number
  prazo?: string | null
}

// ---------------------------------------------------------------------
// investments
// ---------------------------------------------------------------------
export type InvestmentRow = {
  id: string
  user_id: string
  nome: string
  tipo: string
  valor: number
  rentabilidade: number
  created_at: string
  updated_at: string
}
export type InvestmentInsert = {
  user_id: string
  nome: string
  tipo: string
  valor: number
  rentabilidade?: number
}
export type InvestmentUpdate = {
  nome?: string
  tipo?: string
  valor?: number
  rentabilidade?: number
}

/**
 * Shape compatível com o generic `Database` esperado pelo cliente do
 * Supabase (createClient<Database>()).
 */
export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: UsersProfileRow
        Insert: UsersProfileInsert
        Update: UsersProfileUpdate
        Relationships: []
      }
      categories: {
        Row: CategoryRow
        Insert: CategoryInsert
        Update: CategoryUpdate
        Relationships: []
      }
      transactions: {
        Row: TransactionRow
        Insert: TransactionInsert
        Update: TransactionUpdate
        Relationships: []
      }
      debts: {
        Row: DebtRow
        Insert: DebtInsert
        Update: DebtUpdate
        Relationships: []
      }
      goals: {
        Row: GoalRow
        Insert: GoalInsert
        Update: GoalUpdate
        Relationships: []
      }
      investments: {
        Row: InvestmentRow
        Insert: InvestmentInsert
        Update: InvestmentUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      transaction_type: TransactionType
      debt_status: DebtStatus
    }
    CompositeTypes: Record<string, never>
  }
}
