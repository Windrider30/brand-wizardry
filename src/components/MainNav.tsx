import { useAuthState } from "@/hooks/useAuthState";
import { NavLinks } from "./nav/NavLinks";
import { AuthButtons } from "./nav/AuthButtons";
import { SupportButton } from "./nav/SupportButton";
import { BrandLogo } from "./nav/BrandLogo";

export function MainNav() {
  const { isAuthenticated, hasSubscription } = useAuthState();

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <BrandLogo />
        <div className="ml-auto flex items-center space-x-4 overflow-x-auto">
          <NavLinks hasSubscription={hasSubscription} />
          <SupportButton hasSubscription={hasSubscription} />
          <AuthButtons isAuthenticated={!!isAuthenticated} />
        </div>
      </div>
    </nav>
  );
}