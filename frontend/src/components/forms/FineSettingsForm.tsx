import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IndianRupee } from 'lucide-react';
import type { FineSettings } from '@/types/fineSettings';

interface FineSettingsFormProps {
  defaultValues: FineSettings;
  onSubmit: (data: FineSettings) => void;
  onCancel: () => void;
}

export default function FineSettingsForm({ defaultValues, onSubmit, onCancel }: FineSettingsFormProps) {
  const { register, handleSubmit } = useForm<FineSettings>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="lateFeePenalty" className="text-base font-sans">Late Fee (per day)</Label>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="lateFeePenalty"
            type="number"
            {...register('lateFeePenalty', { required: true, min: 0 })}
            className="pl-10"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="missingBookPercentage" className="text-base font-sans">Missing Book Fine (%)</Label>
        <Input
          id="missingBookPercentage"
          type="number"
          {...register('missingBookPercentage', { required: true, min: 0, max: 500 })}
          placeholder="200"
        />
      </div>
      <div>
        <Label htmlFor="smallDamagePercentage" className="text-base font-sans">Small Damage (%)</Label>
        <Input
          id="smallDamagePercentage"
          type="number"
          {...register('smallDamagePercentage', { required: true, min: 0, max: 100 })}
          placeholder="10"
        />
      </div>
      <div>
        <Label htmlFor="largeDamagePercentage" className="text-base font-sans">Large Damage (%)</Label>
        <Input
          id="largeDamagePercentage"
          type="number"
          {...register('largeDamagePercentage', { required: true, min: 0, max: 100 })}
          placeholder="50"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">Save Settings</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}