export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface Client {
  id: string;
  nomeCompleto: string;
  email: string;
  nascimento: string;
  vendas: Sale[];
}

export interface Sale {
  data: string;
  valor: number;
}

export interface ClientStats {
  totalVendas: number;
  mediaVendas: number;
  diasComVendas: number;
  ultimaCompra?: string;
}

export interface DailySales {
  data: string;
  total: number;
}

export interface TopClients {
  maiorVolume: Client | null;
  maiorMedia: Client | null;
  maiorFrequencia: Client | null;
}

export interface RawAPIResponse {
  data: {
    clientes: Array<{
      info: {
        nomeCompleto: string;
        detalhes: {
          email: string;
          nascimento: string;
        };
      };
      estatisticas: {
        vendas: Sale[];
      };
      duplicado?: any;
    }>;
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante?: any;
}