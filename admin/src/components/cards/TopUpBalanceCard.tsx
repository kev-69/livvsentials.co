import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TopUpBalanceCardProps {
  costPerSMS: number;
  onTopUp: (amount: number) => Promise<void>;
}

const TopUpBalanceCard = ({ costPerSMS, onTopUp }: TopUpBalanceCardProps) => {
  const [topupAmount, setTopupAmount] = useState('5000');
  const [isLoading, setIsLoading] = useState(false);

  const handleTopup = async () => {
    setIsLoading(true);
    try {
      await onTopUp(parseInt(topupAmount));
      toast.success(`Successfully added ${topupAmount} credits to your balance`);
      setTopupAmount('5000'); // Reset to default
    } catch (error) {
      toast.error('Failed to top up balance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Up Balance</CardTitle>
        <CardDescription>
          Add more credits to your Termii account to send SMS notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium" htmlFor="topup-amount">
              Amount (Credits)
            </label>
            <Select value={topupAmount} onValueChange={setTopupAmount}>
              <SelectTrigger id="topup-amount">
                <SelectValue placeholder="Select amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">1,000 credits</SelectItem>
                <SelectItem value="5000">5,000 credits</SelectItem>
                <SelectItem value="10000">10,000 credits</SelectItem>
                <SelectItem value="25000">25,000 credits</SelectItem>
                <SelectItem value="50000">50,000 credits</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {parseInt(topupAmount) / costPerSMS} SMS messages approx.
            </p>
          </div>
          <Button onClick={handleTopup} disabled={isLoading} className="min-w-[120px]">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Top Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopUpBalanceCard;