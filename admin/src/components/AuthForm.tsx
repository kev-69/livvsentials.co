import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAdmin } from "@/services/auth"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner'

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { isLoading } = useAuth();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            return;
        }

        try {
            await loginAdmin(
                email,
                password
            )
            // a toast notification or something
            toast.success('Login successfull')
            // <Toaster />

            // navigate to dashboard if success
            navigate('/dashboard')
        } catch (error) {
            // toast if login fails
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
        </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? '...' : 'Login'}
            </Button>
        </CardFooter>
        </Card>
    )
}
