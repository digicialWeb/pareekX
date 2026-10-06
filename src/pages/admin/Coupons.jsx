import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  TicketPercent,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Copy,
  ChevronDown,
} from "lucide-react";

const INITIAL_COUPONS = [
  {
    id: 1,
    code: "WELCOME10",
    description: "Welcome discount for new dealers",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderQty: 0,
    maxDiscount: 5000,
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    usageLimit: 100,
    usedCount: 18,
    active: true,
  },
  {
    id: 2,
    code: "DEALER5",
    description: "Special dealer discount",
    discountType: "PERCENTAGE",
    discountValue: 5,
    minOrderQty: 20,
    maxDiscount: 3000,
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    usageLimit: 200,
    usedCount: 74,
    active: true,
  },
  {
    id: 3,
    code: "FESTIVE1000",
    description: "Festive fixed discount",
    discountType: "FIXED",
    discountValue: 1000,
    minOrderQty: 50,
    maxDiscount: 1000,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    usageLimit: 50,
    usedCount: 50,
    active: false,
  },
];

const EMPTY_FORM = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderQty: "",
  maxDiscount: "",
  startDate: "",
  endDate: "",
  usageLimit: "",
  active: true,
};

function formatDiscount(coupon) {
  return coupon.discountType === "PERCENTAGE"
    ? `${coupon.discountValue}%`
    : `₹${Number(coupon.discountValue).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCouponState(coupon) {
  const today = new Date().toISOString().slice(0, 10);

  if (!coupon.active) return "INACTIVE";
  if (coupon.usedCount >= coupon.usageLimit && coupon.usageLimit > 0)
    return "EXHAUSTED";
  if (coupon.endDate && coupon.endDate < today) return "EXPIRED";
  if (coupon.startDate && coupon.startDate > today) return "UPCOMING";

  return "ACTIVE";
}

function StateBadge({ state }) {
  const config = {
    ACTIVE: {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    INACTIVE: {
      label: "Inactive",
      className: "bg-gray-100 text-gray-500 border-gray-200",
      icon: XCircle,
    },
    EXHAUSTED: {
      label: "Exhausted",
      className: "bg-red-50 text-red-600 border-red-200",
      icon: XCircle,
    },
    EXPIRED: {
      label: "Expired",
      className: "bg-orange-50 text-orange-700 border-orange-200",
      icon: CalendarDays,
    },
    UPCOMING: {
      label: "Upcoming",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: CalendarDays,
    },
  };

  const item = config[state] || config.INACTIVE;
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${item.className}`}
    >
      <Icon size={14} />
      {item.label}
    </span>
  );
}

export default function Coupons() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const stats = useMemo(() => {
    const states = coupons.map(getCouponState);

    return {
      total: coupons.length,
      active: states.filter((state) => state === "ACTIVE").length,
      exhausted: states.filter((state) => state === "EXHAUSTED").length,
      expired: states.filter((state) => state === "EXPIRED").length,
    };
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const state = getCouponState(coupon);

      const matchesSearch =
        !query ||
        coupon.code.toLowerCase().includes(query) ||
        coupon.description.toLowerCase().includes(query);

      const matchesState =
        stateFilter === "ALL" || state === stateFilter;

      const matchesType =
        typeFilter === "ALL" || coupon.discountType === typeFilter;

      return matchesSearch && matchesState && matchesType;
    });
  }, [coupons, search, stateFilter, typeFilter]);

  const openAddModal = () => {
    setEditingCoupon(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderQty: coupon.minOrderQty,
      maxDiscount: coupon.maxDiscount,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit,
      active: coupon.active,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveCoupon = (event) => {
    event.preventDefault();

    if (!form.code.trim()) {
      alert("Please enter coupon code.");
      return;
    }

    if (!form.discountValue || Number(form.discountValue) <= 0) {
      alert("Please enter a valid discount value.");
      return;
    }

    if (
      form.discountType === "PERCENTAGE" &&
      Number(form.discountValue) > 100
    ) {
      alert("Percentage discount cannot be more than 100%.");
      return;
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    if (!form.usageLimit || Number(form.usageLimit) <= 0) {
      alert("Please enter a valid usage limit.");
      return;
    }

    const duplicateCode = coupons.some(
      (coupon) =>
        coupon.code.toLowerCase() === form.code.trim().toLowerCase() &&
        coupon.id !== editingCoupon?.id
    );

    if (duplicateCode) {
      alert("This coupon code already exists.");
      return;
    }

    const couponData = {
      id: editingCoupon?.id || Date.now(),
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderQty: Number(form.minOrderQty || 0),
      maxDiscount: Number(form.maxDiscount || 0),
      startDate: form.startDate,
      endDate: form.endDate,
      usageLimit: Number(form.usageLimit),
      usedCount: editingCoupon?.usedCount || 0,
      active: form.active,
    };

    if (editingCoupon) {
      setCoupons((current) =>
        current.map((coupon) =>
          coupon.id === editingCoupon.id ? couponData : coupon
        )
      );
    } else {
      setCoupons((current) => [couponData, ...current]);
    }

    closeModal();
  };

  const toggleCoupon = (couponId) => {
    setCoupons((current) =>
      current.map((coupon) =>
        coupon.id === couponId
          ? { ...coupon, active: !coupon.active }
          : coupon
      )
    );
  };

  const deleteCoupon = (couponId) => {
    const coupon = coupons.find((item) => item.id === couponId);
    if (!coupon) return;

    if (
      !window.confirm(
        `Delete coupon "${coupon.code}"? This is demo data and can be restored by refreshing the page.`
      )
    ) {
      return;
    }

    setCoupons((current) =>
      current.filter((coupon) => coupon.id !== couponId)
    );

    if (selectedCoupon?.id === couponId) {
      setSelectedCoupon(null);
    }
  };

  const copyCoupon = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`Coupon ${code} copied.`);
    } catch {
      alert(`Coupon code: ${code}`);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStateFilter("ALL");
    setTypeFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#B5220E]">
              Pareek Admin
            </p>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Coupons Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage predefined discounts available during order creation.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B5220E] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#981d0c]"
          >
            <Plus size={18} />
            Add Coupon
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Total Coupons", stats.total, TicketPercent, "text-gray-900"],
            ["Active", stats.active, CheckCircle2, "text-emerald-600"],
            ["Exhausted", stats.exhausted, XCircle, "text-red-600"],
            ["Expired", stats.expired, CalendarDays, "text-orange-600"],
          ].map(([label, value, Icon, color]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <Icon size={18} className={color} />
              </div>
              <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search coupon code or description..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B5220E] focus:bg-white focus:ring-2 focus:ring-[#B5220E]/10"
              />
            </div>

            <SelectFilter
              value={stateFilter}
              onChange={setStateFilter}
              options={[
                ["ALL", "All Status"],
                ["ACTIVE", "Active"],
                ["INACTIVE", "Inactive"],
                ["UPCOMING", "Upcoming"],
                ["EXHAUSTED", "Exhausted"],
                ["EXPIRED", "Expired"],
              ]}
              width="md:w-48"
            />

            <SelectFilter
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                ["ALL", "All Discount Types"],
                ["PERCENTAGE", "Percentage"],
                ["FIXED", "Fixed Amount"],
              ]}
              width="md:w-48"
            />

            <button
              onClick={resetFilters}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">Coupon Catalogue</h2>
            <p className="text-xs text-gray-500">
              Showing {filteredCoupons.length} of {coupons.length} coupons
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-4 font-semibold">Coupon</th>
                  <th className="px-5 py-4 font-semibold">Discount</th>
                  <th className="px-5 py-4 font-semibold">Min Qty</th>
                  <th className="px-5 py-4 font-semibold">Validity</th>
                  <th className="px-5 py-4 font-semibold">Usage</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCoupons.map((coupon) => {
                  const state = getCouponState(coupon);
                  const usagePercentage =
                    coupon.usageLimit > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (coupon.usedCount / coupon.usageLimit) * 100
                          )
                        )
                      : 0;

                  return (
                    <tr key={coupon.id} className="transition hover:bg-gray-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B5220E]/5 text-[#B5220E]">
                            <TicketPercent size={19} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900">
                                {coupon.code}
                              </p>
                              <button
                                onClick={() => copyCoupon(coupon.code)}
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                title="Copy coupon"
                              >
                                <Copy size={13} />
                              </button>
                            </div>
                            <p className="mt-1 max-w-[250px] text-xs text-gray-500">
                              {coupon.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-[#B5220E]">
                          {formatDiscount(coupon)}
                        </p>
                        {coupon.maxDiscount > 0 && (
                          <p className="mt-1 text-xs text-gray-400">
                            Max ₹{coupon.maxDiscount.toLocaleString("en-IN")}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-gray-700">
                        {coupon.minOrderQty || "No minimum"}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {formatDate(coupon.startDate)}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          to {formatDate(coupon.endDate)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-28">
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-semibold text-gray-700">
                              {coupon.usedCount}
                            </span>
                            <span className="text-gray-400">
                              / {coupon.usageLimit}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-[#B5220E]"
                              style={{ width: `${usagePercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StateBadge state={state} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedCoupon(coupon)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </button>

                          <button
                            onClick={() => openEditModal(coupon)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => toggleCoupon(coupon.id)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                              coupon.active
                                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {coupon.active ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            onClick={() => deleteCoupon(coupon.id)}
                            className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCoupons.length === 0 && (
            <div className="px-6 py-16 text-center">
              <TicketPercent
                className="mx-auto text-gray-300"
                size={42}
              />
              <h3 className="mt-3 font-bold text-gray-800">
                No coupons found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[94vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5 md:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B5220E]">
                  Coupon Management
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={saveCoupon}
              className="max-h-[calc(94vh-90px)] overflow-y-auto p-5 md:p-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Coupon Code"
                  required
                  value={form.code}
                  onChange={(value) => updateForm("code", value)}
                  placeholder="e.g. WELCOME10"
                />

                <SelectField
                  label="Discount Type"
                  value={form.discountType}
                  onChange={(value) => updateForm("discountType", value)}
                  options={[
                    ["PERCENTAGE", "Percentage"],
                    ["FIXED", "Fixed Amount"],
                  ]}
                />

                <Field
                  label={
                    form.discountType === "PERCENTAGE"
                      ? "Discount Percentage"
                      : "Discount Amount"
                  }
                  required
                  type="number"
                  value={form.discountValue}
                  onChange={(value) => updateForm("discountValue", value)}
                  placeholder={
                    form.discountType === "PERCENTAGE" ? "10" : "1000"
                  }
                />

                <Field
                  label="Minimum Order Quantity"
                  type="number"
                  value={form.minOrderQty}
                  onChange={(value) => updateForm("minOrderQty", value)}
                  placeholder="0"
                />

                <Field
                  label="Maximum Discount"
                  type="number"
                  value={form.maxDiscount}
                  onChange={(value) => updateForm("maxDiscount", value)}
                  placeholder="5000"
                />

                <Field
                  label="Usage Limit"
                  required
                  type="number"
                  value={form.usageLimit}
                  onChange={(value) => updateForm("usageLimit", value)}
                  placeholder="100"
                />

                <Field
                  label="Start Date"
                  type="date"
                  value={form.startDate}
                  onChange={(value) => updateForm("startDate", value)}
                />

                <Field
                  label="End Date"
                  type="date"
                  value={form.endDate}
                  onChange={(value) => updateForm("endDate", value)}
                />
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  rows={3}
                  placeholder="Describe when this coupon should be used..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#B5220E] focus:bg-white"
                />
              </label>

              <label className="mt-4 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    updateForm("active", event.target.checked)
                  }
                  className="h-4 w-4 accent-[#B5220E]"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Coupon is active and available for selection
                </span>
              </label>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#B5220E] px-6 py-3 text-sm font-bold text-white hover:bg-[#981d0c]"
                >
                  {editingCoupon ? "Update Coupon" : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B5220E]">
                  Coupon Details
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCoupon.code}
                  </h2>
                  <StateBadge state={getCouponState(selectedCoupon)} />
                </div>
              </div>

              <button
                onClick={() => setSelectedCoupon(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-5">
              <div className="rounded-2xl bg-[#B5220E]/5 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Discount
                </p>
                <p className="mt-1 text-4xl font-black text-[#B5220E]">
                  {formatDiscount(selectedCoupon)}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {selectedCoupon.description || "No description"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <DetailCard
                  label="Min Quantity"
                  value={selectedCoupon.minOrderQty || "None"}
                />
                <DetailCard
                  label="Max Discount"
                  value={
                    selectedCoupon.maxDiscount
                      ? `₹${selectedCoupon.maxDiscount.toLocaleString("en-IN")}`
                      : "None"
                  }
                />
                <DetailCard
                  label="Used"
                  value={`${selectedCoupon.usedCount}/${selectedCoupon.usageLimit}`}
                />
                <DetailCard
                  label="Remaining"
                  value={Math.max(
                    0,
                    selectedCoupon.usageLimit - selectedCoupon.usedCount
                  )}
                />
              </div>

              <div className="rounded-2xl border border-gray-100 p-5">
                <h3 className="mb-4 font-bold text-gray-900">Validity</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Start Date"
                    value={formatDate(selectedCoupon.startDate)}
                  />
                  <InfoItem
                    label="End Date"
                    value={formatDate(selectedCoupon.endDate)}
                  />
                </div>
              </div>

              <button
                onClick={() => copyCoupon(selectedCoupon.code)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                <Copy size={16} />
                Copy Coupon Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-[#B5220E]">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#B5220E] focus:bg-white focus:ring-2 focus:ring-[#B5220E]/10"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm outline-none focus:border-[#B5220E] focus:bg-white"
        >
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </label>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 font-bold text-gray-800">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function SelectFilter({ value, onChange, options, width }) {
  return (
    <div className={`relative ${width}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm font-medium outline-none focus:border-[#B5220E]"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
