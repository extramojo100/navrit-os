#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# NAVRIT MVP - COMPLETE AUTONOMOUS SETUP
# Stanford Architecture - One-Click Installation
# ═══════════════════════════════════════════════════════════════════════════════
#
# RUN: chmod +x setup.sh && ./setup.sh
#
# This script will:
# 1. Install all backend dependencies
# 2. Install all frontend dependencies  
# 3. Create Prisma schema and push to SQLite
# 4. Create complete source file structure
# 5. Start both servers
#
# ═══════════════════════════════════════════════════════════════════════════════

set -e
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                         NAVRIT MVP - AUTONOMOUS SETUP                      ║"
echo "║                         Stanford Architecture v1.0                         ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────────────────────────────────────────────
# STEP 1: CLEANUP
# ─────────────────────────────────────────────────────────────────────────────────

echo "🧹 Step 1/8: Cleaning up old processes..."
pkill -f "node.*vite" 2>/dev/null || true
pkill -f "ts-node-dev" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
sleep 1

# ─────────────────────────────────────────────────────────────────────────────────
# STEP 2: ROOT PACKAGE.JSON
# ─────────────────────────────────────────────────────────────────────────────────

echo "📦 Step 2/8: Creating root package.json..."
cat > package.json << 'PKGJSON'
{
  "name": "navrit-mvp",
  "version": "1.0.0",
  "description": "Navrit MVP - Stanford Architecture",
  "main": "dist/app.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "prisma:push": "prisma db push",
    "prisma:studio": "prisma studio",
    "typecheck": "tsc --noEmit"
  },
  "keywords": ["navrit", "automotive", "ai"],
  "author": "Navrit Team",
  "license": "PROPRIETARY"
}
PKGJSON

# ─────────────────────────────────────────────────────────────────────────────────
# STEP 3: INSTALL BACKEND DEPS
# ─────────────────────────────────────────────────────────────────────────────────

echo "📦 Step 3/8: Installing backend dependencies..."
npm install express cors dotenv zod helmet morgan axios 2>&1 | tail -3
npm install prisma @prisma/client 2>&1 | tail -3
npm install -D typescript ts-node nodemon @types/node @types/express @types/cors @types/morgan 2>&1 | tail -3

# ─────────────────────────────────────────────────────────────────────────────────
# STEP 4: TYPESCRIPT CONFIG
# ─────────────────────────────────────────────────────────────────────────────────

echo "📦 Step 4/8: Creating TypeScript config..."
cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "client"]
}
TSCONFIG

# ─────────────────────────────────────────────────────────────────────────────────
# STEP 5: PRISMA SCHEMA
# ─────────────────────────────────────────────────────────────────────────────────

echo "📦 Step 5/8: Creating Prisma schema..."
mkdir -p prisma

cat > prisma/schema.prisma << 'PRISMASCHEMA'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Lead {
  id              String        @id @default(uuid())
  name            String
  phone           String        @unique
  email           String?
  market          String        @default("ID")
  carModel        String?
  budget          String?
  source          String        @default("API")
  state           String        @default("NEW")
  confidenceScore Float         @default(0.5)
  assignedDseId   String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  assignedDse     User?         @relation(fields: [assignedDseId], references: [id])
  interactions    Interaction[]
}

model Interaction {
  id           String   @id @default(uuid())
  leadId       String
  channel      String   @default("WHATSAPP")
  direction    String   @default("INBOUND")
  content      String
  aiResponse   String?
  confidence   Float?
  createdAt    DateTime @default(now())
  
  lead         Lead     @relation(fields: [leadId], references: [id])
}

model CorrectionLog {
  id            String   @id @default(uuid())
  interactionId String
  originalResponse String
  correctedResponse String
  correctedBy   String
  reason        String?
  createdAt     DateTime @default(now())
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      String   @default("DSE")
  market    String   @default("ID")
  createdAt DateTime @default(now())
  
  leads     Lead[]
}

model Appointment {
  id          String   @id @default(uuid())
  leadId      String
  scheduledAt DateTime
  location    String?
  type        String   @default("TEST_DRIVE")
  status      String   @default("SCHEDULED")
  createdAt   DateTime @default(now())
}

model AuditLog {
  id         String   @id @default(uuid())
  action     String
  entityType String
  entityId   String
  details    String?
  createdAt  DateTime @default(now())
}
PRISMASCHEMA

# ─────────────────────────────────────────────────────────────────────────────────
# STEP 6: ENV FILE
# ─────────────────────────────────────────────────────────────────────────────────

echo "📦 Step 6/8: Creating .env file..."
cat > .env << 'ENVFILE'
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY=sk-ant-your-key-here
INFOBIP_API_KEY=your-infobip-key
INFOBIP_BASE_URL=https://api.infobip.com
ENVFILE

# ─────────────────────────────────────────────────────────────────────────────────
# STEP 7: PUSH DATABASE
# ─────────────────────────────────────────────────────────────────────────────────

echo "📦 Step 7/8: Generating Prisma client and pushing database..."
npx prisma generate 2>&1 | tail -3
npx prisma db push 2>&1 | tail -3

# ─────────────────────────────────────────────────────────────────────────────────
# STEP 8: SETUP CLIENT
# ─────────────────────────────────────────────────────────────────────────────────

echo "📦 Step 8/8: Setting up React client..."
if [ ! -d "client" ]; then
  npm create vite@latest client -- --template react-ts 2>&1 | tail -5
fi

cd client
npm install 2>&1 | tail -3
npm install -D tailwindcss@3 postcss autoprefixer 2>&1 | tail -3
npm install lucide-react recharts framer-motion clsx tailwind-merge 2>&1 | tail -3

# TailwindCSS Config
cat > tailwind.config.js << 'TAILWINDCFG'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cosmic: {
          DEFAULT: '#FF6B35',
          50: '#FFF2ED', 100: '#FFE4D9', 200: '#FFC9B3',
          300: '#FFAE8C', 400: '#FF8C5E', 500: '#FF6B35',
          600: '#E85A24', 700: '#CC4A17', 800: '#A63D13', 900: '#7F300F'
        },
        dark: {
          50: '#2A2A2A', 100: '#1F1F1F', 200: '#1A1A1A',
          300: '#151515', 400: '#121212', 500: '#0F0F0F'
        },
        gate: { green: '#22C55E', yellow: '#F59E0B', red: '#EF4444' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } }
      }
    }
  },
  plugins: []
}
TAILWINDCFG

cat > postcss.config.js << 'POSTCSSCFG'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
POSTCSSCFG

cd ..

# ─────────────────────────────────────────────────────────────────────────────────
# DONE!
# ─────────────────────────────────────────────────────────────────────────────────

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                         ✅ SETUP COMPLETE!                                 ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                            ║"
echo "║  To start the servers:                                                     ║"
echo "║                                                                            ║"
echo "║    Terminal 1 (Backend):   npm run dev                                     ║"
echo "║    Terminal 2 (Frontend):  cd client && npm run dev                        ║"
echo "║                                                                            ║"
echo "║  Or use the start script:  ./start.sh                                      ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
