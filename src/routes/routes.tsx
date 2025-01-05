import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SubscriptionCheck } from "@/components/auth/SubscriptionCheck";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import BrandBible from "@/pages/BrandBible";
import SocialPosts from "@/pages/SocialPosts";
import ProductDescription from "@/pages/ProductDescription";
import EmailContent from "@/pages/EmailContent";
import AdGeneration from "@/pages/AdGeneration";
import SeoArticle from "@/pages/SeoArticle";

export const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/brand-bible",
    element: (
      <ProtectedRoute>
        <SubscriptionCheck>
          <BrandBible />
        </SubscriptionCheck>
      </ProtectedRoute>
    ),
  },
  {
    path: "/social-posts",
    element: (
      <ProtectedRoute>
        <SubscriptionCheck>
          <SocialPosts />
        </SubscriptionCheck>
      </ProtectedRoute>
    ),
  },
  {
    path: "/product-description",
    element: (
      <ProtectedRoute>
        <SubscriptionCheck>
          <ProductDescription />
        </SubscriptionCheck>
      </ProtectedRoute>
    ),
  },
  {
    path: "/email-content",
    element: (
      <ProtectedRoute>
        <SubscriptionCheck>
          <EmailContent />
        </SubscriptionCheck>
      </ProtectedRoute>
    ),
  },
  {
    path: "/ad-generation",
    element: (
      <ProtectedRoute>
        <SubscriptionCheck>
          <AdGeneration />
        </SubscriptionCheck>
      </ProtectedRoute>
    ),
  },
  {
    path: "/seo-article",
    element: (
      <ProtectedRoute>
        <SubscriptionCheck>
          <SeoArticle />
        </SubscriptionCheck>
      </ProtectedRoute>
    ),
  },
];