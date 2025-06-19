import React, { useState } from 'react';
import { createClient, updateClient } from '../../utils/api';
import { Client } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface ClientFormProps {
  client?: Client;
  onSuccess: () => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nomeCompleto: client?.nomeCompleto || '',
    email: client?.email || '',
    nascimento: client?.nascimento || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.nascimento) {
      newErrors.nascimento = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.nascimento);
      const today = new Date();
      if (birthDate > today) {
        newErrors.nascimento = 'Data de nascimento não pode ser no futuro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (client) {
        await updateClient(client.id, formData);
      } else {
        await createClient(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome Completo"
        type="text"
        value={formData.nomeCompleto}
        onChange={(e) => handleChange('nomeCompleto', e.target.value)}
        error={errors.nomeCompleto}
        placeholder="Digite o nome completo"
        required
      />

      <Input
        label="E-mail"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        placeholder="Digite o e-mail"
        required
      />

      <Input
        label="Data de Nascimento"
        type="date"
        value={formData.nascimento}
        onChange={(e) => handleChange('nascimento', e.target.value)}
        error={errors.nascimento}
        required
      />

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
        >
          {client ? 'Atualizar Cliente' : 'Criar Cliente'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;