export interface NavItem {
  label: string
  path: string
  icon: string
}

export interface NavGroup {
  label: string | null
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [{ label: 'Dashboard', path: '/', icon: 'LayoutDashboard' }],
  },
  {
    label: 'Meu Dinheiro',
    items: [
      { label: 'Receitas', path: '/receitas', icon: 'PlusCircle' },
      { label: 'Despesas', path: '/despesas', icon: 'MinusCircle' },
      { label: 'Transferências', path: '/transferencias', icon: 'ArrowLeftRight' },
      { label: 'Categorias', path: '/categorias', icon: 'LayoutGrid' },
    ],
  },
  {
    label: 'Dívidas',
    items: [
      { label: 'Minhas Dívidas', path: '/dividas', icon: 'Landmark' },
      { label: 'Plano de Quitação', path: '/plano-quitacao', icon: 'Target' },
    ],
  },
  {
    label: 'Metas',
    items: [{ label: 'Metas Financeiras', path: '/metas', icon: 'Trophy' }],
  },
  {
    label: 'Investimentos',
    items: [
      { label: 'Carteira', path: '/carteira', icon: 'Briefcase' },
      { label: 'Rentabilidade', path: '/rentabilidade', icon: 'LineChart' },
    ],
  },
  {
    label: 'Relatórios',
    items: [
      { label: 'Análises', path: '/analises', icon: 'BarChart3' },
      { label: 'Fluxo de Caixa', path: '/fluxo-de-caixa', icon: 'FileText' },
      { label: 'Planejamento', path: '/planejamento', icon: 'CalendarRange' },
    ],
  },
  {
    label: 'Configurações',
    items: [
      { label: 'Perfil', path: '/perfil', icon: 'User' },
      { label: 'Configurações', path: '/configuracoes', icon: 'Settings' },
    ],
  },
]
