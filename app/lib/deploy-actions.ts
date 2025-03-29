"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { saveDeployment, getDeploymentById, getDeploymentsByProject, deleteDeployment, getProjectById } from "@/app/lib/db"

// Define the schema for the expected Vercel API response
const vercelDeployResponseSchema = z.object({
  deployment: z.object({
    id: z.string(),
    url: z.string(),
    readyState: z.string(),
  }),
})

export type VercelDeploymentResponse = {
  success: boolean
  url?: string
  errorMessage?: string
}

export type WebsiteCode = {
  html?: string
  css?: string
  javascript?: string
  nextjs?: {
    components: Array<{ name: string; code: string }>
    styles: Array<{ name: string; code: string }>
  }
}

/**
 * Deploy a website to Vercel
 */
export async function deployToVercel(code: WebsiteCode, projectId: number): Promise<VercelDeploymentResponse> {
  try {
    // Prepare the deployment payload
    // In a real implementation, we would need to create actual files from the code
    // and create a project structure that Vercel can deploy

    const deploymentPayload = {
      name: `beehive-website-${Date.now()}`,
      files: [
        // Configuration files from the attachments
        {
          file: "next.config.ts",
          data: Buffer.from(`import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;`).toString("base64"),
          encoding: "base64",
        },
        {
          file: "eslint.config.mjs",
          data: Buffer.from(`import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;`).toString("base64"),
          encoding: "base64",
        },
        {
          file: "next-env.d.ts",
          data: Buffer.from(`/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.`).toString("base64"),
          encoding: "base64",
        },
        {
          file: "package.json",
          data: Buffer.from(`{
  "name": "beehiveuserapp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.2.3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.2.3",
    "@eslint/eslintrc": "^3"
  }
}`).toString("base64"),
          encoding: "base64",
        },
        {
          file: "tsconfig.json",
          data: Buffer.from(`{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`).toString("base64"),
          encoding: "base64",
        },
        {
          file: "postcss.config.mjs",
          data: Buffer.from(`const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;`).toString("base64"),
          encoding: "base64",
        },
        {
          file: "tailwind.config.ts",
          data: Buffer.from(`import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config`).toString("base64"),
          encoding: "base64",
        },
        // App Router files
        {
          file: "app/page.tsx",
          data: Buffer.from(`
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore the Next.js 13 playground.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}
`).toString("base64"),
          encoding: "base64",
        },
        {
          file: "app/layout.tsx",
          data: Buffer.from(`
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`).toString("base64"),
          encoding: "base64",
        },
        {
          file: "app/globals.css",
          data: Buffer.from(`
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
`).toString("base64"),
          encoding: "base64",
        },
        // Public assets
        {
          file: "public/icon.png",
          data: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABX0lEQVR4nI2TvUoDQRDHf3e5GEwUbcwhJliIIKQQCx/AR7ASX8BCsbEVLGx9A9/ATrAQK8HGQrARCxELYyF+QSRKTHKXvdvbXRvNxVz0wDAz7P7/M7OzA5KYXVvfkLQraZOQkiRJGkkfkp4l3ZZleZemKQCGYRjuAGeABQxQAAbwgRq4BK6A5+FwaFzXJcuyMEmS3UajcWKM2QEOA7gCPOAD6AFPwA1wDVSj0YgwDInjmDRNmc1mB1mWnRpjNoFmDfaAR+AeaAEtoAm0gQ7QBbpRFJGmKUEQEMcxruvS7/cXwjDcA1YkHUt6kTSW9CbpVdKLpImkD0mTqqpUVZXKslRRFBqPx5pMJpI0lHQk6VBSIulE0p+MMcYYY4wxWGuxdmFprWVhYQFrLdZarLU451itD/Ff1QdljCGKIrrdLs1mE9/3qaoKYwzOOZxzOOdwzjGdTv8+o++6rvdXVfUNKPuYQlzOZpYAAAAASUVORK5CYII=",
          ).toString("base64"),
          encoding: "base64",
        },
        {
          file: "public/apple-icon.png",
          data: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABX0lEQVR4nI2TvUoDQRDHf3e5GEwUbcwhJliIIKQQCx/AR7ASX8BCsbEVLGx9A9/ATrAQK8HGQrARCxELYyF+QSRKTHKXvdvbXRvNxVz0wDAz7P7/M7OzA5KYXVvfkLQraZOQkiRJGkkfkp4l3ZZleZemKQCGYRjuAGeABQxQAAbwgRq4BK6A5+FwaFzXJcuyMEmS3UajcWKM2QEOA7gCPOAD6AFPwA1wDVSj0YgwDInjmDRNmc1mB1mWnRpjNoFmDfaAR+AeaAEtoAm0gQ7QBbpRFJGmKUEQEMcxruvS7/cXwjDcA1YkHUt6kTSW9CbpVdKLpImkD0mTqqpUVZXKslRRFBqPx5pMJpI0lHQk6VBSIulE0p+MMcYYY4wxWGuxdmFprWVhYQFrLdZarLU451itD/Ff1QdljCGKIrrdLs1mE9/3qaoKYwzOOZxzOOdwzjGdTv8+o++6rvdXVfUNKPuYQlzOZpYAAAAASUVORK5CYII=",
          ).toString("base64"),
          encoding: "base64",
        },
        {
          file: "public/next.svg",
          data: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149.6 0  viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149.6 0v12.7H94v20.4h44.3v12.6H94v21h55.5v12.6H80.5V0h69.1Zm34.8 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6Zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7Z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8Zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5Zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8Z"/></svg>`,
          ).toString("base64"),
          encoding: "base64",
        },
        {
          file: "public/vercel.svg",
          data: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"/></svg>`,
          ).toString("base64"),
          encoding: "base64",
        },
        // Add middleware.ts for TypeScript completeness
        {
          file: "middleware.ts",
          data: Buffer.from(`
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked 'async' if using 'await' inside
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next, api)
    // '/((?!_next/|api/).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
`).toString("base64"),
          encoding: "base64",
        },
        // Environment types
        {
          file: "env.d.ts",
          data: Buffer.from(`
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_APP_URL: string
    // Add other environment variables as needed
  }
}
`).toString("base64"),
          encoding: "base64",
        },
        // Convert code object to files that Vercel can deploy - ONLY for components, not pages
        ...(code.nextjs?.components.map((component) => ({
          file: `components/${component.name}`,
          data: Buffer.from(component.code).toString("base64"),
          encoding: "base64",
        })) || []),

        // For styles in code.nextjs.styles, create a file
        ...(code.nextjs?.styles.map((style) => ({
          file: `styles/${style.name}`,
          data: Buffer.from(style.code).toString("base64"),
          encoding: "base64",
        })) || []),
      ],
      // Settings for the Vercel project
      projectSettings: {
        framework: "nextjs",
        buildCommand: "next build",
        outputDirectory: ".next",
      },
    }
    console.log("Deploying to Vercel:", deploymentPayload)

    // Make an API call to Vercel
    const response = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      },
      body: JSON.stringify(deploymentPayload),
    })

    const data = await response.json()
    console.log("Deployment response:", data)

    // Save the deployment to our database
    if (data && data.id) {
      const projectResult = await getProjectById(projectId)

      if (projectResult.success) {
        await saveDeployment({
          project_id: projectId,
          deployment_id: data.id,
          url: data.url || "",
          status: data.readyState || "INITIALIZING",
          response_data: data,
        })
      }
    }

    return {
      success: true,
      url: data.url,
      deployment: data,
    }
  } catch (error) {
    console.error("Error deploying to Vercel:", error)
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error occurred during deployment",
    }
  }
}

export async function fetchDeploymentsByProject(projectId: number) {
  try {
    const result = await getDeploymentsByProject(projectId)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch deployments" }
    }

    return { success: true, deployments: result.deployments }
  } catch (error) {
    console.error("Error fetching deployments:", error)
    return { success: false, message: "An error occurred while fetching deployments" }
  }
}

export async function fetchDeploymentDetails(id: number) {
  try {
    const result = await getDeploymentById(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch deployment" }
    }

    // Optionally fetch latest data from Vercel API
    try {
      const deploymentId = result.deployment.deployment_id
      const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      })

      if (response.ok) {
        const vercelData = await response.json()

        // Update our database with the latest data
        await saveDeployment({
          id: result.deployment.id,
          project_id: result.deployment.project_id,
          deployment_id: deploymentId,
          url: vercelData.url || result.deployment.url,
          status: vercelData.readyState || result.deployment.status,
          response_data: vercelData,
        })

        return { success: true, deployment: { ...result.deployment, vercel_data: vercelData } }
      }
    } catch (vercelError) {
      console.error("Error fetching from Vercel API:", vercelError)
      // Continue with our database data
    }

    return { success: true, deployment: result.deployment }
  } catch (error) {
    console.error("Error fetching deployment details:", error)
    return { success: false, message: "An error occurred while fetching deployment details" }
  }
}

export async function removeDeployment(id: number) {
  try {
    const deploymentResult = await getDeploymentById(id)

    if (!deploymentResult.success) {
      return { success: false, message: "Deployment not found" }
    }

    const deploymentId = deploymentResult.deployment.deployment_id

    // Delete from Vercel
    try {
      const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error deleting deployment from Vercel:", errorData)
        // Continue with database deletion anyway
      }
    } catch (vercelError) {
      console.error("Error deleting from Vercel API:", vercelError)
      // Continue with database deletion
    }

    // Delete from our database
    const result = await deleteDeployment(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to delete deployment" }
    }

    revalidatePath("/dashboard/projects")
    revalidatePath(`/dashboard/projects/${deploymentResult.deployment.project_id}`)
    revalidatePath(`/dashboard/projects/${deploymentResult.deployment.project_id}/deployments`)

    return { success: true, message: "Deployment deleted successfully" }
  } catch (error) {
    console.error("Error deleting deployment:", error)
    return { success: false, message: "An error occurred while deleting the deployment" }
  }
}

