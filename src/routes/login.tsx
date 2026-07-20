import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { claimFirstSuperAdmin } from "@/lib/bootstrap.functions";
import { SwiftLogo } from "@/components/swift-logo";
import { ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, Sparkles, ShieldCheck, User as UserIcon, Crown } from "lucide-react";


export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Super Admin Sign in · SWIFT" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { refresh, user, isSuperAdmin, memberships, loading, signIn: authSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (isSuperAdmin) {
        nav({ to: "/super-admin" });
      } else {
        toast.error("Restricted to Super Admins. Redirecting to appropriate portal...");
        setTimeout(() => {
          const companyAdminUrl = import.meta.env.VITE_COMPANY_ADMIN_URL || "http://localhost:5174";
          const employeeUrl = import.meta.env.VITE_EMPLOYEE_URL || "http://localhost:5175";
          const target = memberships.length > 0 ? companyAdminUrl : employeeUrl;
          window.location.href = `${target}/login`;
        }, 1500);
      }
    }
  }, [user, isSuperAdmin, memberships, loading, nav]);

  const handleSignIn = async () => {
    if (!email || !password) return toast.error("Enter username and password");
    
    if (email !== "superadmin.swift" || password !== "superadmin@swift") {
      return toast.error("Access Denied: Invalid username or password.");
    }

    setBusy(true);
    try {
      await authSignIn(email, "super_admin");
      toast.success("Welcome back, Super Administrator!");
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background bg-gradient-mesh">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-brand text-white relative overflow-hidden">
        <SwiftLogo />
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-semibold">SWIFT Super Admin.</h2>
          <p className="mt-4 max-w-md text-white/85">
            Manage subscription plans, configure global white-label settings,
            handle tenant billing approval flows, and monitor support cases.
          </p>
        </div>
        <div className="text-xs text-white/70">People. Performance. Progress.</div>
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 relative">
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6"><ThemeToggle /></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8"><SwiftLogo /></div>
          <h1 className="font-display text-3xl font-semibold">Super Admin Console</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in using your administrator credentials.
          </p>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>credentials</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin.swift"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Button
              className="w-full h-11 bg-gradient-brand text-white shadow-glow hover:opacity-95"
              onClick={handleSignIn}
              disabled={busy}
            >
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Sign in
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
