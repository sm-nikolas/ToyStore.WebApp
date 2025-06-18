import React from 'react';
import { UserPlus } from 'lucide-react';
import Card from '../UI/Card';
import ClientForm from './ClientForm';

interface AddClientProps {
  onClientAdded: () => void;
}

const AddClient: React.FC<AddClientProps> = ({ onClientAdded }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
            <p className="text-gray-600">Adicione um novo cliente ao sistema</p>
          </div>
        </div>
      </div>

      <Card>
        <ClientForm
          onSuccess={onClientAdded}
          onCancel={() => {}}
        />
      </Card>
    </div>
  );
};

export default AddClient;