import * as XLSX from 'xlsx';

function normalizePhone(phone) {
  if (!phone) return '';
  let phoneStr = String(phone).replace(/\D/g, '');
  if (phoneStr.startsWith('57')) {
    phoneStr = phoneStr.substring(2);
  }
  return phoneStr;
}

function isValidPhone(phone) {
  const normalizedPhone = normalizePhone(phone);
  return normalizedPhone.length === 10 && normalizedPhone.startsWith('3');
}

export const processExcelData = async (files) => {
  try {
    // Convertir ArrayBuffer a Uint8Array para xlsx.js
    const readExcelFile = (buffer) => {
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, {
        type: 'array',
        cellDates: true,
        cellNF: false,
        cellText: false
      });
      return workbook;
    };

    // Leer los workbooks
    const wb7 = readExcelFile(files.campi7);
    const wb8 = readExcelFile(files.campi8);
    const est8 = readExcelFile(files.estudiantes8);
    const est9 = readExcelFile(files.estudiantes9);

    // Obtener los nombres de las hojas
    console.log('Hojas disponibles wb7:', wb7.SheetNames);
    console.log('Hojas disponibles wb8:', wb8.SheetNames);
    console.log('Hojas disponibles est8:', est8.SheetNames);
    console.log('Hojas disponibles est9:', est9.SheetNames);

    // Obtener datos (ajustar los nombres de las hojas según la estructura real)
    const sheetName7 = wb7.SheetNames[0];
    const sheetName8 = wb8.SheetNames[0];
    const sheetNameEst8 = est8.SheetNames[0];
    const sheetNameEst9 = est9.SheetNames[0];

    const data7 = XLSX.utils.sheet_to_json(wb7.Sheets[sheetName7]);
    const data8 = XLSX.utils.sheet_to_json(wb8.Sheets[sheetName8]);
    const students8 = XLSX.utils.sheet_to_json(est8.Sheets[sheetNameEst8]);
    const students9 = XLSX.utils.sheet_to_json(est9.Sheets[sheetNameEst9]);

    // Procesar usuarios con números válidos
    function processValidUsers(data) {
      return data
        .map(row => ({
          name: String(row.Username || row['User Id'] || 'No especificado'),
          phone: normalizePhone(row['Phone Number']),
          registered: false
        }))
        .filter(user => isValidPhone(user.phone));
    }

    // Obtener usuarios únicos por ciudad
    const bucaUsers = Array.from(
      new Map(processValidUsers(data7).map(user => [user.phone, user]))
    ).map(([_, user]) => user);

    const bogUsers = Array.from(
      new Map(processValidUsers(data8).map(user => [user.phone, user]))
    ).map(([_, user]) => user);

    // Procesar estudiantes registrados
    const registeredStudents = [...students8, ...students9].map(student => ({
      phone: normalizePhone(student.Celular || student.telefono || student.Telefono)
    }));

    // Marcar usuarios registrados
    const markRegistered = (users) => {
      return users.map(user => ({
        ...user,
        registered: registeredStudents.some(student => student.phone === user.phone)
      }));
    };

    const bucaramangaUsers = markRegistered(bucaUsers);
    const bogotaUsers = markRegistered(bogUsers);

    // Calcular métricas
    const calculateMetrics = (users) => {
      const registers = users.filter(u => u.registered).length;
      return {
        uniqueUsers: users.length,
        registers,
        conversionRate: users.length ? Number(((registers/users.length) * 100).toFixed(2)) : 0
      };
    };

    const bucaMetrics = calculateMetrics(bucaramangaUsers);
    const bogMetrics = calculateMetrics(bogotaUsers);
    const totalRegisters = bucaMetrics.registers + bogMetrics.registers;

    // Imprimir datos para debuggear
    console.log('Bucaramanga Users:', bucaUsers.length);
    console.log('Bogotá Users:', bogUsers.length);
    console.log('Registered Students:', registeredStudents.length);

    return {
      bucaramanga: {
        metrics: bucaMetrics,
        percentages: {
          conversionRate: bucaMetrics.conversionRate
        },
        users: bucaramangaUsers
      },
      bogota: {
        metrics: bogMetrics,
        percentages: {
          conversionRate: bogMetrics.conversionRate
        },
        users: bogotaUsers
      },
      global: {
        uniqueUsers: bucaMetrics.uniqueUsers + bogMetrics.uniqueUsers,
        totalRegisters,
        conversionRate: ((totalRegisters / (bucaMetrics.uniqueUsers + bogMetrics.uniqueUsers)) * 100).toFixed(2),
        costPerRegister: Math.round(160000 / totalRegisters)
      }
    };
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};