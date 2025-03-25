
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      // Error is handled in the auth context
      console.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#a6a999] flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-md w-full px-8 py-10 bg-card border border-border/50 rounded-xl shadow-sm animate-fadeIn backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">TUKULE</h1>
          <p className="text-muted-foreground mt-2">Sign in to access the admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button type="button" variant="link" className="px-0 font-normal h-auto">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>
              CHANGE THIS:
              Demo credentials:
              <br />
              Email: admin@restaurant.com
              <br />
              Password: admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
