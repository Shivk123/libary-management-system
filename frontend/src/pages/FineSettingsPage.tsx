import { useState } from 'react';
import { useFineSettings } from '@/hooks/useFineSettings';
import FineSettingsForm from '@/components/forms/FineSettingsForm';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import type { FineSettings } from '@/types/fineSettings';

export default function FineSettingsPage() {
  const { settings, loading, error, updateSettings } = useFineSettings();
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (data: FineSettings) => {
    try {
      await updateSettings(data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!settings) return <div>No settings found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Fine Settings</h1>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Settings
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="max-w-md">
          <FineSettingsForm
            defaultValues={settings}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="space-y-4 max-w-md">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Current Settings</h3>
            <div className="space-y-2 text-sm">
              <div>Late Fee (per day): ₹{settings.lateFeePenalty}</div>
              <div>Missing Book Fine: {settings.missingBookPercentage}%</div>
              <div>Small Damage: {settings.smallDamagePercentage}%</div>
              <div>Large Damage: {settings.largeDamagePercentage}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}