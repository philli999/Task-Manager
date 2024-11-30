import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return  (
    <div className="flex  h-screen">
      {/* Navigation Bar */}
      <nav className="w-64 bg-dark p-5">
        <ul className="space-y-2">
        <li>
            <Link
              to="/"
              className="block px-4 py-2 text-primary hover:text-accent"
            >
              Start
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className="block px-4 py-2 text-primary hover:text-accent"
            >
              Tasks
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-5 bg-muted text-primary">
        <Outlet />
      </main>
    </div>
  );;
}
