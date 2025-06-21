import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAdmin } from "@/services/auth"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner'
import { api } from "@/lib/api";

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const { isLoading } = useAuth();
    const { setAdmin, setIsAuthenticated } = useAuth();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            return;
        }

        try {
            await loginAdmin(email, password);
            const profile = await api.get('/admin/profile');
            setAdmin(profile.data.data);
            setIsAuthenticated(true);
            toast.success('Login successful');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                toast.error(error.message || 'Login failed');
            } else {
                toast.error('An unknown error occurred')
            }
        }
    }

    return (
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
            Enter your email below to login to your dashboard
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                    Forgot your password?
                    </a>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                </div>
            </div>
            <div className="mt-6">
                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </div>
        </form>
        </CardContent>
        </Card>
    )
}
