import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (data) => {
  try {
    // Capturar el dashboard completo
    const dashboard = document.querySelector('.w-full.max-w-7xl');
    const canvas = await html2canvas(dashboard, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#030712' // bg-gray-950
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Agregar imagen del dashboard
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    // Agregar título y fecha
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(16);
    const today = new Date().toLocaleDateString();
    pdf.text(`Reporte de Conversión - Chatbot ISA`, 10, imgHeight + 10);
    pdf.text(`Generado: ${today}`, 10, imgHeight + 20);

    // Agregar resumen de métricas
    pdf.setFontSize(12);
    const metrics = [
      `• Total Usuarios Únicos: ${data.global.uniqueUsers}`,
      `• Total Registros: ${data.global.totalRegisters}`,
      `• Tasa de Conversión Global: ${data.global.conversionRate}%`,
      `• Costo por Registro: $${data.global.costPerRegister.toLocaleString()} pesos`,
      '',
      'Bucaramanga:',
      `• Usuarios únicos: ${data.bucaramanga.metrics.uniqueUsers}`,
      `• Registros: ${data.bucaramanga.metrics.registers}`,
      `• Conversión: ${data.bucaramanga.percentages.conversionRate}%`,
      '',
      'Bogotá:',
      `• Usuarios únicos: ${data.bogota.metrics.uniqueUsers}`,
      `• Registros: ${data.bogota.metrics.registers}`,
      `• Conversión: ${data.bogota.percentages.conversionRate}%`,
    ];

    metrics.forEach((metric, index) => {
      pdf.text(metric, 10, imgHeight + 30 + (index * 7));
    });

    // Descargar PDF
    pdf.save('dashboard-conversion-chatbot.pdf');
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Por favor, intente nuevamente.');
  }
};