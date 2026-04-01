"use client";

import Particles from "@/components/magicui/particles";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
];

const HeroSectionHeader = () => {
    const { hydrated, session } = useAuthStore();

    return (
        <section className="relative min-h-screen px-4">
            <Particles
                className="fixed inset-0 h-full w-full"
                quantity={500}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
                <div className="rounded-full bg-gradient-to-b from-white/10 to-transparent p-8 md:p-10">
                    <Image
                        src="/globe.svg"
                        alt=""
                        aria-hidden
                        width={320}
                        height={320}
                        className="h-36 w-36 opacity-20 blur-[1px] md:h-52 md:w-52"
                    />
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 z-10 flex w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4 text-center">
                <h1 className="pointer-events-none w-full max-w-5xl whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text px-4 text-center text-5xl font-bold leading-none tracking-tight text-transparent sm:text-6xl lg:text-8xl">
                    CodeForum
                </h1>
                <p className="mt-6 text-center text-xl font-bold leading-none tracking-tighter">
                    Ask questions, share knowledge, and collaborate with developers
                    worldwide. Join our community and enhance your coding skills!
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                    {!hydrated ? null : session ? (
                        <Link href="/questions/ask">
                            <ShimmerButton className="shadow-2xl">
                                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                    Ask a question
                                </span>
                            </ShimmerButton>
                        </Link>
                    ) : (
                        <>
                            <Link href="/register">
                                <ShimmerButton className="shadow-2xl">
                                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                        Sign up
                                    </span>
                                </ShimmerButton>
                            </Link>
                            <Link
                                href="/login"
                                className="relative rounded-full border border-neutral-200 px-8 py-3 font-medium text-black dark:border-white/[0.2] dark:text-white"
                            >
                                <span>Login</span>
                                <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                            </Link>
                        </>
                    )}
                </div>
                <div className="relative mt-10 w-full max-w-[32rem] rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.2),transparent_55%)]" />
                    <div className="relative flex flex-wrap justify-center gap-3">
                        {slugs.map(slug => (
                            <span
                                key={slug}
                                className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-medium text-white/80 shadow-lg"
                            >
                                {slug}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSectionHeader;
