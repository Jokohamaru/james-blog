export interface SubcategoryDef {
  slug: string;
  label: string;
}

export interface CategoryDef {
  slug: string;
  label: string;
  description: string;
  subcategories: readonly SubcategoryDef[];
}

export const CATEGORIES: readonly CategoryDef[] = [
  {
    slug: 'system-design',
    label: 'System Design',
    description: 'Kiến trúc phần mềm, hệ thống phân tán, cơ sở dữ liệu và mở rộng quy mô lớn.',
    subcategories: [
      { slug: 'architecture', label: 'Architecture' },
      { slug: 'distributed-systems', label: 'Distributed Systems' },
      { slug: 'databases', label: 'Databases' },
      { slug: 'scalability', label: 'Scalability' },
    ],
  },
  {
    slug: 'cloud',
    label: 'Cloud',
    description: 'Dịch vụ đám mây thực chiến trên AWS, Azure, Google Cloud và kiến trúc đa đám mây.',
    subcategories: [
      { slug: 'aws', label: 'AWS' },
      { slug: 'azure', label: 'Azure' },
      { slug: 'gcp', label: 'GCP' },
      { slug: 'other', label: 'Khác' },
    ],
  },
  {
    slug: 'linux-networking',
    label: 'Linux & Networking',
    description: 'Nhân hệ điều hành Linux, giao thức mạng TCP/IP, DNS, Load Balancing và bảo mật hạ tầng.',
    subcategories: [
      { slug: 'linux', label: 'Linux' },
      { slug: 'networking', label: 'Networking' },
      { slug: 'security', label: 'Security' },
    ],
  },
  {
    slug: 'containers-k8s',
    label: 'Containers & K8s',
    description: 'Đóng gói ứng dụng với Docker, điều phối container trên Kubernetes, Helm và Service Mesh.',
    subcategories: [
      { slug: 'docker', label: 'Docker' },
      { slug: 'kubernetes', label: 'Kubernetes' },
      { slug: 'helm-service-mesh', label: 'Helm & Service Mesh' },
    ],
  },
  {
    slug: 'iac-cicd',
    label: 'IaC & CI/CD',
    description: 'Cấp phát hạ tầng bằng mã nguồn (Terraform), đường ống CI/CD tự động hóa và GitOps.',
    subcategories: [
      { slug: 'terraform', label: 'Terraform' },
      { slug: 'cicd', label: 'CI/CD' },
      { slug: 'gitops-ansible', label: 'GitOps & Ansible' },
    ],
  },
  {
    slug: 'observability',
    label: 'Observability & Monitoring',
    description: 'Giám sát hệ thống, thu thập Metrics, tập trung hóa Logging, Distributed Tracing và Alerting.',
    subcategories: [
      { slug: 'monitoring-metrics', label: 'Monitoring & Metrics' },
      { slug: 'logging', label: 'Logging' },
      { slug: 'tracing-alerting', label: 'Tracing & Alerting' },
    ],
  },
] as const;

export function findCategory(slug?: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function findSubcategory(catSlug?: string, subSlug?: string): SubcategoryDef | undefined {
  return findCategory(catSlug)?.subcategories.find((s) => s.slug === subSlug);
}
