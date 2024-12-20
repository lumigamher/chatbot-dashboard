import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const UsersTable = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-white placeholder-gray-400 focus:outline-none text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredUsers.map((user, index) => (
              <tr key={index} className="hover:bg-gray-800/50">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                  {user.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                  {user.phone}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.registered 
                      ? 'bg-green-900/50 text-green-300' 
                      : 'bg-yellow-900/50 text-yellow-300'
                  }`}>
                    {user.registered ? 'Registrado' : 'Sin Registro'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm text-gray-400 text-right">
          Total: {filteredUsers.length} usuarios
        </div>
      </div>
    </div>
  );
};