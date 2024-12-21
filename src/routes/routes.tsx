import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import BrandBible from "@/pages/BrandBible";
import ProductDescription from "@/pages/ProductDescription";
import SocialPosts from "@/pages/SocialPosts";
import EmailContent from "@/pages/EmailContent";
import AdGeneration from "@/pages/AdGeneration";
import SeoArticle from "@/pages/SeoArticle";
import Login from "@/pages/Login";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <ProtectedRoute><Index /></ProtectedRoute>
  },
  {
    path: "/brand-bible",
    element: <ProtectedRoute><BrandBible /></ProtectedRoute>
  },
  {
    path: "/product-description",
    element: <ProtectedRoute><ProductDescription /></ProtectedRoute>
  },
  {
    path: "/social-posts",
    element: <ProtectedRoute><SocialPosts /></ProtectedRoute>
  },
  {
    path: "/email-content",
    element: <ProtectedRoute><EmailContent /></ProtectedRoute>
  },
  {
    path: "/ad-generation",
    element: <ProtectedRoute><AdGeneration /></ProtectedRoute>
  },
  {
    path: "/seo-article",
    element: <ProtectedRoute><SeoArticle /></ProtectedRoute>
  }
];