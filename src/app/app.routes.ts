import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "dashboard",
    loadComponent: () => import("@pages/dashboard/dashboard.component"),
  },
  {
    path: "hero/:id",
    loadComponent: () => import("@pages/hero/hero.component"),
  },
  {
    path: "add-hero",
    loadComponent: () => import("@pages/form-hero/form-hero.component"),
  },
  {
    path: "edit-hero/:id",
    loadComponent: () => import("@pages/form-hero/form-hero.component"),
  },
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
];
