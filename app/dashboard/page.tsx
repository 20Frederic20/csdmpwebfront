'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}