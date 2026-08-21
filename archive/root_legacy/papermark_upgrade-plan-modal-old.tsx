import { useRouter } from "next/router";

import { useEffect, useMemo, useState } from "react";
import React from "react";

import { useTeam } from "@/context/team-context";
import { getStripe } from "@/ee/stripe/client";
import { PLANS } from "@/ee/stripe/utils";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAnalytics } from "@/lib/analytics";
import { usePlan } from "@/lib/swr/use-billing";
import { capitalize, cn } from "@/lib/utils";

import { DataroomTrialModal } from "../datarooms/dataroom-trial-modal";
import X from "../shared/icons/x";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";

export function UpgradePlanModal({
  clickedPlan,
  trigger,
  open,
  setOpen,
  children,
}: {
  clickedPlan: "Data Rooms" | "Business" | "Pro";
  trigger?: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}) {
  return null;
}
