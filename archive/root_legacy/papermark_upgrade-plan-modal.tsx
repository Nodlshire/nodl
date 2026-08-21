import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useMemo, useState } from "react";
import React from "react";

import { useTeam } from "@/context/team-context";
import { getStripe } from "@/ee/stripe/client";
import { Feature, PlanEnum, getPlanFeatures } from "@/ee/stripe/constants";
import { getPriceIdFromPlan } from "@/ee/stripe/functions/get-price-id-from-plan";
import { PLANS } from "@/ee/stripe/utils";
import { CheckIcon, Users2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAnalytics } from "@/lib/analytics";
import { usePlan } from "@/lib/swr/use-billing";
import { capitalize, cn } from "@/lib/utils";

// Feature rendering component
const FeatureItem = ({ feature }: { feature: Feature }) => {
  const baseClasses = `flex items-center ${feature.isHighlighted ? "bg-orange-50 -mx-6 px-6 py-2 -my-1 font-bold rounded-md dark:bg-orange-900/20" : ""}`;

  if (feature.isUsers) {
    return (
      <div className={cn("justify-between gap-x-8", baseClasses)}>
        <div className="flex items-center gap-x-3">
          <CheckIcon className="h-5 w-5 flex-shrink-0 text-[#fb7a00]" />
          <span>{feature.text}</span>
        </div>
        {feature.tooltip && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Users2Icon className="h-4 w-4 text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{feature.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  return (
    <div className={cn("text-sm", baseClasses)}>
      <CheckIcon className="mr-3 h-5 w-5 flex-shrink-0 text-[#fb7a00]" />
      <span>{feature.text}</span>
    </div>
  );
};

// Segmented control component for Base/Plus selection
const PlanSelector = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div className="mt-1 flex w-1/2 rounded-lg border border-gray-200 p-1">
      <button
        className={cn(
          "flex-1 rounded-md px-3 py-1 text-sm transition-colors",
          !value
            ? "bg-gray-300 text-foreground dark:bg-gray-600 dark:text-white"
            : "text-gray-600 hover:text-gray-900 dark:text-muted-foreground dark:hover:text-white",
        )}
        onClick={() => onChange(false)}
      >
        Base
      </button>
      <button
        className={cn(
          "flex-1 rounded-md px-3 py-1 text-sm transition-colors",
          value
            ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
            : "text-gray-600 hover:text-gray-900 dark:text-muted-foreground dark:hover:text-white",
        )}
        onClick={() => onChange(true)}
      >
        Plus
      </button>
    </div>
  );
};

export function UpgradePlanModal({
  clickedPlan,
  trigger,
  open,
  setOpen,
  children,
}: {
  clickedPlan: any;
  trigger?: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}) {
  return null;
}
