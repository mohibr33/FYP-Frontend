"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, loading, refreshProfile } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/auth/login");
    }
  }, [token, loading, router]);

  useEffect(() => {
    if (token && !user) refreshProfile();
  }, [token, user, refreshProfile]);

  // Debug logging
  useEffect(() => {
    console.log("Profile Page Debug:", { user, token: !!token, loading });
  }, [user, token, loading]);

  if (!token) return null;

  return (
    <div className="max-w-md mx-auto py-10">
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Profile</h1>
        {loading && !user ? (
          <p>Loading profile...</p>
        ) : user ? (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {user.name ||
                `${(user as any).firstName || ""} ${
                  (user as any).lastName || ""
                }`.trim() ||
                "N/A"}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email || "N/A"}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user.role || "N/A"}
            </p>
            <p>
              <span className="font-medium">Verified:</span>{" "}
              {user.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">Member Since:</span>{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        ) : (
          <p>Unable to load profile.</p>
        )}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
