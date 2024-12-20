import { useEffect, useState } from 'react';
import DetailedConversionFunnel from './components/DetailedConversionFunnel';
import { processExcelData } from './utils/dataProcessor';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const fileMapping = {
          'campi7': '/data/informecampi7.xlsx',
          'campi8': '/data/informecampi8.xlsx',
          'estudiantes8': '/data/estudiantes8.xlsx',
          'estudiantes9': '/data/estudiantes9.xlsx'
        };

        const files = {};

        // Cargar todos los archivos
        for (const [key, path] of Object.entries(fileMapping)) {
          console.log(`Loading file: ${path}`);
          const response = await fetch(path);
          
          if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.statusText}`);
          }
          
          const buffer = await response.arrayBuffer();
          files[key] = buffer;
        }

        console.log('All files loaded, processing data...');
        const processedData = await processExcelData(files);
        console.log('Data processed:', processedData);
        
        setData(processedData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-900/50 p-6 rounded-lg max-w-xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-2">Error al cargar los datos</h2>
          <p className="text-red-200">{error}</p>
          <p className="text-gray-300 mt-4 text-sm">
            Asegúrate de que los archivos Excel estén en la carpeta correcta y tengan el formato esperado.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <DetailedConversionFunnel data={data} />
    </div>
  );
}

export default App;