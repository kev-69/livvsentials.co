import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import PrintableInvoice from '@/components/invoice/PrintableInvoice';
import { toast } from 'sonner';

interface PrintInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

const PrintInvoiceModal = ({ open, onOpenChange, order }: PrintInvoiceModalProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Company info
  const companyInfo = {
    name: "Livssentials",
    address: "123 Shop Street, Accra, Ghana",
    phone: "+233 20 1234567",
    email: "info@livssentials.co",
    website: "www.livssentials.com",
    logo: "/logo.png" // Path to your logo
  };

  // Handle print directly
  const handlePrint = () => {
    if (!printRef.current) return;
    
    // Create a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Unable to open print window. Please check your popup blocker settings.");
      return;
    }
    
    // Clone the printable content
    const contentToPrint = printRef.current.cloneNode(true) as HTMLElement;
    
    // Write to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <style>
            ${document.head.getElementsByTagName('style')[0]?.innerHTML || ''}
            
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            
            .print-container {
              width: 210mm;
              padding: 20mm;
              margin: 0 auto;
              color: #333;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            
            .logo {
              max-width: 150px;
              height: auto;
            }
            
            .company-details h1 {
              font-size: 24px;
              margin: 0 0 10px 0;
              color: #000;
            }
            
            .company-details p {
              margin: 2px 0;
              font-size: 14px;
            }
            
            .invoice-title {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            
            .invoice-title h2 {
              font-size: 28px;
              margin: 0 0 15px 0;
            }
            
            .invoice-info {
              display: flex;
              justify-content: space-between;
            }
            
            .customer-section {
              margin-bottom: 30px;
            }
            
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 16px;
              color: #000;
            }
            
            .customer-details p {
              margin: 2px 0;
              font-size: 14px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            .items-table th, 
            .items-table td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            
            .items-table th {
              background-color: #f9f9f9;
              font-weight: bold;
            }
            
            .items-table td:last-child,
            .items-table th:last-child {
              text-align: right;
            }
            
            .order-summary {
              width: 50%;
              margin-left: auto;
              margin-bottom: 30px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-size: 14px;
            }
            
            .summary-row.total {
              font-weight: bold;
              font-size: 16px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
              margin-top: 5px;
            }
            
            .payment-info {
              margin-bottom: 30px;
            }
            
            .invoice-footer {
              margin-top: 50px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${contentToPrint.outerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // Handle PDF download (more reliable method)
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    try {
      setDownloading(true);
      toast.info("Preparing PDF for download...");
      
      // Import dynamically to reduce initial bundle size
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas').then(module => module.default);
      
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // A4 dimensions
      const imgWidth = 210; 
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Add new pages if content overflows
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight; // Start position for next pages
      
      while (heightLeft > 0) {
        position = position - pageHeight; // Move to next page position
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice-${order.orderNumber}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-w-[90vw] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Invoice #{order.orderNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="border rounded-md p-4 sm:p-6 bg-white">
            <PrintableInvoice ref={printRef} order={order} companyInfo={companyInfo} />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={handlePrint} disabled={downloading}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="default" onClick={handleDownloadPDF} disabled={downloading}>
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintInvoiceModal;