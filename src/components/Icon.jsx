const ICONS = {
    dashboard: <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" />,
    briefcase: <path d="M3 7h18v13H3zM8 7V4h8v3M3 13h18" />,
    users: (
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    ),
    clipboard: <path d="M9 3h6v4H9zM9 5H5v16h14V5h-4M9 12h6M9 16h6" />,
    mail: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
    settings: (
        <>
            <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
            <circle cx="15" cy="6" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="17" cy="18" r="2" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
        </>
    ),
    pin: (
        <>
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    edit: <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />,
    trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
    eye: (
        <>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
        </>
    ),
    x: <path d="M6 6l12 12M18 6L6 18" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    check: <path d="M5 12l5 5L20 7" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    back: <path d="M19 12H5M11 6l-6 6 6 6" />,
    external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
    refresh: <path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4" />,
    file: <path d="M6 3h8l5 5v13H6zM14 3v5h5" />,
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    copy: <path d="M9 9h11v11H9zM5 15H4V4h11v1" />,
    upload: <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />,
    send: <path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" />,
    calendar: <path d="M4 6h16v15H4zM4 10h16M8 3v4M16 3v4" />,
    alert: (
        <>
            <path d="M12 3l10 18H2L12 3z" />
            <path d="M12 10v5M12 18v.5" />
        </>
    ),
    inbox: <path d="M3 13l3-8h12l3 8v6H3v-6zM3 13h5l1 3h6l1-3h5" />,
};

export default function Icon({ name, size = 18, className = "" }) {
    return (
        <svg
            className={`icon ${className}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {ICONS[name]}
        </svg>
    );
}
