import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Cog,
  User,
  Lock,
  Shield,
  Wallet,
  Save,
  RefreshCw,
  Database,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage = () => {
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    registrationEnabled: true,
    activationEnabled: true,
    minWithdrawalBNB: '0.05',
    minWithdrawalUSDT: '10',
    withdrawalFeePercent: '1',
    referralCommission: '10',
    directBonusPercent: '5',
    maintenanceMode: false,
  });

  // Admin settings
  const [adminSettings, setAdminSettings] = useState({
    adminWallet: '0x1234567890123456789012345678901234567890',
    apiEndpoint: 'https://api.example.com/v1',
    apiKey: '••••••••••••••••••••••',
    emailNotifications: true,
    twoFactorAuth: true,
  });

  // Handle system settings change
  const handleSystemSettingChange = (key: keyof typeof systemSettings, value: string | boolean) => {
    setSystemSettings({
      ...systemSettings,
      [key]: value,
    });
  };

  // Handle admin settings change
  const handleAdminSettingChange = (key: keyof typeof adminSettings, value: string | boolean) => {
    setAdminSettings({
      ...adminSettings,
      [key]: value,
    });
  };

  // Save settings
  const saveSystemSettings = () => {
    // Validate numeric fields
    const minWithdrawalBNB = Number.parseFloat(systemSettings.minWithdrawalBNB);
    const minWithdrawalUSDT = Number.parseFloat(systemSettings.minWithdrawalUSDT);
    const withdrawalFeePercent = Number.parseFloat(systemSettings.withdrawalFeePercent);
    const referralCommission = Number.parseFloat(systemSettings.referralCommission);
    const directBonusPercent = Number.parseFloat(systemSettings.directBonusPercent);

    if (Number.isNaN(minWithdrawalBNB) || minWithdrawalBNB <= 0) {
      toast.error('Invalid minimum BNB withdrawal amount');
      return;
    }

    if (Number.isNaN(minWithdrawalUSDT) || minWithdrawalUSDT <= 0) {
      toast.error('Invalid minimum USDT withdrawal amount');
      return;
    }

    if (Number.isNaN(withdrawalFeePercent) || withdrawalFeePercent < 0 || withdrawalFeePercent > 100) {
      toast.error('Invalid withdrawal fee percentage (0-100)');
      return;
    }

    if (Number.isNaN(referralCommission) || referralCommission < 0 || referralCommission > 100) {
      toast.error('Invalid referral commission percentage (0-100)');
      return;
    }

    if (Number.isNaN(directBonusPercent) || directBonusPercent < 0 || directBonusPercent > 100) {
      toast.error('Invalid direct bonus percentage (0-100)');
      return;
    }

    // Save system settings (in a real app, this would be an API call)
    toast.success('System settings saved successfully');
  };

  // Save admin settings
  const saveAdminSettings = () => {
    if (!adminSettings.adminWallet.startsWith('0x') || adminSettings.adminWallet.length !== 42) {
      toast.error('Invalid admin wallet address');
      return;
    }

    // Save admin settings (in a real app, this would be an API call)
    toast.success('Admin settings saved successfully');
  };

  // Reset settings to defaults
  const resetToDefaults = () => {
    setSystemSettings({
      registrationEnabled: true,
      activationEnabled: true,
      minWithdrawalBNB: '0.05',
      minWithdrawalUSDT: '10',
      withdrawalFeePercent: '1',
      referralCommission: '10',
      directBonusPercent: '5',
      maintenanceMode: false,
    });
    toast.info('System settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Settings
              </CardTitle>
              <CardDescription>
                Configure registration, activation, and other user-related settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="registrationEnabled" className="flex items-center gap-2">
                  <span>Enable Registration</span>
                  <Info className="h-4 w-4 text-gray-500" />
                </Label>
                <Switch
                  id="registrationEnabled"
                  checked={systemSettings.registrationEnabled}
                  onCheckedChange={(checked: boolean) =>
                    handleSystemSettingChange('registrationEnabled', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="activationEnabled" className="flex items-center gap-2">
                  <span>Enable User Activation</span>
                  <Info className="h-4 w-4 text-gray-500" />
                </Label>
                <Switch
                  id="activationEnabled"
                  checked={systemSettings.activationEnabled}
                  onCheckedChange={(checked: boolean) =>
                    handleSystemSettingChange('activationEnabled', checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralCommission">Referral Commission (%)</Label>
                <Input
                  id="referralCommission"
                  type="number"
                  value={systemSettings.referralCommission}
                  onChange={(e) =>
                    handleSystemSettingChange('referralCommission', e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Percentage commission for direct referrals
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="directBonusPercent">Direct Bonus (%)</Label>
                <Input
                  id="directBonusPercent"
                  type="number"
                  value={systemSettings.directBonusPercent}
                  onChange={(e) =>
                    handleSystemSettingChange('directBonusPercent', e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Bonus percentage for direct team members
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Withdrawal Settings
              </CardTitle>
              <CardDescription>
                Configure minimum withdrawal amounts and fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minWithdrawalBNB">Minimum BNB Withdrawal</Label>
                <Input
                  id="minWithdrawalBNB"
                  type="number"
                  step="0.01"
                  value={systemSettings.minWithdrawalBNB}
                  onChange={(e) =>
                    handleSystemSettingChange('minWithdrawalBNB', e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Minimum amount of BNB that can be withdrawn
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minWithdrawalUSDT">Minimum USDT Withdrawal</Label>
                <Input
                  id="minWithdrawalUSDT"
                  type="number"
                  value={systemSettings.minWithdrawalUSDT}
                  onChange={(e) =>
                    handleSystemSettingChange('minWithdrawalUSDT', e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Minimum amount of USDT that can be withdrawn
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawalFeePercent">Withdrawal Fee (%)</Label>
                <Input
                  id="withdrawalFeePercent"
                  type="number"
                  step="0.1"
                  value={systemSettings.withdrawalFeePercent}
                  onChange={(e) =>
                    handleSystemSettingChange('withdrawalFeePercent', e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Fee percentage applied to all withdrawals
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all system settings to their default values. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetToDefaults}>
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={saveSystemSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Admin Settings */}
        <TabsContent value="admin" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Settings
              </CardTitle>
              <CardDescription>
                Configure admin wallet, API endpoints, and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminWallet">Admin Wallet Address</Label>
                <Input
                  id="adminWallet"
                  value={adminSettings.adminWallet}
                  onChange={(e) =>
                    handleAdminSettingChange('adminWallet', e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Primary wallet address for receiving admin funds
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={adminSettings.apiEndpoint}
                  onChange={(e) =>
                    handleAdminSettingChange('apiEndpoint', e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Backend API endpoint for system operations
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={adminSettings.apiKey}
                  onChange={(e) =>
                    handleAdminSettingChange('apiKey', e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Secure key for API authentication
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                  <span>Email Notifications</span>
                </Label>
                <Switch
                  id="emailNotifications"
                  checked={adminSettings.emailNotifications}
                  onCheckedChange={(checked: boolean) =>
                    handleAdminSettingChange('emailNotifications', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactorAuth" className="flex items-center gap-2">
                  <span>Two-Factor Authentication</span>
                </Label>
                <Switch
                  id="twoFactorAuth"
                  checked={adminSettings.twoFactorAuth}
                  onCheckedChange={(checked: boolean) =>
                    handleAdminSettingChange('twoFactorAuth', checked)
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4">
              <Button onClick={saveAdminSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Admin Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Advanced System Settings
              </CardTitle>
              <CardDescription>
                Warning: These settings can significantly impact system functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="flex items-center gap-2 mb-1">
                    <span>Maintenance Mode</span>
                  </Label>
                  <p className="text-xs text-gray-500">
                    When enabled, the system will be inaccessible to all users except admins
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked: boolean) =>
                    handleSystemSettingChange('maintenanceMode', checked)
                  }
                />
              </div>

              <div className="pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Reset All User Passwords
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset the passwords for ALL users in the system. They will need to use the password recovery process to regain access.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toast.success('All user passwords have been reset')}>
                        Yes, Reset All Passwords
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Clear System Cache
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear system cache?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will clear all system caches, which may cause temporary slowdowns but can resolve certain system issues.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toast.success('System cache has been cleared')}>
                        Clear Cache
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
