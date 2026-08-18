import { sb } from './supabaseClient';

/* ---------- mappers between JS objects and Supabase table rows ---------- */
function normalizeItemCategory(row) {
  const v = row.item_category;
  const ITEM_CATEGORIES = ["مواد پلیمری و پلاستیک", "محصولات پلیمری", "ماشین‌آلات و دستگاه‌های پلیمری"];
  if (ITEM_CATEGORIES.includes(v)) return v;
  if (v === "ماشین‌آلات و تجهیزات پلیمری") return ITEM_CATEGORIES[2];
  if (row.machine_type) return ITEM_CATEGORIES[2];
  if (row.sub_category === "محصول پلاستیکی") return ITEM_CATEGORIES[1];
  return ITEM_CATEGORIES[0];
}
function rowToListing(row) {
  return {
    id: row.id,
    title: row.title,
    polymer: row.polymer,
    customPolymer: row.custom_polymer || "",
    condition: row.condition,
    qty: row.qty,
    price: Number(row.price) || 0,
    unit: row.unit,
    province: row.province,
    city: row.city || "",
    seller: row.seller_name,
    phone: row.phone,
    verified: !!row.verified,
    featured: !!row.featured,
    sellerUid: row.seller_id,
    created: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    desc: row.description,
    images: row.images || [],
    adType: row.ad_type || "فروش",
    subCategory: row.sub_category || "",
    usageCategory: row.usage_category || "",
    recycledForm: row.recycled_form || "",
    negotiable: !!row.negotiable,
    itemCategory: normalizeItemCategory(row),
    machineType: row.machine_type || "",
    machineBrand: row.machine_brand || "",
  };
}
function listingToRow(l) {
  return {
    title: l.title,
    polymer: l.polymer,
    custom_polymer: l.polymer === "OTHER" ? (l.customPolymer || "") : "",
    condition: l.condition,
    qty: l.qty,
    price: l.price,
    unit: l.unit,
    province: l.province,
    city: l.city || "",
    seller_name: l.seller,
    phone: l.phone,
    verified: l.verified,
    featured: l.featured,
    seller_id: l.sellerUid,
    description: l.desc,
    images: l.images || [],
    ad_type: l.adType || "فروش",
    sub_category: l.subCategory || "",
    usage_category: l.usageCategory || "",
    recycled_form: l.recycledForm || "",
    negotiable: !!l.negotiable,
    item_category: l.itemCategory || "مواد پلیمری و پلاستیک",
    machine_type: l.machineType || "",
    machine_brand: l.machineBrand || "",
  };
}

export const db = {
  lastError: null,
  async listListings() {
    const { data, error } = await sb.from('listings').select('*').order('created_at', { ascending: false });
    if (error) { console.error('listListings', error); db.lastError = error; return []; }
    return (data || []).map(rowToListing);
  },
  async insertListing(listing) {
    const { data, error } = await sb.from('listings').insert([listingToRow(listing)]).select().single();
    if (error) { console.error('insertListing', error); db.lastError = error; return null; }
    db.lastError = null;
    return rowToListing(data);
  },
  async updateListing(id, listing) {
    const { data, error } = await sb.from('listings').update(listingToRow(listing)).eq('id', id).select().single();
    if (error) { console.error('updateListing', error); db.lastError = error; return null; }
    db.lastError = null;
    return rowToListing(data);
  },
  async deleteListing(id) {
    const { error } = await sb.from('listings').delete().eq('id', id);
    if (error) { console.error('deleteListing', error); db.lastError = error; return false; }
    db.lastError = null;
    return true;
  },
  async createReport(report) {
    const { error } = await sb.from('reports').insert([{
      listing_id: report.listingId,
      listing_title: report.listingTitle,
      reason: report.reason,
      details: report.details || '',
      reporter_phone: report.reporterPhone || '',
    }]);
    if (error) { console.error('createReport', error); db.lastError = error; return false; }
    db.lastError = null;
    return true;
  },
  async upsertProfile(profile) {
    const { data: existing, error: findErr } = await sb.from('profiles')
      .select('*').eq('phone', profile.phone)
      .order('created_at', { ascending: true }).limit(1).maybeSingle();
    if (findErr) { console.error('findProfile', findErr); }
    if (existing) {
      const { data, error } = await sb.from('profiles')
        .update({ name: profile.name, company: profile.company })
        .eq('id', existing.id).select().single();
      if (error) { console.error('updateProfile', error); return existing; }
      return data;
    }
    const { data, error } = await sb.from('profiles')
      .insert([{ name: profile.name, phone: profile.phone, company: profile.company, referred_by: profile.referredBy || null }])
      .select().single();
    if (error) { console.error('insertProfile', error); db.lastError = error; return null; }
    db.lastError = null;
    return data;
  },
  async getSubscription(userId) {
    const { data, error } = await sb.from('subscriptions').select('*').eq('user_id', userId).maybeSingle();
    if (error) { console.error('getSubscription', error); return null; }
    return data;
  },
  async upsertSubscription(userId, plan) {
    const { data, error } = await sb.from('subscriptions')
      .upsert({ user_id: userId, plan, since: new Date().toISOString() }, { onConflict: 'user_id' })
      .select().single();
    if (error) { console.error('upsertSubscription', error); return null; }
    return data;
  },
  async listInvoices(userId) {
    const { data, error } = await sb.from('invoices').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) { console.error('listInvoices', error); return []; }
    return data || [];
  },
  async countReferrals(userId) {
    const { count, error } = await sb.from('profiles').select('id', { count: 'exact', head: true }).eq('referred_by', userId);
    if (error) { console.error('countReferrals', error); return 0; }
    return count || 0;
  },
  async insertInvoice(inv) {
    const { error } = await sb.from('invoices').insert([inv]);
    if (error) { console.error('insertInvoice', error); return false; }
    return true;
  },
};
