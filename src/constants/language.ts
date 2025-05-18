export type LanguageCode = 'en' | 'vi';

export interface LanguageContent {
    // Header
    appName: string;
    searchPlaceholder: string;
    user: string;
    authTitle: string;
    logout: string;

    // Sidebar
    home: string;
    movies: string;
    tvShows: string;
    music: string;
    photos: string;
    settings: string;

    // Hero Section
    welcomeBack: string;
    continueWatchingPrompt: string;

    // Content Rows
    continueWatching: string;
    recentlyAdded: string;
    viewAll: string;
    new: string;

    // Time indicators
    daysAgo: (days: number) => string;
    hoursAgo: (hours: number) => string;
    justNow: string;

    // Footer
    copyright: (year: number) => string;
    about: string;
    privacy: string;
    terms: string;

    // Movie Detail Modal
    play: string;
    close: string;
    cast: string;
    episodes: string;

    // Auth Detail Model
    signInTitle: string;
    signInChange: string;
    signInButton: string;
    signIn_email: string;
    signIn_password: string;

    signUpTitle: string;
    signUpChange: string;
    signUpButton: string;
    signUp_name: string;
    signUp_email: string;
    signUp_password: string;
    signUp_repassword: string;

    // Error
    genericError: string;
    networkError: string;
    loginSuccess: string;
    passwordMismatch: string;
    registrationSuccess: string;
    registrationFailed: string;

    // Tabs
    tabAdmin: string;
    tabSetting: string;

    genres: string;
    country: string;
    releaseDate: string;
    director: string;
    overview: string;
    noOverviewAvailable: string

    unknownTitle: string
    notAvailable: string
    noCastAvailable: string
}

export const EN: LanguageContent = {
    // Header
    appName: 'NETTUBE',
    searchPlaceholder: 'Search...',
    user: 'User',
    authTitle: 'Member',
    logout: 'Logout',

    // Sidebar
    home: 'Home',
    movies: 'Movies',
    tvShows: 'TV Shows',
    music: 'Music',
    photos: 'Photos',
    settings: 'Settings',

    // Hero Section
    welcomeBack: 'Welcome back',
    continueWatchingPrompt: 'Continue watching where you left off',

    // Content Rows
    continueWatching: 'Continue Watching',
    recentlyAdded: 'Recently Added',
    viewAll: 'View All',
    new: 'New',

    // Time indicators
    daysAgo: (days) => `${days} days ago`,
    hoursAgo: (hours) => `${hours} hours ago`,
    justNow: 'Just now',

    // Footer
    copyright: (year) => `© ${year} NETTUBE`,
    about: 'About',
    privacy: 'Privacy',
    terms: 'Terms',

    // Movie Detail Modal
    play: 'Play',
    close: 'Close',
    cast: 'Cast',
    episodes: 'Episodes',

    // Auth Detail Model
    signInTitle: 'Sign In',
    signInChange: "Don't have an account? ",
    signInButton: 'Sign In',
    signIn_email: 'Enter email',
    signIn_password: 'Enter password',

    signUpTitle: 'Create Account',
    signUpChange: 'Already have an account? ',
    signUpButton: 'Sign Up',
    signUp_name: 'Enter your display name',
    signUp_email: 'Enter your email',
    signUp_password: 'Enter the password',
    signUp_repassword: 'Re-enter your password',

    // Error
    genericError: 'Interal Error Occurs ',
    networkError: 'Network Error Occurs ',
    loginSuccess: 'Login Success',
    passwordMismatch: 'Password is Wrong ',
    registrationSuccess: 'Register Success',
    registrationFailed: 'Register Falied ',

    // Tabs
    tabAdmin: 'Admin',
    tabSetting: 'Setting',

    genres: 'Genres',
    country: 'Country',
    releaseDate: 'Release Date',
    director: 'Director',
    overview: 'Overview',
    noOverviewAvailable: 'No overview available',

    unknownTitle: 'Unknown Title',
    notAvailable: 'Not Available',
    noCastAvailable: 'No cast information available'

};

export const VI: LanguageContent = {
    // Header
    appName: 'NETTUBE',
    searchPlaceholder: 'Tìm kiếm...',
    user: 'Người dùng',
    authTitle: 'Thành viên',
    logout: 'Đăng xuất',

    // Sidebar
    home: 'Trang chủ',
    movies: 'Phim',
    tvShows: 'Chương trình TV',
    music: 'Âm nhạc',
    photos: 'Hình ảnh',
    settings: 'Cài đặt',

    // Hero Section
    welcomeBack: 'Chào mừng trở lại',
    continueWatchingPrompt: 'Tiếp tục xem từ nơi bạn đã dừng',

    // Content Rows
    continueWatching: 'Đang xem',
    recentlyAdded: 'Mới thêm gần đây',
    viewAll: 'Xem tất cả',
    new: 'Mới',

    // Time indicators
    daysAgo: (days) => `${days} ngày trước`,
    hoursAgo: (hours) => `${hours} giờ trước`,
    justNow: 'Vừa mới đây',

    // Footer
    copyright: (year) => `© ${year} NETTUBE`,
    about: 'Giới thiệu',
    privacy: 'Quyền riêng tư',
    terms: 'Điều khoản',

    // Movie Detail Modal
    play: 'Phát',
    close: 'Đóng',
    cast: 'Diễn viên',
    episodes: 'Tập phim',

    // Auth Detail Model
    signInTitle: 'Đăng Nhập',
    signInChange: "Bạn chưa có tài khoản? ",
    signInButton: 'Đăng nhập',
    signIn_email: 'Hãy điền Email đăng nhập',
    signIn_password: 'Mật khẩu',

    signUpTitle: 'Tạo Tài Khoản Mới',
    signUpChange: 'Đã đăng ký tài khoản? ',
    signUpButton: 'Tạo tài khoản',
    signUp_name: 'Hãy nhập tên hiển thị',
    signUp_email: 'Hãy nhập địa chỉ email',
    signUp_password: 'Mật khẩu',
    signUp_repassword: 'Nhập lại Mật khẩu',

    // Error
    genericError: 'Đã xảy ra lỗi ở server ',
    networkError: 'Đã xảy ra lỗi kết nối ',
    loginSuccess: 'Đăng nhập Thành Công ',
    passwordMismatch: 'Tài khoản và Mật khẩu không trùng khớp ',
    registrationSuccess: 'Đăng ký tài khoản Thành Công ',
    registrationFailed: 'Đăng ký tài khoản Thất Bại ',

    // Tabs
    tabAdmin: 'Admin',
    tabSetting: 'Cài đặt',

    genres: 'Thể loại',
    country: 'Quốc gia',
    releaseDate: 'Ngày phát hành',
    director: 'Đạo diễn',
    overview: 'Tóm tắt',
    noOverviewAvailable: 'Không có tóm tắt',

    unknownTitle: 'Tiêu đề không xác định',
    notAvailable: 'Không có sẵn',
    noCastAvailable: 'Không có thông tin diễn viên'
};

export const LANGUAGES = {
    en: EN,
    vi: VI,
};

export const LANGUAGE_NAMES = {
    en: 'English',
    vi: 'Tiếng Việt',
};
