import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { fetchDailySales, fetchTopClients, fetchClients, calculateClientStats } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { DailySales, TopClients, Client } from '../../types';
import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import StatsCard from '../Dashboard/StatsCard';

const StatisticsPage: React.FC = () => {
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [topClients, setTopClients] = useState<TopClients | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const [salesData, topClientsData, clientsData] = await Promise.all([
          fetchDailySales(),
          fetchTopClients(),
          fetchClients()
        ]);
        
        setDailySales(salesData);
        setTopClients(topClientsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalRevenue = dailySales.reduce((sum, day) => sum + day.total, 0);
  const totalSales = clients.reduce((sum, client) => sum + client.vendas.length, 0);
  const activeClients = clients.filter(c => c.vendas.length > 0).length;
  const vipClients = clients.filter(c => calculateClientStats(c).totalVendas > 500).length;

  // Prepare chart data
  const chartData = dailySales.map(day => ({
    data: formatDate(day.data),
    total: day.total,
    formattedTotal: formatCurrency(day.total)
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Estatísticas</h1>
        <p className="text-gray-600">Análise detalhada de vendas e performance dos clientes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Receita Total"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Total de Vendas"
          value={totalSales}
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Clientes Ativos"
          value={activeClients}
          icon={Users}
          color="teal"
        />
        <StatsCard
          title="Clientes VIP"
          value={vipClients}
          icon={Calendar}
          color="lime"
        />
      </div>

      {/* Top Clients Highlights */}
      {topClients && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maior Volume de Vendas</h3>
              {topClients.maiorVolume && (
                <div className="space-y-2">
                  <p className="text-xl font-bold text-gray-900">{topClients.maiorVolume.nomeCompleto}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(calculateClientStats(topClients.maiorVolume).totalVendas)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {topClients.maiorVolume.vendas.length} pedidos realizados
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maior Ticket Médio</h3>
              {topClients.maiorMedia && (
                <div className="space-y-2">
                  <p className="text-xl font-bold text-gray-900">{topClients.maiorMedia.nomeCompleto}</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(calculateClientStats(topClients.maiorMedia).mediaVendas)}
                  </p>
                  <p className="text-sm text-gray-500">por pedido</p>
                </div>
              )}
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110">
                <Calendar className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maior Frequência</h3>
              {topClients.maiorFrequencia && (
                <div className="space-y-2">
                  <p className="text-xl font-bold text-gray-900">{topClients.maiorFrequencia.nomeCompleto}</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {calculateClientStats(topClients.maiorFrequencia).diasComVendas}
                  </p>
                  <p className="text-sm text-gray-500">dias únicos com compras</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Daily Sales Chart - Now Full Width */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Vendas por Dia</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="data" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Total']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="total" 
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detailed Client Performance */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Detalhada por Cliente</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Vendas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Pedidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequência
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients
                .filter(client => client.vendas.length > 0)
                .sort((a, b) => calculateClientStats(b).totalVendas - calculateClientStats(a).totalVendas)
                .map((client, index) => {
                  const stats = calculateClientStats(client);
                  return (
                    <tr 
                      key={client.id} 
                      className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{client.nomeCompleto}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(stats.totalVendas)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.vendas.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(stats.mediaVendas)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stats.diasComVendas} dias únicos
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsPage;