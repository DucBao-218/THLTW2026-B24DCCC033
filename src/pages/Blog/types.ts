export type TrangThaiBaiViet = 'nhap' | 'da-dang';

export interface TheTag {
    id: string;
    ten: string;
    slug: string;
    mauSac: string;
}

export interface BaiViet {
    id: string;
    tieuDe: string;
    slug: string;
    tomTat: string;
    noiDung: string;
    anhDaiDien: string;
    tacGia: string;
    tagIds: string[];
    trangThai: TrangThaiBaiViet;
    luotXem: number;
    ngayTao: string;
    ngayCapNhat: string;
}

export interface TacGia {
    ten: string;
    anhDaiDien: string;
    tieuSu: string;
    kyNang: string[];
    mxh: { github?: string; twitter?: string; linkedin?: string; website?: string };
}

export const STORAGE_KEYS = {
    BAI_VIET: 'blog_bai_viet',
    THE_TAG: 'blog_the_tag',
    TAC_GIA: 'blog_tac_gia',
};

export const getFromStorage = <T>(key: string, def: T): T => {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : def;
    } catch {
        return def;
    }
};

export const saveToStorage = <T>(key: string, value: T) =>
    localStorage.setItem(key, JSON.stringify(value));

export const generateId = (prefix: string, existingIds: string[] = []): string => {
    let n = existingIds.length + 1;
    let id = `${prefix}${String(n).padStart(3, '0')}`;
    while (existingIds.includes(id)) { n++; id = `${prefix}${String(n).padStart(3, '0')}`; }
    return id;
};

export const normalizeStr = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, (c) => c === 'đ' ? 'd' : 'D').toLowerCase();

export const toSlug = (s: string) =>
    normalizeStr(s).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const TAG_COLORS = [
    'blue', 'cyan', 'green', 'orange', 'red', 'purple', 'magenta', 'gold', 'lime', 'geekblue',
];

export const seedTags: TheTag[] = [
    { id: 'tag-1', ten: 'ReactJS', slug: 'reactjs', mauSac: 'blue' },
    { id: 'tag-2', ten: 'TypeScript', slug: 'typescript', mauSac: 'geekblue' },
    { id: 'tag-3', ten: 'CSS', slug: 'css', mauSac: 'cyan' },
    { id: 'tag-4', ten: 'NodeJS', slug: 'nodejs', mauSac: 'green' },
    { id: 'tag-5', ten: 'Ant Design', slug: 'ant-design', mauSac: 'red' },
    { id: 'tag-6', ten: 'UMI', slug: 'umi', mauSac: 'orange' },
    { id: 'tag-7', ten: 'Performance', slug: 'performance', mauSac: 'gold' },
    { id: 'tag-8', ten: 'Tips & Tricks', slug: 'tips-tricks', mauSac: 'purple' },
];

export const seedTacGia: TacGia = {
    ten: 'Lâm Đức Bảo',
    anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
    tieuSu: 'Frontend Developer với 4 năm kinh nghiệm. Đam mê ReactJS, TypeScript và xây dựng trải nghiệm người dùng tuyệt vời. Thích viết blog chia sẻ kiến thức và kinh nghiệm thực chiến.',
    kyNang: ['ReactJS', 'TypeScript', 'NodeJS', 'Ant Design', 'UMI', 'CSS/SCSS', 'Git', 'Docker'],
    mxh: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        website: 'https://myblog.dev',
    },
};

export const seedBaiViets: BaiViet[] = [
    {
        id: 'BV001', tieuDe: 'Hướng dẫn sử dụng React Hooks toàn tập',
        slug: 'huong-dan-react-hooks-toan-tap',
        tomTat: 'Tìm hiểu về useState, useEffect, useCallback, useMemo và cách sử dụng đúng cách để tối ưu performance.',
        noiDung: `# Hướng dẫn sử dụng React Hooks toàn tập\n\nReact Hooks đã thay đổi hoàn toàn cách chúng ta viết component trong React.\n\n## useState\n\n\`useState\` là hook cơ bản nhất dùng để quản lý state trong functional component.\n\n\`\`\`js\nconst [count, setCount] = useState(0);\n\`\`\`\n\n## useEffect\n\nDùng để thực hiện side effects như gọi API, đăng ký event listener...\n\n\`\`\`js\nuseEffect(() => {\n  fetchData();\n}, [dependency]);\n\`\`\`\n\n## useCallback & useMemo\n\nHai hooks này giúp tối ưu hiệu suất bằng cách ghi nhớ (memoize) giá trị hoặc hàm.\n\n## Kết luận\n\nViệc nắm vững React Hooks sẽ giúp bạn viết code sạch và hiệu quả hơn rất nhiều.`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-1', 'tag-2'], trangThai: 'da-dang',
        luotXem: 1240, ngayTao: '2025-01-10', ngayCapNhat: '2025-01-10',
    },
    {
        id: 'BV002', tieuDe: 'TypeScript nâng cao: Generic và Utility Types',
        slug: 'typescript-nang-cao-generic-utility-types',
        tomTat: 'Khám phá sức mạnh của Generic Types, Conditional Types và các Utility Types có sẵn trong TypeScript.',
        noiDung: `# TypeScript nâng cao\n\n## Generic Types\n\nGeneric giúp viết code tái sử dụng mà vẫn type-safe.\n\n\`\`\`ts\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\`\`\`\n\n## Utility Types\n\nTypeScript cung cấp nhiều utility type hữu ích:\n\n- \`Partial<T>\` - tất cả thuộc tính optional\n- \`Required<T>\` - tất cả thuộc tính required\n- \`Pick<T, K>\` - chọn một số thuộc tính\n- \`Omit<T, K>\` - loại bỏ một số thuộc tính\n\n## Kết luận\n\nMastering TypeScript generics là bước tiến lớn trong hành trình lập trình.`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-2', 'tag-8'], trangThai: 'da-dang',
        luotXem: 980, ngayTao: '2025-01-20', ngayCapNhat: '2025-01-20',
    },
    {
        id: 'BV003', tieuDe: 'Ant Design 5: Những tính năng mới đáng chú ý',
        slug: 'ant-design-5-tinh-nang-moi',
        tomTat: 'Cùng khám phá Design Token, Component API mới và cách migrate từ Ant Design 4 lên 5.',
        noiDung: `# Ant Design 5\n\n## Design Token\n\nAnt Design 5 giới thiệu hệ thống Design Token mạnh mẽ.\n\n## Thay đổi Component\n\nNhiều component đã được cải tiến API.\n\n## Migration Guide\n\nCác bước cơ bản để migrate:\n1. Cập nhật package\n2. Thay thế deprecated APIs\n3. Kiểm tra visual regression`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-5', 'tag-1'], trangThai: 'da-dang',
        luotXem: 756, ngayTao: '2025-02-05', ngayCapNhat: '2025-02-05',
    },
    {
        id: 'BV004', tieuDe: 'CSS Grid Layout: Xây dựng layout phức tạp dễ dàng',
        slug: 'css-grid-layout-xay-dung-layout',
        tomTat: 'Hướng dẫn toàn diện về CSS Grid từ cơ bản đến nâng cao với các ví dụ thực tế.',
        noiDung: `# CSS Grid Layout\n\n## Khái niệm cơ bản\n\nCSS Grid là hệ thống layout 2 chiều mạnh mẽ nhất hiện nay.\n\n\`\`\`css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\`\`\`\n\n## Grid Areas\n\nĐặt tên cho các vùng layout rất trực quan.\n\n## Responsive\n\nKết hợp với media query để tạo responsive layout hoàn hảo.`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-3', 'tag-8'], trangThai: 'da-dang',
        luotXem: 620, ngayTao: '2025-02-15', ngayCapNhat: '2025-02-15',
    },
    {
        id: 'BV005', tieuDe: 'UMI 3: Cấu hình và tối ưu dự án thực tế',
        slug: 'umi-3-cau-hinh-toi-uu',
        tomTat: 'Hướng dẫn cấu hình UMI 3 cho dự án enterprise: routing, plugin, proxy và deploy.',
        noiDung: `# UMI 3 Configuration\n\n## Routing\n\nUMI 3 hỗ trợ convention-based routing rất tiện lợi.\n\n## Plugin System\n\nHệ thống plugin mạnh mẽ giúp mở rộng chức năng.\n\n## Proxy Configuration\n\n\`\`\`ts\nproxy: {\n  '/api': {\n    target: 'http://localhost:8080',\n    changeOrigin: true,\n  },\n}\n\`\`\``,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-6', 'tag-1'], trangThai: 'da-dang',
        luotXem: 543, ngayTao: '2025-03-01', ngayCapNhat: '2025-03-01',
    },
    {
        id: 'BV006', tieuDe: 'NodeJS Performance: Tối ưu API cho hàng triệu request',
        slug: 'nodejs-performance-toi-uu-api',
        tomTat: 'Các kỹ thuật tối ưu NodeJS API: caching, clustering, connection pooling và profiling.',
        noiDung: `# NodeJS Performance\n\n## Caching Strategy\n\nSử dụng Redis để cache dữ liệu thường xuyên truy cập.\n\n## Clustering\n\n\`\`\`js\nconst cluster = require('cluster');\nconst numCPUs = require('os').cpus().length;\n\`\`\`\n\n## Connection Pooling\n\nQuản lý database connection hiệu quả.`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-4', 'tag-7'], trangThai: 'da-dang',
        luotXem: 890, ngayTao: '2025-03-10', ngayCapNhat: '2025-03-10',
    },
    {
        id: 'BV007', tieuDe: '10 Tips React mà mọi developer cần biết',
        slug: '10-tips-react-developer-can-biet',
        tomTat: 'Các mẹo hay giúp viết React code hiệu quả hơn, ít bug hơn và dễ maintain hơn.',
        noiDung: `# 10 Tips React\n\n## 1. Dùng React.memo đúng chỗ\n\nChỉ wrap component bằng memo khi thực sự cần thiết.\n\n## 2. Custom hooks\n\nTách logic phức tạp thành custom hooks để tái sử dụng.\n\n## 3. Lazy loading\n\nDùng React.lazy và Suspense để code splitting.\n\n## 4. Error Boundary\n\nLuôn có error boundary để catch lỗi trong production.`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-1', 'tag-8', 'tag-7'], trangThai: 'da-dang',
        luotXem: 1560, ngayTao: '2025-03-20', ngayCapNhat: '2025-03-20',
    },
    {
        id: 'BV008', tieuDe: 'Xây dựng Design System với Ant Design Token',
        slug: 'xay-dung-design-system-ant-design-token',
        tomTat: 'Cách tạo Design System nhất quán cho dự án lớn sử dụng Ant Design 5 Token System.',
        noiDung: `# Design System với Ant Design\n\n## Token System\n\nAnt Design 5 cung cấp hệ thống token 3 cấp.\n\n## Customization\n\n\`\`\`tsx\n<ConfigProvider\n  theme={{\n    token: {\n      colorPrimary: '#1677ff',\n    },\n  }}\n>\n  <App />\n</ConfigProvider>\n\`\`\`\n\n## Component-level Token\n\nMỗi component cũng có token riêng để customize chi tiết.`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-5', 'tag-3'], trangThai: 'da-dang',
        luotXem: 678, ngayTao: '2025-04-01', ngayCapNhat: '2025-04-01',
    },
    {
        id: 'BV009', tieuDe: 'Git Workflow cho team lớn',
        slug: 'git-workflow-cho-team-lon',
        tomTat: 'Hướng dẫn thiết lập Git workflow hiệu quả: branching strategy, commit convention và code review.',
        noiDung: `# Git Workflow\n\n## Branching Strategy\n\nGitFlow vs GitHub Flow vs Trunk-based Development.\n\n## Commit Convention\n\nDùng Conventional Commits để tạo changelog tự động.\n\n\`\`\`\nfeat: add login feature\nfix: resolve memory leak\ndocs: update README\n\`\`\`\n\n## Code Review\n\nBest practices để review code hiệu quả và xây dựng culture tốt.`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-8'], trangThai: 'da-dang',
        luotXem: 445, ngayTao: '2025-04-10', ngayCapNhat: '2025-04-10',
    },
    {
        id: 'BV010', tieuDe: 'Bài viết nháp: Zustand vs Redux',
        slug: 'zustand-vs-redux',
        tomTat: 'So sánh Zustand và Redux Toolkit cho state management trong React.',
        noiDung: `# Zustand vs Redux\n\n## Redux Toolkit\n\nRTK đã làm Redux đơn giản hơn rất nhiều.\n\n## Zustand\n\nZustand là lựa chọn nhẹ nhàng và đơn giản hơn.\n\n*(Đang viết...)*`,
        anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-1', 'tag-2'], trangThai: 'nhap',
        luotXem: 0, ngayTao: '2025-04-15', ngayCapNhat: '2025-04-15',
    },
];