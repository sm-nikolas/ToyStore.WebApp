import { Client, RawAPIResponse, DailySales, TopClients, ClientStats } from '../types';

// Mock data simulating the messy API structure
const mockAPIResponse: RawAPIResponse = {
  data: {
    clientes: [
      {
        info: {
          nomeCompleto: "Ana Beatriz Silva",
          detalhes: {
            email: "ana.b@example.com",
            nascimento: "1992-05-01"
          }
        },
        estatisticas: {
          vendas: [
            { data: "2024-01-01", valor: 150 },
            { data: "2024-01-02", valor: 50 },
            { data: "2024-01-05", valor: 200 },
            { data: "2024-01-10", valor: 75 }
          ]
        }
      },
      {
        info: {
          nomeCompleto: "Carlos Eduardo Santos",
          detalhes: {
            email: "cadu@example.com",
            nascimento: "1987-08-15"
          }
        },
        duplicado: {
          nomeCompleto: "Carlos Eduardo Santos"
        },
        estatisticas: {
          vendas: [
            { data: "2024-01-03", valor: 300 },
            { data: "2024-01-08", valor: 120 },
            { data: "2024-01-12", valor: 90 }
          ]
        }
      },
      {
        info: {
          nomeCompleto: "Maria José Oliveira",
          detalhes: {
            email: "maria.jo@example.com",
            nascimento: "1995-03-22"
          }
        },
        estatisticas: {
          vendas: [
            { data: "2024-01-04", valor: 180 },
            { data: "2024-01-06", valor: 220 },
            { data: "2024-01-07", valor: 95 },
            { data: "2024-01-11", valor: 165 },
            { data: "2024-01-14", valor: 140 }
          ]
        }
      },
      {
        info: {
          nomeCompleto: "João Pedro Lima",
          detalhes: {
            email: "joao.pedro@example.com",
            nascimento: "1990-12-10"
          }
        },
        estatisticas: {
          vendas: [
            { data: "2024-01-09", valor: 85 },
            { data: "2024-01-13", valor: 110 }
          ]
        }
      },
      {
        info: {
          nomeCompleto: "Fernanda Costa",
          detalhes: {
            email: "fernanda.costa@example.com",
            nascimento: "1988-07-25"
          }
        },
        estatisticas: {
          vendas: [
            { data: "2024-01-15", valor: 250 },
            { data: "2024-01-16", valor: 180 },
            { data: "2024-01-17", valor: 320 }
          ]
        }
      },
      {
        info: {
          nomeCompleto: "Roberto Silva",
          detalhes: {
            email: "roberto.silva@example.com",
            nascimento: "1985-11-30"
          }
        },
        estatisticas: {
          vendas: []
        }
      },
      {
        info: {
          nomeCompleto: "Joaquim Barboza da Silva Pereira Xavier Neto",
          detalhes: {
            email: "joaquim.completo@example.com",
            nascimento: "1980-04-12"
          }
        },
        estatisticas: {
          vendas: [
            { data: "2024-01-18", valor: 450 },
            { data: "2024-01-19", valor: 380 },
            { data: "2024-01-20", valor: 290 }
          ]
        }
      }
    ]
  },
  meta: {
    registroTotal: 7,
    pagina: 1
  },
  redundante: {
    status: "ok"
  }
};

// Normalize messy API data
export const normalizeClientData = (rawData: RawAPIResponse): Client[] => {
  return rawData.data.clientes.map((rawClient, index) => ({
    id: (index + 1).toString(),
    nomeCompleto: rawClient.info.nomeCompleto,
    email: rawClient.info.detalhes.email,
    nascimento: rawClient.info.detalhes.nascimento,
    vendas: rawClient.estatisticas.vendas || []
  }));
};

// API functions
export const fetchClients = async (): Promise<Client[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return normalizeClientData(mockAPIResponse);
};

export const calculateClientStats = (client: Client): ClientStats => {
  const vendas = client.vendas;
  const totalVendas = vendas.reduce((sum, venda) => sum + venda.valor, 0);
  const mediaVendas = vendas.length > 0 ? totalVendas / vendas.length : 0;
  const diasComVendas = new Set(vendas.map(v => v.data)).size;
  const ultimaCompra = vendas.length > 0 ? 
    vendas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0].data 
    : undefined;

  return {
    totalVendas,
    mediaVendas,
    diasComVendas,
    ultimaCompra
  };
};

export const fetchDailySales = async (): Promise<DailySales[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const clients = normalizeClientData(mockAPIResponse);
  const dailyTotals = new Map<string, number>();
  
  clients.forEach(client => {
    client.vendas.forEach(venda => {
      const current = dailyTotals.get(venda.data) || 0;
      dailyTotals.set(venda.data, current + venda.valor);
    });
  });
  
  return Array.from(dailyTotals.entries())
    .map(([data, total]) => ({ data, total }))
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
};

export const fetchTopClients = async (): Promise<TopClients> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const clients = normalizeClientData(mockAPIResponse);
  
  let maiorVolume: Client | null = null;
  let maiorMedia: Client | null = null;
  let maiorFrequencia: Client | null = null;
  
  let maxVolume = 0;
  let maxMedia = 0;
  let maxFrequencia = 0;
  
  clients.forEach(client => {
    const stats = calculateClientStats(client);
    
    if (stats.totalVendas > maxVolume) {
      maxVolume = stats.totalVendas;
      maiorVolume = client;
    }
    
    if (stats.mediaVendas > maxMedia) {
      maxMedia = stats.mediaVendas;
      maiorMedia = client;
    }
    
    if (stats.diasComVendas > maxFrequencia) {
      maxFrequencia = stats.diasComVendas;
      maiorFrequencia = client;
    }
  });
  
  return { maiorVolume, maiorMedia, maiorFrequencia };
};

export const createClient = async (clientData: Omit<Client, 'id' | 'vendas'>): Promise<Client> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newClient: Client = {
    id: Date.now().toString(),
    ...clientData,
    vendas: []
  };
  
  // In a real app, this would be sent to the server
  mockAPIResponse.data.clientes.push({
    info: {
      nomeCompleto: newClient.nomeCompleto,
      detalhes: {
        email: newClient.email,
        nascimento: newClient.nascimento
      }
    },
    estatisticas: {
      vendas: []
    }
  });
  
  return newClient;
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const clientIndex = mockAPIResponse.data.clientes.findIndex((_, index) => (index + 1).toString() === id);
  if (clientIndex === -1) {
    throw new Error('Cliente não encontrado');
  }
  
  const rawClient = mockAPIResponse.data.clientes[clientIndex];
  if (clientData.nomeCompleto) rawClient.info.nomeCompleto = clientData.nomeCompleto;
  if (clientData.email) rawClient.info.detalhes.email = clientData.email;
  if (clientData.nascimento) rawClient.info.detalhes.nascimento = clientData.nascimento;
  
  return normalizeClientData(mockAPIResponse).find(c => c.id === id)!;
};

export const deleteClient = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const clientIndex = mockAPIResponse.data.clientes.findIndex((_, index) => (index + 1).toString() === id);
  if (clientIndex === -1) {
    throw new Error('Cliente não encontrado');
  }
  
  mockAPIResponse.data.clientes.splice(clientIndex, 1);
};