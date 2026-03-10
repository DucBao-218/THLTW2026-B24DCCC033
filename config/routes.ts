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
