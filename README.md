Smart Bookmark App

A full-stack bookmark management application built using Next.js, Supabase, and Google OAuth, deployed on Vercel.

Live Demo

https://smart-bookmark-app-sravya.vercel.app

Tech Stack

Next.js (App Router)

Supabase (Database & Authentication)

Google OAuth

TypeScript

Vercel (Deployment)

Features

Google authentication

Protected dashboard

Add and delete bookmarks

Persistent storage with Supabase

Production deployment

Key Challenges & Solutions

OAuth Redirect Issues (Production)
After deployment, authentication redirected to localhost.
Resolved by configuring:

Authorized redirect URIs in Google Cloud

Site URL and Redirect URLs in Supabase

Correct callback URL for production

Environment Variables Not Working on Vercel
Build failed with supabaseUrl is required.
Resolved by adding required environment variables in Vercel project settings:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Authentication Flow Handling
Implemented session handling and protected routing to ensure only authenticated users can access the dashboard.

Learnings

OAuth configuration in real-world environments

Debugging deployment issues

Managing environment variables securely

Handling authentication in Next.js applicationsjs applications
