import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import { fetchClients, fetchDailySales, fetchTopClients, calculateClientStats } from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';
import { Client, DailySales, TopClients } from '../../types';
import StatsCard from './StatsCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import Card from '../UI/Card';

const AdminDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [topClients, setTopClients] = useState<TopClients | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [clientsData, salesData, topClientsData] = await Promise.all([
          fetchClients(),
          fetchDailySales(),
          fetchTopClients()
        ]);
        
        setClients(clientsData);
        setDailySales(salesData);
        setTopClients(topClientsData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
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
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Clientes"
          value={clients.length}
          icon={Users}
          color="green"
          trend={{ value: 12, label: 'este mês' }}
        />
        <StatsCard
          title="Receita Total"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="emerald"
          trend={{ value: 8, label: 'este mês' }}
        />
        <StatsCard
          title="Total de Vendas"
          value={totalSales}
          icon={ShoppingCart}
          color="teal"
          trend={{ value: 15, label: 'este mês' }}
        />
        <StatsCard
          title="Ticket Médio"
          value={formatCurrency(averageOrderValue)}
          icon={TrendingUp}
          color="lime"
          trend={{ value: -3, label: 'este mês' }}
        />
      </div>

      {/* Top Clients */}
      {topClients && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card hover>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Maior Volume</h3>
              {topClients.maiorVolume && (
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">{topClients.maiorVolume.nomeCompleto}</p>
                  <p className="text-green-600 font-medium">
                    {formatCurrency(calculateClientStats(topClients.maiorVolume).totalVendas)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Maior Média</h3>
              {topClients.maiorMedia && (
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">{topClients.maiorMedia.nomeCompleto}</p>
                  <p className="text-emerald-600 font-medium">
                    {formatCurrency(calculateClientStats(topClients.maiorMedia).mediaVendas)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Maior Frequência</h3>
              {topClients.maiorFrequencia && (
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">{topClients.maiorFrequencia.nomeCompleto}</p>
                  <p className="text-teal-600 font-medium">
                    {calculateClientStats(topClients.maiorFrequencia).diasComVendas} dias únicos
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Clientes Recentes</h3>
        <div className="space-y-4">
          {clients.slice(0, 5).map((client, index) => {
            const stats = calculateClientStats(client);
            return (
              <div 
                key={client.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.01] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      {client.nomeCompleto.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.nomeCompleto}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(stats.totalVendas)}</p>
                  <p className="text-sm text-gray-500">{client.vendas.length} pedidos</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;