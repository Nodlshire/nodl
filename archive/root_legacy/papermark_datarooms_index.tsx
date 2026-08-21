import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect } from "react";

import { PlanEnum } from "@/ee/stripe/constants";
import { PlusIcon, FolderIcon, FileTextIcon, SettingsIcon, UsersIcon, ShieldCheckIcon, VideoIcon, FileBadge2Icon } from "lucide-react";

import { UpgradePlanModal } from "@/components/billing/upgrade-plan-modal";
import { AddDataroomModal } from "@/components/datarooms/add-dataroom-modal";
import { DataroomTrialModal } from "@/components/datarooms/dataroom-trial-modal";
import { EmptyDataroom } from "@/components/datarooms/empty-dataroom";
import AppLayout from "@/components/layouts/app";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { usePlan } from "@/lib/swr/use-billing";
import useDatarooms from "@/lib/swr/use-datarooms";
import useLimits from "@/lib/swr/use-limits";
import { daysLeft } from "@/lib/utils";

const FOLDER_CATEGORIES = [
  { name: "Business Plan, Financials & Bio", icon: FileTextIcon, count: 12 },
  { name: "Governance & Constitution", icon: ShieldCheckIcon, count: 4 },
  { name: "Strategic Infrastructure Plans", icon: SettingsIcon, count: 8 },
  { name: "Tokenomics & Term Sheet", icon: FileBadge2Icon, count: 3 },
  { name: "Video & Media", icon: VideoIcon, count: 5 },
];

export default function DataroomsPage() {
  const { datarooms } = useDatarooms();
  const { isFree, isPro, isBusiness, isDatarooms, isDataroomsPlus, isTrial } =
    usePlan();
  const { limits } = useLimits();
  const router = useRouter();

  const numDatarooms = datarooms?.length ?? 0;
  const limitDatarooms = limits?.datarooms ?? 1;

  const canCreateUnlimitedDatarooms =
    isDatarooms ||
    isDataroomsPlus ||
    (isBusiness && numDatarooms < limitDatarooms);

  useEffect(() => {
    if (!isTrial && (isFree || isPro)) router.push("/documents");
  }, [isTrial, isFree, isPro]);

  return (
    <AppLayout>
      <main className="w-full">
        {/* Peony-style Gradient Header */}
        <section className="relative w-full overflow-hidden bg-black px-6 py-12 md:px-12 lg:px-16 text-white border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-pink-900/20 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Wnode – AI Powered Planetary Compute Mesh
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                Securely browse our core architecture, financial models, and governance documents.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                Edit
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Share securely
              </Button>
            </div>
          </div>
        </section>

        <section className="p-6 md:p-12 lg:p-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Folders</h2>
            <AddDataroomModal>
              <Button variant="outline" size="sm" className="gap-2">
                <PlusIcon className="h-4 w-4" />
                New Folder
              </Button>
            </AddDataroomModal>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {FOLDER_CATEGORIES.map((category, idx) => (
              <Card key={idx} className="group cursor-pointer hover:border-blue-500/50 transition-colors bg-card border-border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <category.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-medium leading-snug line-clamp-2">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground font-medium">
                    {category.count} documents
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight mb-6">Recent Datarooms</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {datarooms && datarooms.length > 0 ? (
                datarooms.map((dataroom) => (
                  <Link key={dataroom.id} href={`/datarooms/${dataroom.id}/documents`}>
                    <Card className="group cursor-pointer hover:border-blue-500/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="truncate">{dataroom.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileTextIcon className="h-4 w-4" /> {dataroom._count.documents ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <UsersIcon className="h-4 w-4" /> {dataroom._count.views ?? 0}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyDataroom />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
