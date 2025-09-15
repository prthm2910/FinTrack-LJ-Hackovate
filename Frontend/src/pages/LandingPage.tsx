// src/pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div
            className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white font-sans text-slate-900 group/design-root"
            style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
        >
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/">
                        <div className="flex items-center gap-3">
                            <svg
                                className="h-8 w-8 text-primary-500"
                                fill="none"
                                viewBox="0 0 48 48"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <g clipPath="url(#clip0_6_543)">
                                    <path
                                        d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                                        fill="currentColor"
                                    ></path>
                                    <path
                                        clipRule="evenodd"
                                        d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    ></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_6_543">
                                        <rect fill="white" height="48" width="48"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                            <h1 className="text-2xl font-bold text-slate-800">Financio</h1>
                        </div>
                    </Link>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex"></nav>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="hidden text-sm font-bold text-slate-600 transition-colors hover:text-primary-500 sm:block"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-md bg-primary-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero section */}
                <section
                    className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 text-white"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmdlDrvMvESltFkAl8rw_B7DlMQr0Hqjo-E1y-jxEvXkvEMgBdb4C6DxfucsPZtfaXtc2pkxnDWhPi344LTqRQKy-6M4VAYQnhsEmEhG-JSKnhl5qJsP8cbznyDclNchIN83NNyoKOIjLc4bwfB6QU-5z2FgCJMfWwITXuorC_x-t6cRE76hJ2i5_kFo-vT5G0AwZkwMOtgCsEev4_vM1Q28a3Iufo61bSxJ7NK3bjuEFRebg9b_u2k1_MycnEpM_x4bLQ4EdScMDt")',
                    }}
                >
                    <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Take Control of Your Finances
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200">
                            Financio helps you manage your money, track your spending, and achieve your financial goals with ease.
                        </p>
                        <Link
                            to="/login"
                            className="mt-8 inline-block rounded-md bg-primary-500 px-8 py-3 text-base font-bold text-white transition-colors hover:bg-primary-600"
                        >
                            Get Started for Free
                        </Link>
                    </div>
                </section>

                {/* Features section */}
                <section className="py-20 sm:py-24" id="features">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                                Key Features
                            </h2>
                            <p className="mt-4 text-lg text-slate-600">
                                Explore the powerful features that make Financio your ultimate financial companion.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: 'account_balance_wallet',
                                    title: 'Smart Budgeting',
                                    description:
                                        'Create and manage budgets effortlessly to stay on top of your spending and savings.',
                                },
                                {
                                    icon: 'trending_up',
                                    title: 'Investment Tracking',
                                    description:
                                        'Monitor your investments and portfolio performance in real-time with insightful analytics.',
                                },
                                {
                                    icon: 'verified_user',
                                    title: 'Secure Transactions',
                                    description:
                                        'Enjoy bank-level security and encrypted transactions for complete peace of mind.',
                                },
                            ].map(({ icon, title, description }) => (
                                <div
                                    key={title}
                                    className="flex flex-col items-center gap-4 rounded-lg bg-slate-50 p-8 text-center shadow-sm transition-shadow hover:shadow-lg"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                                        <span className="material-symbols-outlined">{icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                                    <p className="text-slate-600">{description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Us */}
                <section className="bg-slate-50 py-20 sm:py-24" id="about">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                                About Us
                            </h2>
                            <p className="mt-4 text-lg text-slate-600">
                                At Financio, we're passionate about empowering individuals to achieve financial freedom.
                                Our team of experts is dedicated to providing innovative solutions and personalized support
                                to help you succeed on your financial journey.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to action */}
                <section className="py-20 sm:py-24">
                    <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                            Ready to Transform Your Financial Future?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                            Join thousands of users who are already benefiting from Financio's powerful features.
                        </p>
                        <Link
                            to="/signup"
                            className="mt-8 inline-block rounded-md bg-primary-500 px-8 py-3 text-base font-bold text-white transition-colors hover:bg-primary-600"
                        >
                            Sign Up Now
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-100">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
                            <a className="transition-colors hover:text-primary-500" href="#">
                                Privacy Policy
                            </a>
                            <a className="transition-colors hover:text-primary-500" href="#">
                                Terms of Service
                            </a>
                            <a className="transition-colors hover:text-primary-500" href="#">
                                Contact Us
                            </a>
                        </nav>
                        <p className="text-sm text-slate-600">© 2025 Financio. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
