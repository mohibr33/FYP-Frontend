"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import UsersManagement from "@/components/admin/users-management";
import ArticlesManagement from "@/components/admin/articles-management";
import TicketsManagement from "@/components/admin/tickets-management";
import MedicinesManagement from "@/components/admin/medicines-management";
import ReviewsManagement from "@/components/admin/reviews-management";
import {
  Users,
  FileText,
  Headphones,
  Pill,
  Star,
  BarChart3,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Admin page - authLoading:", authLoading, "user:", user);

    if (authLoading) return;

    if (!user) {
      console.log("No user found, redirecting to login");
      router.push("/auth/login");
      return;
    }

    console.log("User role:", user.role);

    // Check if user has admin role
    if (user.role !== "admin") {
      console.log("User is not admin, redirecting to dashboard");
      router.push("/dashboard");
      return;
    }

    console.log("Admin access granted");
    setLoading(false);
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage users, content, support tickets, and more
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Articles</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            <span className="hidden sm:inline">Tickets</span>
          </TabsTrigger>
          <TabsTrigger value="medicines" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Medicines</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Reviews</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="articles">
          <ArticlesManagement />
        </TabsContent>

        <TabsContent value="tickets">
          <TicketsManagement />
        </TabsContent>

        <TabsContent value="medicines">
          <MedicinesManagement />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
