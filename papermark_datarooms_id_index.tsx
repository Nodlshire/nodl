import { useState } from "react";

import { DataroomNavigation } from "@/components/datarooms/dataroom-navigation";
import StatsCard from "@/components/datarooms/stats-card";
import AppLayout from "@/components/layouts/app";
import LinkSheet from "@/components/links/link-sheet";
import LinksTable from "@/components/links/links-table";
import { Button } from "@/components/ui/button";
import DataroomVisitorsTable from "@/components/visitors/dataroom-visitors-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon, UsersIcon, ActivityIcon, SettingsIcon } from "lucide-react";

import { useDataroom, useDataroomLinks } from "@/lib/swr/use-dataroom";

export default function DataroomPage() {
  const { dataroom } = useDataroom();
  const { links } = useDataroomLinks();

  const [isLinkSheetOpen, setIsLinkSheetOpen] = useState<boolean>(false);

  if (!dataroom) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout>
      <div className="w-full">
        {/* Peony-style Gradient Header */}
        <section className="relative w-full overflow-hidden bg-black px-6 py-12 md:px-12 lg:px-16 text-white border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-pink-900/20 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                {dataroom.name}
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                Securely browse and manage documents for this dataroom.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                Edit
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsLinkSheetOpen(true)}>
                Share securely
              </Button>
            </div>
          </div>
        </section>

        <div className="p-6 md:p-12 lg:p-16">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="mb-8 bg-transparent border-b border-border w-full justify-start rounded-none h-12 p-0 space-x-6">
              <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">
                <FileTextIcon className="w-4 h-4 mr-2" /> Documents
              </TabsTrigger>
              <TabsTrigger value="visitors" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">
                <UsersIcon className="w-4 h-4 mr-2" /> Visitors
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">
                <ActivityIcon className="w-4 h-4 mr-2" /> Audit trail
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">
                <SettingsIcon className="w-4 h-4 mr-2" /> Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="space-y-6">
              <StatsCard />
              <div className="p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center bg-secondary/20">
                <FileTextIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No documents uploaded yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add your first document to this dataroom.</p>
                <Button>Upload Document</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="visitors" className="space-y-6">
              <DataroomVisitorsTable dataroomId={dataroom.id} />
            </TabsContent>
            
            <TabsContent value="audit" className="space-y-6">
              <LinksTable links={links} targetType={"DATAROOM"} />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center bg-secondary/20">
                <SettingsIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Dataroom Settings</h3>
                <p className="text-sm text-muted-foreground">Configure permissions and access controls here.</p>
              </div>
            </TabsContent>
          </Tabs>

          <LinkSheet
            linkType={"DATAROOM_LINK"}
            isOpen={isLinkSheetOpen}
            setIsOpen={setIsLinkSheetOpen}
            existingLinks={links}
          />
        </div>
      </div>
    </AppLayout>
  );
}
