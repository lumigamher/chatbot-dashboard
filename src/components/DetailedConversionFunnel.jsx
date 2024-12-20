import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, TrendingUp, Download } from 'lucide-react';
import { UsersTable } from './UsersTable';
import { generatePDF } from '../utils/pdfGenerator';

const Funnel = ({ data }) => (
  <div className="w-full max-w-sm mx-auto space-y-4">
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-center">
      <div className="text-2xl font-bold text-white">{data.metrics.uniqueUsers}</div>
      <div className="text-sm text-blue-200">Usuarios Únicos del Chat</div>
    </div>

    <div className="w-3/4 mx-auto text-center">
      <div className="w-px h-8 bg-blue-500 mx-auto"></div>
      <div className="text-blue-400 text-sm">
        {data.percentages.conversionRate}% conversión
      </div>
      <div className="w-px h-8 bg-blue-500 mx-auto"></div>
    </div>

    <div className="w-3/4 mx-auto bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg p-6 text-center">
      <div className="text-2xl font-bold text-white">{data.metrics.registers}</div>
      <div className="text-sm text-blue-200">Registros Completados</div>
    </div>
  </div>
);

const DetailedConversionFunnel = ({ data }) => {
  const handleExportPDF = async () => {
    await generatePDF(data);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6 bg-gray-950 min-h-screen">
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-800">
        <div className="relative h-48 bg-blue-900">
          <img 
            src="/logoWhite.png"
            alt="Campus Header" 
            className="w-full h-full object-cover opacity-75"
          />
        </div>
        <div className="p-6 text-center">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              Análisis de Conversión - Chatbot ISA
            </h2>
            <Button 
              onClick={handleExportPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
          <p className="text-gray-400">
            Análisis de conversión de usuarios del chat a registros efectivos
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex justify-between items-center">
              <span>Bucaramanga</span>
              <span className="text-sm bg-blue-900 text-blue-100 px-3 py-1 rounded-full">
                {data.bucaramanga.percentages.conversionRate}% conversión
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Funnel data={data.bucaramanga} />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex justify-between items-center">
              <span>Bogotá</span>
              <span className="text-sm bg-blue-900 text-blue-100 px-3 py-1 rounded-full">
                {data.bogota.percentages.conversionRate}% conversión
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Funnel data={data.bogota} />
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">
              Usuarios Únicos - Bucaramanga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable users={data.bucaramanga.users} />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">
              Usuarios Únicos - Bogotá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable users={data.bogota.users} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5" />
            Métricas Globales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300">Usuarios Únicos</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">{data.global.uniqueUsers}</div>
                <div className="text-sm text-gray-400">Total usuarios del chat</div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300">Registros Efectivos</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">{data.global.totalRegisters}</div>
                <div className="text-sm text-gray-400">{data.global.conversionRate}% tasa de conversión</div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300">Costo por Registro</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">${data.global.costPerRegister.toLocaleString()}</div>
                <div className="text-sm text-gray-400">pesos por registro</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedConversionFunnel;