# FORMA Atlas

High-Throughput 4D MRI Platform and Construction of the Multi-Region FORMA Atlas

## Overview

FORMA (Four-dimensional Organoid Resonance Mapping Atlas) is the largest longitudinal MRI dataset of human brain organoids to date. This open-source atlas comprises over 1,700 MRI volumes collected from three distinct brain regions.

## Features

- **High-Throughput Imaging**: 15-well MRI-compatible plate enabling simultaneous imaging
- **Comprehensive Dataset**: Over 1,700 MRI volumes from three brain regions
- **Multi-Region Coverage**: Cerebral, MGE, and Midbrain organoids
- **Longitudinal Tracking**: True longitudinal tracking over months
- **Open Source**: Freely available to the research community

## Technical Specifications

- **Field Strength**: 9.4T high-field MRI
- **Spatial Resolution**: ~40 μm isotropic
- **Sequence Type**: T2-weighted 3D RARE
- **Throughput**: 15 organoids per scan

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase project (already configured)

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional, already configured):
```bash
cp .env.local.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

**快速部署到在线环境：**

查看 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) 了解 5 分钟快速部署指南。

**详细部署选项：**

查看 [DEPLOY.md](./DEPLOY.md) 了解所有部署选项和详细步骤。

推荐使用 **Vercel** 进行部署（与 Next.js 完美集成）。

## Database Schema

The database includes the following tables:

- `regions`: Brain region types (Cerebral, MGE, Midbrain)
- `genotypes`: Genotype types (Healthy Control, SCZ Patient)
- `organoids`: Organoid information
- `mri_scans`: MRI scan data and metadata

See `database/schema.sql` for the complete schema.

## Project Structure

```
FORMA Atlas/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── browse/            # Browse dataset page
│   ├── organoid/[id]/     # Organoid detail page
│   └── about/             # About page
├── lib/                   # Utility functions
│   └── supabase.ts       # Supabase client
├── database/              # Database schema
│   └── schema.sql        # SQL schema
└── components/           # React components
```

## License

Open source - available to the research community.

## Citation

If you use FORMA Atlas in your research, please cite:

```
FORMA Atlas: High-Throughput 4D MRI Platform and Construction of the Multi-Region FORMA Atlas
```

