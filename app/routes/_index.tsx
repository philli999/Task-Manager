// app/routes/_index.jsx or _index.tsx

import { Link, Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome to the Group-Work Manager!</h1>
      <p className="mt-4 text-lg">
        Use the navigation bar to explore the app.
      </p>
    </div>
  )
}
