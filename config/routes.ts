import path from "path";

export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user/login',
                layout: false,
                name: 'login',
                component: './user/Login',
            },
            {
                path: '/user',
                redirect: '/user/login',
            },
        ],
    },

    ///////////////////////////////////
    // DEFAULT MENU
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: './TrangChu',
        icon: 'HomeOutlined',
    },
    {
        path: '/gioi-thieu',
        name: 'About',
        component: './TienIch/GioiThieu',
        hideInMenu: true,
    },
    {
        path: '/random-user',
        name: 'RandomUser',
        component: './RandomUser',
        icon: 'ArrowsAltOutlined',
    },
    {
        path: '/todo-list',
        name: 'TodoList',
        icon: 'OrderedListOutlined',
        component: './TodoList',
    },

    {
        path: '/product',
        name: 'Sản phẩm và đơn hàng',
        icon: 'AppstoreOutlined',
        component: './Product',
    },
    {
        path: '/statistics',
        name: 'Thống kê',
        icon: 'BarChartOutlined',
        component: './Dashboard',
    },
    {
        path: '/game',
        name: 'Trò chơi',
        icon: 'RocketOutlined',
        component: './Game',
    },
    {
        path: '/study',
        name: 'Học tập',
        icon: 'BookOutlined',
        component: './Study',
    },
    {
        path: '/game-oan-tu-ti',
        name: 'Oẳn tù tì',
        icon: 'TrophyOutlined',
        component: './OanTuTi',
    },
    {
        path: '/questionBank',
        name: 'Ngân hàng câu hỏi',
        icon: 'QuestionCircleOutlined',
        component: './QuestionBank',
    },
    {
        path: '/dich-vu',
        name: 'Quản lý dịch vụ',
        icon: 'SettingOutlined',
        component: './DichVu/_layout',
        routes: [
            {
                path: '/dich-vu/nhan-vien',
                name: 'Nhân viên',
                component: './DichVu/NhanVien',
            },
            {
                path: '/dich-vu/dich-vu',
                name: 'Dịch vụ',
                component: './DichVu/DichVu',
            },
            {
                path: '/dich-vu/lich-hen',
                name: 'Lịch hẹn',
                component: './DichVu/LichHen',
            },
            {
                path: '/dich-vu/thong-ke',
                name: 'Thống kê',
                component: './DichVu/ThongKe',
            },
        ],
    },
    {
        path: '/van-bang',
        name: 'Quản lý văn bằng',
        icon: 'BookOutlined',
        component: './VanBang/_layout',
        routes: [
            {
                path: '/van-bang/so-van-bang',
                name: 'Sổ văn bằng',
                component: './VanBang/SoVanBang',
            },
            {
                path: '/van-bang/quyet-dinh',
                name: 'Quyết định tốt nghiệp',
                component: './VanBang/QuyetDinh',
            },
            {
                path: '/van-bang/cau-hinh-bieu-mau',
                name: 'Cấu hình biểu mẫu',
                component: './VanBang/CauHinhBieuMau',
            },
            {
                path: '/van-bang/danh-sach',
                name: 'Danh sách văn bằng',
                component: './VanBang/DanhSachVanBang',
            },
            {
                path: '/van-bang/tra-cuu',
                name: 'Tra cứu văn bằng',
                component: './VanBang/TraCuu',
            },
            {
                path: '/van-bang/thong-ke',
                name: 'Thống kê',
                component: './VanBang/ThongKe',
            },
        ],
    },
    {
        path: '/cau-lac-bo',
        name: 'Quản lý câu lạc bộ',
        icon: 'TeamOutlined',
        component: './CauLacBo/_layout',
        routes: [
            {
                path: '/cau-lac-bo/danh-sach',
                name: 'Danh sách CLB',
                component: './CauLacBo/DanhSachCLB',
            },
            {
                path: '/cau-lac-bo/don-dang-ky',
                name: 'Đơn đăng ký',
                component: './CauLacBo/DonDangKy',
            },
            {
                path: '/cau-lac-bo/thanh-vien',
                name: 'Thành viên CLB',
                component: './CauLacBo/ThanhVien',
            },
            {
                path: '/cau-lac-bo/bao-cao',
                name: 'Báo cáo thống kê',
                component: './CauLacBo/BaoCaoThongKe',
            },
        ],
    },
    {
        path: '/du-lich',
        name: 'Lập kế hoạch du lịch',
        icon: 'CompassOutlined',
        component: './DuLich/_layout',
        routes: [
            {
                path: '/du-lich/kham-pha',
                name: 'Khám phá điểm đến',
                component: './DuLich/KhamPha',
            },
            {
                path: '/du-lich/lich-trinh',
                name: 'Lịch trình du lịch',
                component: './DuLich/LichTrinh',
            },
            {
                path: '/du-lich/ngan-sach',
                name: 'Quản lý ngân sách',
                component: './DuLich/NganSach',
            },
            {
                path: '/du-lich/admin',
                name: 'Quản trị',
                icon: 'SettingOutlined',
                routes: [
                    {
                        path: '/du-lich/admin/diem-den',
                        name: 'Quản lý điểm đến',
                        component: './DuLich/Admin/QuanLyDiemDen',
                    },
                    {
                        path: '/du-lich/admin/thong-ke',
                        name: 'Thống kê báo cáo',
                        component: './DuLich/Admin/ThongKe',
                    },
                ],
            },
        ],
    },
    {
        path: '/khoa-hoc',
        name: 'Quản lý khóa học',
        icon: 'ReadOutlined',
        component: './KhoaHoc/index',
    },
    {
        path: '/blog',
        name: 'Blog',
        icon: 'EditOutlined',
        component: './Blog/_layout',
        routes: [
            {
                path: '/blog/trang-chu',
                name: 'Trang chủ Blog',
                component: './Blog/TrangChu',
            },
            {
                path: '/blog/bai-viet/:slug',
                component: './Blog/ChiTietBaiViet',
                hideInMenu: true,
            },
            {
                path: '/blog/gioi-thieu',
                name: 'Giới thiệu',
                component: './Blog/GioiThieu',
            },
            {
                path: '/blog/quan-ly-bai-viet',
                name: 'Quản lý bài viết',
                component: './Blog/QuanLyBaiViet',
            },
            {
                path: '/blog/quan-ly-tag',
                name: 'Quản lý thẻ',
                component: './Blog/QuanLyTag',
            },
        ],
    },
    {
        path: '/the-thao',
        name: 'Thể dục & Sức khỏe',
        icon: 'HeartOutlined',
        component: './TheThao/_layout',
        routes: [
            {
                path: '/the-thao/dashboard',
                name: 'Trang chủ ',
                component: './TheThao/Dashboard',
            },
            {
                path: '/the-thao/nhat-ky-tap-luyen',
                name: 'Nhật ký tập luyện',
                component: './TheThao/NhatKyTapLuyen',
            },
            {
                path: '/the-thao/nhat-ky-chi-so',
                name: 'Nhật ký chỉ số',
                component: './TheThao/NhatKyChiSo',
            },
            {
                path: '/the-thao/muc-tieu',
                name: 'Mục tiêu',
                component: './TheThao/MucTieu',
            },
            {
                path: '/the-thao/thu-vien-bai-tap',
                name: 'Thư viện bài tập',
                component: './TheThao/ThuVienBaiTap',
            },
        ],
    },
    {
        path: '/quan-ly-cong-viec',
        name: 'Quản lý công việc',
        icon: 'ProjectOutlined',
        component: './QuanLyCongViec/_layout',
        routes: [
            {
                path: '/quan-ly-cong-viec/dashboard',
                name: 'Tổng quan',
                component: './QuanLyCongViec/Dashboard',
            },
            {
                path: '/quan-ly-cong-viec/kanban',
                name: 'Kanban Board',
                component: './QuanLyCongViec/KanbanBoard',
            },
            {
                path: '/quan-ly-cong-viec/danh-sach',
                name: 'Danh sách task',
                component: './QuanLyCongViec/DanhSachTask',
            },
        ],
    },

    // DANH MUC HE THONG
    // {
    //  name: 'DanhMuc',
    //  path: '/danh-muc',
    //  icon: 'copy',
    //  routes: [
    //      {
    //          name: 'ChucVu',
    //          path: 'chuc-vu',
    //          component: './DanhMuc/ChucVu',
    //      },
    //  ],
    // },

    {
        path: '/notification',
        routes: [
            {
                path: './subscribe',
                exact: true,
                component: './ThongBao/Subscribe',
            },
            {
                path: './check',
                exact: true,
                component: './ThongBao/Check',
            },
            {
                path: './',
                exact: true,
                component: './ThongBao/NotifOneSignal',
            },
        ],
        layout: false,
        hideInMenu: true,
    },
    {
        path: '/',
    },
    {
        path: '/403',
        component: './exception/403/403Page',
        layout: false,
    },
    {
        path: '/hold-on',
        component: './exception/DangCapNhat',
        layout: false,
    },
    {
        component: './exception/404',
    },
];
