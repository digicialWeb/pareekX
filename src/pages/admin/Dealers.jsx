import {
  CheckCircle2,
  ChevronDown,
  Eye,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const SALESPERSONS = [
  {
    id: 1,
    name: "Rahul Sharma",
    employeeCode: "SP-001",
    phone: "+91 98765 11111",
    active: true,
  },
  {
    id: 2,
    name: "Amit Verma",
    employeeCode: "SP-002",
    phone: "+91 99887 22222",
    active: true,
  },
  {
    id: 3,
    name: "Rohit Singh",
    employeeCode: "SP-003",
    phone: "+91 90000 33333",
    active: true,
  },
  {
    id: 4,
    name: "Sanjay Patel",
    employeeCode: "SP-004",
    phone: "+91 91111 44444",
    active: false,
  },
];

const INITIAL_DEALERS = [
  {
    id: 1,
    salespersonId: 1,
    name: "Shree Balaji Traders",
    phone: "+91 98765 43210",
    email: "balaji@example.com",
    address: "12 Main Road",
    city: "Raipur",
    state: "Chhattisgarh",
    pincode: "492001",
    gst: "22ABCDE1234F1Z5",
    contactPerson: "Rajesh Kumar",
    active: true,
    joinedAt: "2026-08-12",
    totalOrders: 24,
    totalQuantity: 540,
    lastOrder: "2026-10-02",
  },
  {
    id: 2,
    salespersonId: 2,
    name: "Arihant Enterprises",
    phone: "+91 99887 66554",
    email: "arihant@example.com",
    address: "Sector 6 Market",
    city: "Bhilai",
    state: "Chhattisgarh",
    pincode: "490006",
    gst: "22FGHIJ5678K1Z2",
    contactPerson: "Amit Jain",
    active: true,
    joinedAt: "2026-07-20",
    totalOrders: 18,
    totalQuantity: 390,
    lastOrder: "2026-10-02",
  },
  {
    id: 3,
    salespersonId: 3,
    name: "Om Sai Distributors",
    phone: "+91 91234 56789",
    email: "omsai@example.com",
    address: "Station Road",
    city: "Durg",
    state: "Chhattisgarh",
    pincode: "491001",
    gst: "",
    contactPerson: "Suresh Patel",
    active: true,
    joinedAt: "2026-09-01",
    totalOrders: 11,
    totalQuantity: 210,
    lastOrder: "2026-10-02",
  },
  {
    id: 4,
    salespersonId: 1,
    name: "New Bharat Agency",
    phone: "+91 90000 11122",
    email: "bharat@example.com",
    address: "Vyapar Vihar",
    city: "Bilaspur",
    state: "Chhattisgarh",
    pincode: "495001",
    gst: "22KLMNO9012P1Z8",
    contactPerson: "Rakesh Singh",
    active: false,
    joinedAt: "2026-06-15",
    totalOrders: 7,
    totalQuantity: 125,
    lastOrder: "2026-09-25",
  },
];

const INITIAL_ORDER_HISTORY = {
  1: [
    {
      id: "PRK-104821",
      date: "02 Oct 2026",
      quantity: 26,
      status: "PENDING",
      createdBy: "Rahul Sharma",
    },
    {
      id: "PRK-104710",
      date: "28 Sep 2026",
      quantity: 32,
      status: "DELIVERED",
      createdBy: "Rahul Sharma",
    },
    {
      id: "PRK-104502",
      date: "20 Sep 2026",
      quantity: 18,
      status: "DELIVERED",
      createdBy: "Amit Verma",
    },
  ],
  2: [
    {
      id: "PRK-104822",
      date: "02 Oct 2026",
      quantity: 25,
      status: "IN_PRODUCTION",
      createdBy: "Amit Verma",
    },
    {
      id: "PRK-104620",
      date: "24 Sep 2026",
      quantity: 40,
      status: "DELIVERED",
      createdBy: "Amit Verma",
    },
  ],
  3: [
    {
      id: "PRK-104823",
      date: "02 Oct 2026",
      quantity: 30,
      status: "READY",
      createdBy: "Dealer",
    },
    {
      id: "PRK-104412",
      date: "15 Sep 2026",
      quantity: 20,
      status: "DELIVERED",
      createdBy: "Dealer",
    },
  ],
  4: [
    {
      id: "PRK-104824",
      date: "01 Oct 2026",
      quantity: 20,
      status: "DISPATCHED",
      createdBy: "Rohit Singh",
    },
  ],
};

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "Chhattisgarh",
  pincode: "",
  gst: "",
  contactPerson: "",
  salespersonId: "",
  active: true,
};

const ORDER_STATUS = {
  PENDING: "Pending",
  IN_PRODUCTION: "In Production",
  READY: "Ready",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
};

function getSalesperson(salespersonId) {
  return SALESPERSONS.find(
    (person) => String(person.id) === String(salespersonId),
  );
}

function getSalespersonName(salespersonId) {
  if (!salespersonId) return "Unassigned";
  return getSalesperson(salespersonId)?.name || "Unassigned";
}

function getSalespersonCode(salespersonId) {
  if (!salespersonId) return "—";
  return getSalesperson(salespersonId)?.employeeCode || "—";
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DealerStatus({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      <CheckCircle2 size={14} />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
      <XCircle size={14} />
      Inactive
    </span>
  );
}

function OrderStatus({ status }) {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PRODUCTION: "bg-blue-50 text-blue-700 border-blue-200",
    READY: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DISPATCHED: "bg-purple-50 text-purple-700 border-purple-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {ORDER_STATUS[status] || status}
    </span>
  );
}

export default function Dealers() {
  const [dealers, setDealers] = useState(INITIAL_DEALERS);
  const [orderHistory] = useState(INITIAL_ORDER_HISTORY);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [salespersonFilter, setSalespersonFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [selectedDealer, setSelectedDealer] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const cities = useMemo(
    () => [...new Set(dealers.map((dealer) => dealer.city).filter(Boolean))],
    [dealers],
  );

  const stats = useMemo(
    () => ({
      total: dealers.length,
      active: dealers.filter((dealer) => dealer.active).length,
      inactive: dealers.filter((dealer) => !dealer.active).length,
      totalOrders: dealers.reduce(
        (total, dealer) => total + dealer.totalOrders,
        0,
      ),
    }),
    [dealers],
  );

  const filteredDealers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return dealers.filter((dealer) => {
      const matchesSearch =
        !query ||
        dealer.name.toLowerCase().includes(query) ||
        dealer.phone.toLowerCase().includes(query) ||
        dealer.email.toLowerCase().includes(query) ||
        dealer.city.toLowerCase().includes(query) ||
        dealer.contactPerson.toLowerCase().includes(query) ||
        getSalespersonName(dealer.salespersonId).toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && dealer.active) ||
        (statusFilter === "INACTIVE" && !dealer.active);

      const matchesCity = cityFilter === "ALL" || dealer.city === cityFilter;

      const matchesSalesperson =
        salespersonFilter === "ALL" ||
        (salespersonFilter === "UNASSIGNED"
          ? !dealer.salespersonId
          : String(dealer.salespersonId || "") === String(salespersonFilter));

      return (
        matchesSearch && matchesStatus && matchesCity && matchesSalesperson
      );
    });
  }, [dealers, search, statusFilter, cityFilter, salespersonFilter]);

  const openAddModal = () => {
    setEditingDealer(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (dealer) => {
    setEditingDealer(dealer);
    setForm({
      name: dealer.name,
      phone: dealer.phone,
      email: dealer.email,
      address: dealer.address,
      city: dealer.city,
      state: dealer.state,
      pincode: dealer.pincode,
      gst: dealer.gst,
      contactPerson: dealer.contactPerson,
      salespersonId: dealer.salespersonId ? String(dealer.salespersonId) : "",
      active: dealer.active,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDealer(null);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveDealer = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter dealer name.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Please enter dealer phone number.");
      return;
    }

    if (!form.city.trim()) {
      alert("Please enter city.");
      return;
    }

    if (!form.state.trim()) {
      alert("Please select state.");
      return;
    }

    if (!form.pincode.trim()) {
      alert("Please enter pincode.");
      return;
    }

    const duplicatePhone = dealers.some(
      (dealer) =>
        dealer.phone.replace(/\D/g, "") === form.phone.replace(/\D/g, "") &&
        dealer.id !== editingDealer?.id,
    );

    if (duplicatePhone) {
      alert("A dealer with this phone number already exists.");
      return;
    }

    const dealerData = {
      id: editingDealer?.id || Date.now(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      gst: form.gst.trim().toUpperCase(),
      contactPerson: form.contactPerson.trim(),
      salespersonId: form.salespersonId ? Number(form.salespersonId) : null,
      active: form.active,
      joinedAt:
        editingDealer?.joinedAt || new Date().toISOString().slice(0, 10),
      totalOrders: editingDealer?.totalOrders || 0,
      totalQuantity: editingDealer?.totalQuantity || 0,
      lastOrder: editingDealer?.lastOrder || "",
    };

    if (editingDealer) {
      setDealers((current) =>
        current.map((dealer) =>
          dealer.id === editingDealer.id ? dealerData : dealer,
        ),
      );
    } else {
      setDealers((current) => [dealerData, ...current]);
    }

    closeModal();
  };

  const toggleDealer = (dealerId) => {
    setDealers((current) =>
      current.map((dealer) =>
        dealer.id === dealerId ? { ...dealer, active: !dealer.active } : dealer,
      ),
    );
  };

  const deleteDealer = (dealerId) => {
    const dealer = dealers.find((item) => item.id === dealerId);
    if (!dealer) return;

    if (
      !window.confirm(
        `Delete "${dealer.name}"? In the final backend, dealers with order history should normally be deactivated instead of deleted.`,
      )
    ) {
      return;
    }

    setDealers((current) => current.filter((dealer) => dealer.id !== dealerId));

    if (selectedDealer?.id === dealerId) {
      setSelectedDealer(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setCityFilter("ALL");
    setSalespersonFilter("ALL");
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
              Dealers Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage dealer accounts, contact details and order history.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B5220E] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#981d0c]"
          >
            <Plus size={18} />
            Add Dealer
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Total Dealers", stats.total, Users, "text-gray-900"],
            ["Active Dealers", stats.active, CheckCircle2, "text-emerald-600"],
            ["Inactive", stats.inactive, XCircle, "text-gray-500"],
            ["Total Orders", stats.totalOrders, ShoppingBag, "text-[#B5220E]"],
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
                placeholder="Search dealer, phone, email, city, salesperson..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B5220E] focus:bg-white focus:ring-2 focus:ring-[#B5220E]/10"
              />
            </div>

            <SelectFilter
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                ["ALL", "All Status"],
                ["ACTIVE", "Active"],
                ["INACTIVE", "Inactive"],
              ]}
              width="md:w-44"
            />

            <SelectFilter
              value={cityFilter}
              onChange={setCityFilter}
              options={[
                ["ALL", "All Cities"],
                ...cities.map((city) => [city, city]),
              ]}
              width="md:w-48"
            />

            <SelectFilter
              value={salespersonFilter}
              onChange={setSalespersonFilter}
              options={[
                ["ALL", "All Salespersons"],
                ["UNASSIGNED", "Unassigned"],
                ...SALESPERSONS.map((person) => [
                  String(person.id),
                  person.name,
                ]),
              ]}
              width="md:w-52"
            />

            <button
              onClick={resetFilters}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Dealer table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">Dealer Directory</h2>
            <p className="text-xs text-gray-500">
              Showing {filteredDealers.length} of {dealers.length} dealers
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-4 font-semibold">Dealer</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Location</th>
                  <th className="px-5 py-4 font-semibold">Salesperson</th>
                  <th className="px-5 py-4 font-semibold">Orders</th>
                  <th className="px-5 py-4 font-semibold">Last Order</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredDealers.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B5220E]/5 font-bold text-[#B5220E]">
                          {dealer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {dealer.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {dealer.contactPerson || "No contact person"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-gray-400" />
                        {dealer.phone}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={14} className="text-gray-400" />
                        {dealer.email || "No email"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="flex items-start gap-2 text-sm font-medium text-gray-700">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <span>
                          {dealer.city}, {dealer.state}
                          <span className="block text-xs font-normal text-gray-400">
                            {dealer.pincode}
                          </span>
                        </span>
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {dealer.salespersonId ? (
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {getSalespersonName(dealer.salespersonId)}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {getSalespersonCode(dealer.salespersonId)}
                          </p>
                        </div>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">
                        {dealer.totalOrders}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {dealer.totalQuantity} total qty
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(dealer.lastOrder)}
                    </td>

                    <td className="px-5 py-4">
                      <DealerStatus active={dealer.active} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedDealer(dealer)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          onClick={() => openEditModal(dealer)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => toggleDealer(dealer.id)}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                            dealer.active
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {dealer.active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          onClick={() => deleteDealer(dealer.id)}
                          className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDealers.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Users className="mx-auto text-gray-300" size={42} />
              <h3 className="mt-3 font-bold text-gray-800">No dealers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Dealer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[94vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5 md:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B5220E]">
                  Dealer Management
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {editingDealer ? "Edit Dealer" : "Add New Dealer"}
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
              onSubmit={saveDealer}
              className="max-h-[calc(94vh-90px)] overflow-y-auto p-5 md:p-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Dealer / Company Name"
                  required
                  value={form.name}
                  onChange={(value) => updateForm("name", value)}
                  placeholder="e.g. Shree Balaji Traders"
                />

                <Field
                  label="Contact Person"
                  value={form.contactPerson}
                  onChange={(value) => updateForm("contactPerson", value)}
                  placeholder="e.g. Rajesh Kumar"
                />

                <Field
                  label="Phone Number"
                  required
                  value={form.phone}
                  onChange={(value) => updateForm("phone", value)}
                  placeholder="+91 98765 43210"
                />

                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) => updateForm("email", value)}
                  placeholder="dealer@example.com"
                />

                <Field
                  label="City"
                  required
                  value={form.city}
                  onChange={(value) => updateForm("city", value)}
                  placeholder="Raipur"
                />

                <Field
                  label="Pincode"
                  required
                  value={form.pincode}
                  onChange={(value) => updateForm("pincode", value)}
                  placeholder="492001"
                />

                <SelectField
                  label="State"
                  value={form.state}
                  onChange={(value) => updateForm("state", value)}
                  options={[
                    "Chhattisgarh",
                    "Madhya Pradesh",
                    "Maharashtra",
                    "Odisha",
                    "Jharkhand",
                    "Uttar Pradesh",
                    "Other",
                  ]}
                />

                <Field
                  label="GST Number"
                  value={form.gst}
                  onChange={(value) => updateForm("gst", value)}
                  placeholder="22ABCDE1234F1Z5"
                />

                <SelectField
                  label="Assigned Salesperson"
                  value={form.salespersonId}
                  onChange={(value) => updateForm("salespersonId", value)}
                  options={[
                    { value: "", label: "Unassigned" },
                    ...SALESPERSONS.filter(
                      (person) =>
                        person.active ||
                        String(person.id) === String(form.salespersonId),
                    ).map((person) => ({
                      value: String(person.id),
                      label: `${person.name} (${person.employeeCode})`,
                    })),
                  ]}
                />
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Address
                </span>
                <textarea
                  value={form.address}
                  onChange={(event) =>
                    updateForm("address", event.target.value)
                  }
                  rows={3}
                  placeholder="Complete dealer address..."
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
                  Dealer account is active
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
                  {editingDealer ? "Update Dealer" : "Save Dealer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dealer Details + Order History */}
      {selectedDealer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5 md:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B5220E]">
                  Dealer Details
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedDealer.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Joined {formatDate(selectedDealer.joinedAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedDealer(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="max-h-[calc(92vh-95px)] overflow-y-auto p-5 md:p-6">
              {/* Profile */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B5220E]/5 text-lg font-bold text-[#B5220E]">
                      {selectedDealer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {selectedDealer.name}
                      </h3>
                      <DealerStatus active={selectedDealer.active} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={selectedDealer.phone}
                    />
                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={selectedDealer.email || "—"}
                    />
                    <InfoRow
                      icon={Users}
                      label="Contact Person"
                      value={selectedDealer.contactPerson || "—"}
                    />
                    <InfoRow
                      icon={Users}
                      label="Assigned Salesperson"
                      value={
                        selectedDealer.salespersonId
                          ? `${getSalespersonName(selectedDealer.salespersonId)} (${getSalespersonCode(selectedDealer.salespersonId)})`
                          : "Unassigned"
                      }
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 p-5">
                  <h3 className="mb-4 font-bold text-gray-900">
                    Address Details
                  </h3>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 text-gray-400" size={18} />
                    <div className="text-sm text-gray-600">
                      <p>{selectedDealer.address || "Address not available"}</p>
                      <p className="mt-1 font-medium text-gray-800">
                        {selectedDealer.city}, {selectedDealer.state} -{" "}
                        {selectedDealer.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400">GST Number</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {selectedDealer.gst || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                <DetailCard
                  label="Total Orders"
                  value={selectedDealer.totalOrders}
                />
                <DetailCard
                  label="Total Quantity"
                  value={selectedDealer.totalQuantity}
                />
                <DetailCard
                  label="Last Order"
                  value={formatDate(selectedDealer.lastOrder)}
                />
                <DetailCard
                  label="Joined"
                  value={formatDate(selectedDealer.joinedAt)}
                />
              </div>

              {/* Order history */}
              <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h3 className="font-bold text-gray-900">Order History</h3>
                  <p className="text-xs text-gray-500">
                    Recent orders placed by this dealer or on behalf of this
                    dealer.
                  </p>
                </div>

                {(orderHistory[selectedDealer.id] || []).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left">
                      <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                        <tr>
                          <th className="px-5 py-3">Order</th>
                          <th className="px-5 py-3">Date</th>
                          <th className="px-5 py-3">Quantity</th>
                          <th className="px-5 py-3">Created By</th>
                          <th className="px-5 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orderHistory[selectedDealer.id].map((order) => (
                          <tr key={order.id}>
                            <td className="px-5 py-3 font-bold text-gray-800">
                              {order.id}
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600">
                              {order.date}
                            </td>
                            <td className="px-5 py-3 text-sm font-semibold text-gray-800">
                              {order.quantity}
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600">
                              {order.createdBy}
                            </td>
                            <td className="px-5 py-3">
                              <OrderStatus status={order.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-5 py-10 text-center text-sm text-gray-500">
                    No order history available.
                  </div>
                )}
              </div>
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
          {options.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;
            const optionLabel =
              typeof option === "string" ? option : option.label;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </label>
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

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={17} className="mt-0.5 shrink-0 text-gray-400" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
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
