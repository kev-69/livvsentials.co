import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MessageTemplate {
  subject: string;
  body: string;
}

interface MessageSettingsProps {
  settings: {
    senderName: string;
    // senderEmail: string;
    templates: {
      restockNotification: MessageTemplate;
      orderConfirmation: MessageTemplate;
      shipping: MessageTemplate;
      delivery: MessageTemplate;
    }
  };
  onChange: (key: string, value: any) => void;
  onTemplateChange: (template: string, field: string, value: string) => void;
}

const EmailSettings = ({ 
  settings, 
  onChange,
  onTemplateChange
}: MessageSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Sender Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="senderName">Sender Name</Label>
          <Input
            id="senderName"
            value={settings.senderName || ''}
            onChange={(e) => onChange('senderName', e.target.value)}
            placeholder="Your Store Name"
          />
          <p className="text-sm text-muted-foreground">
            This name will appear as the sender of all transactional messages
          </p>
        </div>
        
        {/* <div className="space-y-2">
          <Label htmlFor="senderEmail">Sender Email</Label>
          <Input
            id="senderEmail"
            type="email"
            value={settings.senderEmail || ''}
            onChange={(e) => onChange('senderEmail', e.target.value)}
            placeholder="noreply@yourstore.com"
          />
          <p className="text-sm text-muted-foreground">
            This email address will be used to send all transactional messaages
          </p>
        </div> */}
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Message Templates</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Customize the Message templates that are sent to customers
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="restock">
            <AccordionTrigger>Product Restock Message</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="restockSubject">Subject Line</Label>
                  <Input
                    id="restockSubject"
                    value={settings.templates?.restockNotification?.subject || ''}
                    onChange={(e) => onTemplateChange('restockNotification', 'subject', e.target.value)}
                    placeholder="Product back in stock"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="restockBody">Message Body</Label>
                  <Textarea
                    id="restockBody"
                    value={settings.templates?.restockNotification?.body || ''}
                    onChange={(e) => onTemplateChange('restockNotification', 'body', e.target.value)}
                    placeholder="Product back in stock"
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  <p className="font-medium mb-1">Available variables:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><code>{'{customer_name}'}</code> - Customer's name</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="orderConfirmation">
            <AccordionTrigger>Order Confirmation Message</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="orderConfirmationSubject">Subject Line</Label>
                  <Input
                    id="orderConfirmationSubject"
                    value={settings.templates?.orderConfirmation?.subject || ''}
                    onChange={(e) => onTemplateChange('orderConfirmation', 'subject', e.target.value)}
                    placeholder="Your order has been confirmed"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orderConfirmationBody">Message Body</Label>
                  <Textarea
                    id="orderConfirmationBody"
                    value={settings.templates?.orderConfirmation?.body || ''}
                    onChange={(e) => onTemplateChange('orderConfirmation', 'body', e.target.value)}
                    placeholder="Thank you for your order. We will process it shortly."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  <p className="font-medium mb-1">Available variables:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><code>{'{customer_name}'}</code> - Customer's name</li>
                    <li><code>{'{order_number}'}</code> - Order reference number</li>
                    <li><code>{'{order_date}'}</code> - Date of order</li>
                    <li><code>{'{order_total}'}</code> - Total order amount</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping Confirmation Message</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="shippingSubject">Subject Line</Label>
                  <Input
                    id="shippingSubject"
                    value={settings.templates?.shipping?.subject || ''}
                    onChange={(e) => onTemplateChange('shipping', 'subject', e.target.value)}
                    placeholder="Your order has been shipped"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingBody">Message Body</Label>
                  <Textarea
                    id="shippingBody"
                    value={settings.templates?.shipping?.body || ''}
                    onChange={(e) => onTemplateChange('shipping', 'body', e.target.value)}
                    placeholder="Your order is on its way to you."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  <p className="font-medium mb-1">Available variables:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><code>{'{customer_name}'}</code> - Customer's name</li>
                    <li><code>{'{order_number}'}</code> - Order reference number</li>
                    <li><code>{'{shipping_address}'}</code> - Shipping address</li>
                    <li><code>{'{estimated_delivery}'}</code> - Estimated delivery date</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="delivery">
            <AccordionTrigger>Delivery Confirmation Message</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="deliverySubject">Subject Line</Label>
                  <Input
                    id="deliverySubject"
                    value={settings.templates?.delivery?.subject || ''}
                    onChange={(e) => onTemplateChange('delivery', 'subject', e.target.value)}
                    placeholder="Your order has been delivered"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryBody">Message Body</Label>
                  <Textarea
                    id="deliveryBody"
                    value={settings.templates?.delivery?.body || ''}
                    onChange={(e) => onTemplateChange('delivery', 'body', e.target.value)}
                    placeholder="Your order has been delivered. We hope you enjoy your purchase."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  <p className="font-medium mb-1">Available variables:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><code>{'{customer_name}'}</code> - Customer's name</li>
                    <li><code>{'{order_number}'}</code> - Order reference number</li>
                    <li><code>{'{delivery_date}'}</code> - Delivery date</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default EmailSettings;