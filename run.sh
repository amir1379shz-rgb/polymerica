#!/bin/bash
set -euo pipefail

BRANCH="refactor/full-improvement"

echo "اطمینان از آدرس ریموت و شاخه..."
git fetch origin
if git show-ref --verify --quiet refs/heads/"$BRANCH"; then
  git checkout "$BRANCH"
else
  git checkout -B "$BRANCH" origin/"$BRANCH" || git checkout -B "$BRANCH"
fi

echo "ایجاد فایل‌ها..."

cat > .eslintrc.json <<'JSON'
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["react", "jsx-a11y"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react/prop-types": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
JSON

cat > .prettierrc <<'JSON'
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "avoid"
}
JSON

mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'YML'
name: CI

on:
  push:
    branches: [ main, refactor/full-improvement ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: |
          npm run lint --if-present || npx eslint "src/**/*.{js,jsx}" || true
      - name: Build
        run: npm run build --if-present || true
YML

mkdir -p src/components src/hooks

cat > src/components/PostAdForm.jsx <<'JS'
import React, { useState } from 'react';
import { db } from '../lib/db';

export default function PostAdForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', price: '', qty: '', unit: 'kg', province: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const newRow = await db.insertListing({
        title: form.title,
        price: Number(form.price) || 0,
        qty: Number(form.qty) || 0,
        unit: form.unit,
        province: form.province,
        images: []
      });
      if (onSubmit) onSubmit(newRow);
    } catch (err) {
      console.error(err);
      setError('خطا در ثبت آگهی');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded-pm border">
      <div>
        <label className="block text-sm font-medium">عنوان</label>
        <input value={form.title} onChange={set('title')} className="pm-input mt-1" placeholder="عنوان آگهی" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium">قیمت</label>
          <input value={form.price} onChange={set('price')} className="pm-input mt-1" placeholder="قیمت به تومان" />
        </div>
        <div>
          <label className="block text-sm font-medium">مقدار</label>
          <input value={form.qty} onChange={set('qty')} className="pm-input mt-1" placeholder="مقدار" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-red-600">{error}</div>
        <button type="submit" disabled={submitting} className="pm-btn-primary px-4 py-2 rounded-pm">{submitting ? 'در حال ارسال...' : 'ارسال آگهی'}</button>
      </div>
    </form>
  );
}
JS

cat > src/components/DetailModal.jsx <<'JS'
import React from 'react';

export default function DetailModal({ listing, onClose }) {
  if (!listing) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-pm max-w-2xl w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{listing.title}</h3>
          <button onClick={onClose} className="text-gray-500">بستن</button>
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-700">{listing.desc}</div>
          <div className="mt-4">قیمت: {new Intl.NumberFormat('fa-IR').format(listing.price)} تومان</div>
        </div>
      </div>
    </div>
  );
}
JS

cat > src/hooks/useAuth.js <<'JS'
import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const s = localStorage.getItem('pm_user');
      if (s) setUser(JSON.parse(s));
    } catch (e) { }
  }, []);

  const login = async (profile) => {
    localStorage.setItem('pm_user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  };
  const logout = async () => {
    localStorage.removeItem('pm_user');
    setUser(null);
  };

  return { user, login, logout };
}
JS

echo "فایل‌ها ساخته شدند."

echo "می‌خواهید dev-dependencies (eslint, prettier و پلاگین‌ها) را نصب کنم؟ (y/N)"
read -r ans || ans="n"
if [[ "$ans" == "y" || "$ans" == "Y" ]]; then
  npm install -D eslint prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-prettier
fi

git add .eslintrc.json .prettierrc .github/workflows/ci.yml src/components/PostAdForm.jsx src/components/DetailModal.jsx src/hooks/useAuth.js || true
git commit -m "chore(ci+ui): add ESLint/Prettier, CI workflow and remaining UI components" || echo "no changes to commit"
echo "در حال push به origin/$BRANCH ..."
git push origin "$BRANCH"
echo "انجام شد."
// noop
