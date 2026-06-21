export interface RouteInfo {
  path: string;
  name: string;
  description: string;
  iconName: string;
  badge?: string;
  slug: string;
}

export const toolsList: RouteInfo[] = [
  {
    slug: 'age-calculator',
    path: '/tools/age-calculator',
    name: 'Sarkari Age Calculator',
    description: 'Calculate precise age eligibility with category-specific relaxations (OBC, SC, ST, PwD) and cutoff dates.',
    iconName: 'Calendar',
    badge: 'Popular',
  },
  {
    slug: 'eligibility-checker',
    path: '/tools/eligibility-checker',
    name: 'Eligibility Evaluator',
    description: 'Check your qualification, marks percentage, and physical requirements against latest notifications.',
    iconName: 'ShieldCheck',
    badge: 'New',
  },
  {
    slug: 'salary-calculator',
    path: '/tools/salary-calculator',
    name: '7th Pay Salary Estimator',
    description: 'Estimate in-hand salary, allowances (DA, HRA, TA), and pension benefits based on pay level matrices.',
    iconName: 'Coins',
  },
  {
    slug: 'syllabus-tracker',
    path: '/tools/syllabus-tracker',
    name: 'Syllabus & Progress Tracker',
    description: 'Break down exam syllabus, track preparation progress, and schedule revisions interactively.',
    iconName: 'LayoutList',
  },
  {
    slug: 'photo-resizer',
    path: '/tools/photo-resizer',
    name: 'Photo Resizer & Stamp',
    description: 'Resize candidates photos locally and add custom name/date photo stamps for official uploads.',
    iconName: 'RotateCw',
    badge: 'Utility',
  },
  {
    slug: 'document-compressor',
    path: '/tools/document-compressor',
    name: 'Certificate Compressor',
    description: 'Compress candidate certificate marksheets (JPG/PNG) into compliant PDFs under 100KB/200KB presets.',
    iconName: 'FileArchive',
    badge: 'Exclusive',
  },
  {
    slug: 'photo-resizer-in-kb',
    path: '/tools/photo-resizer-in-kb',
    name: 'KB Photo Resizer',
    description: 'Compress and resize candidate photos locally to 20kb, 50kb, 100kb sizes matching online form guidelines.',
    iconName: 'RotateCw',
    badge: 'Utility',
  },
  {
    slug: 'ssc-signature-compressor-20kb',
    path: '/tools/ssc-signature-compressor-20kb',
    name: 'SSC Signature Resizer & Compressor',
    description: 'Resize and compress candidate signatures to under 20KB matching official SSC requirements.',
    iconName: 'FileArchive',
    badge: 'SSC',
  },
  {
    slug: 'rrb-signature-resizer-10kb',
    path: '/tools/rrb-signature-resizer-10kb',
    name: 'RRB Signature Resizer & Compressor',
    description: 'Resize and compress candidate signatures to under 10KB/20KB matching official Railway RRB requirements.',
    iconName: 'FileArchive',
    badge: 'Railway',
  },
];

export const routes = {
  home: '/',
  tools: toolsList,
  exams: '/exams',
  about: '/about',
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  contact: '/contact',
};
