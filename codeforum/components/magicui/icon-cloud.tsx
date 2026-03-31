"use client";

import React from "react";

export type DynamicCloudProps = {
    iconSlugs: string[];
};

export default function IconCloud({ iconSlugs }: DynamicCloudProps) {
    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-3 pt-10">
            {iconSlugs.map(slug => (
                <span
                    key={slug}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80"
                >
                    {slug}
                </span>
            ))}
        </div>
    );
}
