# ToyStore - Sistema de Gerenciamento de Loja de Brinquedos

Um sistema web moderno para gerenciamento de clientes e vendas de uma loja de brinquedos, desenvolvido com React, TypeScript e Tailwind CSS.

## Funcionalidades

### Autenticação
- Sistema de login
- Controle de acesso baseado em roles (admin)
- Context API para gerenciamento de estado de autenticação

### Dashboard Administrativo
- **Visão Geral**: Estatísticas em tempo real
  - Total de clientes
  - Receita total
  - Total de vendas
  - Ticket médio
- **Top Clientes**: Destaque para os melhores clientes
  - Maior volume de compras
  - Maior média de compras
  - Maior frequência de compras
- **Atividade Recente**: Lista dos clientes mais recentes

### Gerenciamento de Clientes
- Listagem completa de clientes
- Adição de novos clientes
- Visualização de estatísticas individuais
- Histórico de vendas por cliente

### Estatísticas e Relatórios
- Análise de vendas diárias
- Cálculo de métricas de performance
- Relatórios detalhados por cliente

### Interface Moderna
- Design responsivo com Tailwind CSS
- Componentes reutilizáveis
- Animações suaves
- Ícones intuitivos (Lucide React)
- Gráficos interativos (Recharts)

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Ícones**: Lucide React
- **Gráficos**: Recharts

## Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd ToyStore.WebApp
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter para verificar o código

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Auth/           # Componentes de autenticação
│   ├── Clients/        # Componentes de gerenciamento de clientes
│   ├── Dashboard/      # Componentes do dashboard
│   ├── Layout/         # Componentes de layout
│   ├── Statistics/     # Componentes de estatísticas
│   └── UI/             # Componentes de interface reutilizáveis
├── contexts/           # Contextos React (AuthContext)
├── pages/              # Páginas principais
├── types/              # Definições de tipos TypeScript
├── utils/              # Utilitários e helpers
│   ├── api.ts          # Funções de API
│   ├── auth.ts         # Utilitários de autenticação
│   └── helpers.ts      # Funções auxiliares
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada
```

## Como Usar

1. **Login**: Acesse o sistema com suas credenciais de administrador
2. **Dashboard**: Visualize as métricas principais na tela inicial
3. **Clientes**: Gerencie clientes através do menu lateral
4. **Estatísticas**: Acesse relatórios detalhados
5. **Adicionar Cliente**: Use o formulário para cadastrar novos clientes

---

Se este projeto foi útil para você, considere dar uma estrela no repositório! 