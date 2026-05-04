# BILLUR ERP

AND BILLUR TEXTILE — Production ERP/MES system.

## Stack
- **Backend**: Node.js 20 + Express + TypeScript + PostgreSQL
- **Frontend**: React 18 + Vite + TanStack Query + Tailwind
- **Database**: PostgreSQL 16
- **Hosting**: Render (Web Service + PG addon)

## Struktura
```
billur-erp/
├── backend/         # API server
├── frontend/        # React SPA
├── render.yaml      # Render deployment
└── README.md
```

## Modullar (skeleton)
1. Auth (login, JWT, scrypt)
2. Users (RBAC, roles, permissions)
3. Clients (firmalar)
4. Orders (Speka, SET, Standard)
5. Production (events, stages)
6. Quality
7. Inventory (warehouses)
8. Surplus (izlishka)
9. Workers
10. QR scanning
11. Boxes (BoxApp)
12. Shipments
13. Print
14. Reports
15. Dashboard (real-time)
16. Audit log
17. Devices
18. Master data (models, colors, sizes)

## Lokal ishga tushirish

```bash
# 1. PostgreSQL kerak (lokal yoki Docker)
docker run -d --name billur-pg -e POSTGRES_PASSWORD=billur -p 5432:5432 postgres:16

# 2. Backend
cd backend
npm install
cp .env.example .env  # DATABASE_URL ni sozlang
npm run migrate
npm run dev           # http://localhost:3001

# 3. Frontend
cd frontend
npm install
npm run dev           # http://localhost:5173
```

## Render'ga deploy

`render.yaml` mavjud — repo'ni Render'da Blueprint sifatida import qiling.

Default credentials: `admin / admin123` (birinchi loginda o'zgartiring).

## Roadmap

- [x] **Phase 0**: Skeleton (foundation, auth, RBAC, all module stubs)
- [ ] **Phase 1**: Clients + Orders (Speka)
- [ ] **Phase 2**: Workers + QR
- [ ] **Phase 3**: Production tracking + stages
- [ ] **Phase 4**: Quality + Inventory
- [ ] **Phase 5**: Print + Reports
- [ ] **Phase 6**: Real-time dashboard + Polish
