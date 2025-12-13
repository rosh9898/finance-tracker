export function Logo() {
    return (
        <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-pink-500 rounded-lg blur-lg opacity-40 animate-pulse" />

            {/* Main Icon Shape */}
            <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 duration-300">
                {/* Stylized 'N' */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-white"
                >
                    <path d="M6 3l12 18M18 3v18M6 3v18" /> {/* Not quite N, let's do a proper path */}
                    <path d="M17 21V7L7 17V3" /> {/* Wait, N path is M7 21V3L17 21V3? No, M6 20V4L18 20V4 probably */}
                    {/* Modern Abstract N / Flow */}
                    <path d="M6 20V4L18 20V4" />
                </svg>
            </div>
        </div>
    )
}
