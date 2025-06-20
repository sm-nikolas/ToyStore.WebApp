import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Mail, Calendar, Plus, HelpCircle } from 'lucide-react';
import { fetchClients, deleteClient, calculateClientStats } from '../../utils/api';
import { findMissingLetter, hasAllLetters, formatCurrency, formatDate, calculateAge } from '../../utils/helpers';
import { Client } from '../../types';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';
import ClientForm from './ClientForm';
import Tooltip from '../UI/Tooltip';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(client =>
        client.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;
    
    setDeleteLoading(true);
    try {
      await deleteClient(selectedClient.id);
      await loadClients();
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClientUpdated = () => {
    loadClients();
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalRevenue = clients.reduce((sum, c) => sum + calculateClientStats(c).totalVendas, 0);
  const activeClients = clients.filter(c => c.vendas.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os clientes da loja</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl lg:text-3xl font-bold text-green-600">{clients.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total de Clientes</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl lg:text-3xl font-bold text-emerald-600">{activeClients}</p>
            <p className="text-sm text-gray-600 mt-1">Clientes Ativos</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl lg:text-3xl font-bold text-teal-600">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-gray-600 mt-1">Receita Total</p>
          </div>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredClients.map((client, index) => {
          const stats = calculateClientStats(client);
          const missingLetter = findMissingLetter(client.nomeCompleto);
          const hasComplete = hasAllLetters(client.nomeCompleto);
          const age = calculateAge(client.nascimento);
          
          return (
            <div 
              key={client.id} 
              className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-base lg:text-lg">
                      {client.nomeCompleto.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base lg:text-lg leading-tight">
                      {client.nomeCompleto}
                    </h3>
                    <p className="text-sm text-gray-500">{age} anos</p>
                  </div>
                </div>
                
                <div className="relative group">
                  <Tooltip content={hasComplete ? 'Nome completo!' : 'Primeira letra faltante'} subContent={hasComplete ? `O nome "${client.nomeCompleto}" contém todas as letras do alfabeto.` : `Esta é a primeira letra do alfabeto que não aparece no nome "${client.nomeCompleto}".`}>
                    <div className={`text-xs font-mono px-2 py-1 rounded-md cursor-help flex items-center space-x-1 ${
                      hasComplete 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span>{missingLetter}</span>
                      <HelpCircle className="h-3 w-3 opacity-60" />
                    </div>
                  </Tooltip>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-2 mb-4 lg:mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{formatDate(client.nascimento)}</span>
                </div>
              </div>

              {/* Grade de Estatísticas */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-gray-900">
                    {client.vendas.length}
                  </div>
                  <div className="text-xs text-gray-500">Pedidos</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalVendas)}
                  </div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>

              {/* Estatísticas Adicionais para Clientes Ativos */}
              {stats.totalVendas > 0 && (
                <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-base lg:text-lg font-semibold text-emerald-600">
                      {formatCurrency(stats.mediaVendas)}
                    </div>
                    <div className="text-xs text-gray-500">Ticket Médio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base lg:text-lg font-semibold text-teal-600">
                      {stats.diasComVendas}
                    </div>
                    <div className="text-xs text-gray-500">Dias Únicos</div>
                  </div>
                </div>
              )}

              {/* Badge VIP */}
              {stats.totalVendas > 500 && (
                <div className="mb-4">
                  <Tooltip content="Cliente VIP" subContent="O cliente é considerado VIP se o total de compras for superior a R$ 500,00.">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-help">
                      Cliente VIP
                    </div>
                  </Tooltip>
                </div>
              )}

              {/* Ações */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="flex-1 flex items-center justify-center px-2 lg:px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(client)}
                  className="flex-1 flex items-center justify-center px-2 lg:px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Excluir</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando seu primeiro cliente.'}
            </p>
          </div>
        </Card>
      )}

      {/* Modal de Adicionar */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Novo Cliente"
        size="md"
      >
        <ClientForm
          onSuccess={handleClientUpdated}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Modal de Editar */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cliente"
        size="md"
      >
        {selectedClient && (
          <ClientForm
            client={selectedClient}
            onSuccess={handleClientUpdated}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modal de Excluir */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir o cliente <strong>{selectedClient?.nomeCompleto}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
              className="flex-1"
            >
              Confirmar Exclusão
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientList;