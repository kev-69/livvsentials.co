import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  User, 
  Lock, 
  Upload, 
  Eye,
  EyeOff,
} from 'lucide-react';

export const SettingsTab = () => {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile settings state
  const [profileForm, setProfileForm] = useState({
    firstName: admin?.firstName || '',
    lastName: admin?.lastName || '',
    email: admin?.email || '',
    phone: '123-456-7890', // Mock data
  });

  // Password settings state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setIsLoading(false);
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Password changed successfully');
      setIsLoading(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1000);
  };

  const getInitials = () => {
    if (admin?.firstName && admin?.lastName) {
      return `${admin.firstName.charAt(0)}${admin.lastName.charAt(0)}`;
    }
    return 'A';
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Account Settings</h1>
      </div>

      {/* Mobile view: Horizontal tabs */}
      <div className="block md:hidden mb-6">
        <Tabs 
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="h-4 w-4 mr-2" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile settings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b dark:border-gray-700">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${profileForm.firstName}+${profileForm.lastName}&background=random&size=100`} />
                      <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-lg font-medium dark:text-white">Profile Picture</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Upload a new profile picture
                      </p>
                      <div className="flex gap-2 justify-center sm:justify-start">
                        <Button variant="outline" size="sm" className="h-9">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <Button variant="outline" size="sm" className="h-9">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName-mobile">First Name</Label>
                      <Input
                        id="firstName-mobile"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName-mobile">Last Name</Label>
                      <Input
                        id="lastName-mobile"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-mobile">Email</Label>
                    <Input
                      id="email-mobile"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-mobile">Phone Number</Label>
                    <Input
                      id="phone-mobile"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword-mobile">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword-mobile"
                        name="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword-mobile">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword-mobile"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword-mobile">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword-mobile"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                      {isLoading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop view with proper grid layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center px-4 py-3 text-left border-l-2 ${
                      activeTab === 'profile'
                        ? 'border-primary bg-gray-100 dark:bg-gray-800 text-primary dark:text-primary'
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`flex items-center px-4 py-3 text-left border-l-2 ${
                      activeTab === 'password'
                        ? 'border-primary bg-gray-100 dark:bg-gray-800 text-primary dark:text-primary'
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content area */}
          <div className="col-span-9 lg:col-span-10">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b dark:border-gray-700">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${profileForm.firstName}+${profileForm.lastName}&background=random&size=100`} />
                        <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium dark:text-white">Profile Picture</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          Upload a new profile picture
                        </p>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName-desktop">First Name</Label>
                        <Input
                          id="firstName-desktop"
                          name="firstName"
                          value={profileForm.firstName}
                          onChange={handleProfileChange}
                          className="max-w-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName-desktop">Last Name</Label>
                        <Input
                          id="lastName-desktop"
                          name="lastName"
                          value={profileForm.lastName}
                          onChange={handleProfileChange}
                          className="max-w-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email-desktop">Email</Label>
                        <Input
                          id="email-desktop"
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className="max-w-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone-desktop">Phone Number</Label>
                        <Input
                          id="phone-desktop"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          className="max-w-md"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'password' && (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword-desktop">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword-desktop"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword-desktop">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword-desktop"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword-desktop">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword-desktop"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;