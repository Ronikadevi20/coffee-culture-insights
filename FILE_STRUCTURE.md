coffee-culture-insights/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── charts/                  # Chart components for data visualization
│   │   │   ├── ActivityHeatmap.tsx
│   │   │   ├── BDLDistributionChart.tsx
│   │   │   ├── DailyActiveUsersChart.tsx
│   │   │   ├── EngagementFunnelChart.tsx
│   │   │   └── ScansPerCafeChart.tsx
│   │   │
│   │   ├── dashboard/               # Dashboard-specific components
│   │   │   ├── ChartCard.tsx
│   │   │   └── MetricCard.tsx
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopNav.tsx
│   │   │
│   │   ├── ui/                      # shadcn/ui components (60+ components)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (and many more)
│   │   │
│   │   └── NavLink.tsx              # Navigation link component
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx          # Authentication context provider
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Mobile detection hook
│   │   └── use-toast.ts             # Toast notifications hook
│   │
│   ├── lib/
│   │   └── utils.ts                 # Utility functions (cn, etc.)
│   │
│   ├── pages/                       # Page components (routes)
│   │   ├── Index.tsx                # Landing/Login page
│   │   ├── Login.tsx                # Login page
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── UserAnalytics.tsx        # User analytics page
│   │   ├── CafeAnalytics.tsx        # Cafe analytics page
│   │   ├── QRAnalytics.tsx          # QR code analytics page
│   │   ├── BDLAnalytics.tsx         # BDL analytics page
│   │   ├── StampsEconomy.tsx        # Stamps economy page
│   │   ├── EngagementFunnels.tsx    # Engagement funnels page
│   │   ├── AIInsights.tsx           # AI insights page
│   │   ├── PlatformHealth.tsx       # Platform health monitoring
│   │   ├── DatabaseLogs.tsx         # Database logs page
│   │   ├── Settings.tsx             # Settings page
│   │   └── NotFound.tsx             # 404 page
│   │
│   ├── App.css                      # App-level styles
│   ├── App.tsx                      # Main app component with routing
│   ├── index.css                    # Global styles & Tailwind directives
│   ├── main.tsx                     # Application entry point
│   └── vite-env.d.ts                # Vite TypeScript declarations
│
├── .gitignore                       # Git ignore file
├── bun.lockb                        # Bun lock file
├── components.json                  # shadcn/ui configuration
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── pnpm-lock.yaml                   # pnpm lock file
├── postcss.config.js                # PostCSS configuration
├── README.md                        # Project documentation
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.app.json                # TypeScript config for app
├── tsconfig.json                    # Main TypeScript config
├── tsconfig.node.json               # TypeScript config for Node
└── vite.config.ts                   # Vite build configuration
