import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { sb } from "./src/lib/supabaseClient";

/* ---------- local shim: only for remembering "who am I on this device" ---------- */
const storage = {
  async get(key) {
    try { const v = localStorage.getItem("pm_" + key); if (v === null) return null; return { key, value: v }; }
    catch (e) { return null; }
  },
  async set(key, value) {
    try { localStorage.setItem("pm_" + key, value); return { key, value }; }
    catch (e) { return null; }
  },
};

/* ---------- mappers between JS objects and Supabase table rows ---------- */
function normalizeItemCategory(row) {
  const v = row.item_category;
  if (ITEM_CATEGORIES.includes(v)) return v;
  if (v === "ماشین‌آلات و تجهیزات پلیمری") return ITEM_CATEGORIES[2];
  if (row.machine_type) return ITEM_CATEGORIES[2];
  if (row.sub_category === "محصول پلاستیکی") return ITEM_CATEGORIES[1];
  return ITEM_CATEGORIES[0];
}
function rowToListing(row) {
  return {
    id: row.id, title: row.title, polymer: row.polymer, customPolymer: row.custom_polymer || "", condition: row.condition,
    qty: row.qty, price: Number(row.price) || 0, unit: row.unit, province: row.province,
    city: row.city || "", seller: row.seller_name, phone: row.phone, verified: !!row.verified, featured: !!row.featured,
    sellerUid: row.seller_id, created: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    desc: row.description, images: row.images || [],
    adType: row.ad_type || "فروش", subCategory: row.sub_category || "", usageCategory: row.usage_category || "",
    recycledForm: row.recycled_form || "", negotiable: !!row.negotiable,
    itemCategory: normalizeItemCategory(row), machineType: row.machine_type || "", machineBrand: row.machine_brand || "",
  };
}
function listingToRow(l) {
  return {
    title: l.title, polymer: l.polymer, custom_polymer: l.polymer === "OTHER" ? (l.customPolymer || "") : "", condition: l.condition, qty: l.qty, price: l.price,
    unit: l.unit, province: l.province, city: l.city || "", seller_name: l.seller, phone: l.phone,
    verified: l.verified, featured: l.featured, seller_id: l.sellerUid, description: l.desc,
    images: l.images || [],
    ad_type: l.adType || "فروش", sub_category: l.subCategory || "", usage_category: l.usageCategory || "",
    recycled_form: l.recycledForm || "", negotiable: !!l.negotiable,
    item_category: l.itemCategory || ITEM_CATEGORIES[0], machine_type: l.machineType || "", machine_brand: l.machineBrand || "",
  };
}

/* ---------- database layer (real, shared across every user) ---------- */
const db = {
  lastError: null,
  async listListings() {
    const { data, error } = await sb.from("listings").select("*").order("created_at", { ascending: false });
    if (error) { console.error("listListings", error); db.lastError = error; return []; }
    return (data || []).map(rowToListing);
  },
  async insertListing(listing) {
    const { data, error } = await sb.from("listings").insert([listingToRow(listing)]).select().single();
    if (error) { console.error("insertListing", error); db.lastError = error; return null; }
    db.lastError = null;
    return rowToListing(data);
  },
  async updateListing(id, listing) {
    const { data, error } = await sb.from("listings").update(listingToRow(listing)).eq("id", id).select().single();
    if (error) { console.error("updateListing", error); db.lastError = error; return null; }
    db.lastError = null;
    return rowToListing(data);
  },
  async deleteListing(id) {
    const { error } = await sb.from("listings").delete().eq("id", id);
    if (error) { console.error("deleteListing", error); db.lastError = error; return false; }
    db.lastError = null;
    return true;
  },
  async createReport(report) {
    const { error } = await sb.from("reports").insert([{
      listing_id: report.listingId, listing_title: report.listingTitle, reason: report.reason,
      details: report.details || "", reporter_phone: report.reporterPhone || "",
    }]);
    if (error) { console.error("createReport", error); db.lastError = error; return false; }
    db.lastError = null;
    return true;
  },
  async upsertProfile(profile) {
    const { data: existing, error: findErr } = await sb.from("profiles")
      .select("*").eq("phone", profile.phone)
      .order("created_at", { ascending: true }).limit(1).maybeSingle();
    if (findErr) { console.error("findProfile", findErr); }
    if (existing) {
      const { data, error } = await sb.from("profiles")
        .update({ name: profile.name, company: profile.company })
        .eq("id", existing.id).select().single();
      if (error) { console.error("updateProfile", error); return existing; }
      return data;
    }
    const { data, error } = await sb.from("profiles")
      .insert([{ name: profile.name, phone: profile.phone, company: profile.company, referred_by: profile.referredBy || null }])
      .select().single();
    if (error) { console.error("insertProfile", error); db.lastError = error; return null; }
    db.lastError = null;
    return data;
  },
  async getSubscription(userId) {
    const { data, error } = await sb.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
    if (error) { console.error("getSubscription", error); return null; }
    return data;
  },
  async upsertSubscription(userId, plan) {
    const { data, error } = await sb.from("subscriptions")
      .upsert({ user_id: userId, plan, since: new Date().toISOString() }, { onConflict: "user_id" })
      .select().single();
    if (error) { console.error("upsertSubscription", error); return null; }
    return data;
  },
  async listInvoices(userId) {
    const { data, error } = await sb.from("invoices").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) { console.error("listInvoices", error); return []; }
    return data || [];
  },
  async countReferrals(userId) {
    const { count, error } = await sb.from("profiles").select("id", { count: "exact", head: true }).eq("referred_by", userId);
    if (error) { console.error("countReferrals", error); return 0; }
    return count || 0;
  },
  async insertInvoice(inv) {
    const { error } = await sb.from("invoices").insert([inv]);
    if (error) { console.error("insertInvoice", error); return false; }
    return true;
  },
};

/* ---------- icons ---------- */
const ICONS = {
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
