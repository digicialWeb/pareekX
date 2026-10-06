import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Truck,
  Phone,
  MapPin,
  UserRound,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

const initialTransports = [
  {
    id: 1,
    code: "TRN-001",
    name: "Shree Balaji Transport",
    contactPerson: "Rakesh Verma",
    phone: "+91 98765 11111",
    alternatePhone: "+91 98261 11111",
    address: "Transport Nagar, Raipur, Chhattisgarh",
    city: "Raipur",
    state: "Chhattisgarh",
    vehicleInfo: "Multiple Vehicles",
    orders: 86,
    status: "ACTIVE",
    createdAt: "05 Jan 2026",
  },
  {
    id: 2,
    code: "TRN-002",
    name: "VRL Logistics",
    contactPerson: "Manoj Kumar",
    phone: "+91 98930 22222",
    alternatePhone: "",
    address: "Industrial Area, Bhopal, Madhya Pradesh",
    city: "Bhopal",
    state: "Madhya Pradesh",
    vehicleInfo: "Multiple Vehicles",
    orders: 64,
    status: "ACTIVE",
    createdAt: "12 Jan 2026",
  },
  {
    id: 3,
    code: "TRN-003",
    name: "Agarwal Transport",
    contactPerson: "Suresh Agarwal",
    phone: "+91 97555 33333",
    alternatePhone: "+91 97700 33333",
    address: "Dewas Naka, Indore, Madhya Pradesh",
    city: "Indore",
    state: "Madhya Pradesh",
    vehicleInfo: "Truck / Pickup",
    orders: 42,
    status: "ACTIVE",
    createdAt: "20 Jan 2026",
  },
  {
    id: 4,
    code: "TRN-004",
    name: "Fast Track Cargo",
    contactPerson: "Deepak Singh",
    phone: "+91 98262 44444",
    alternatePhone: "",
    address: "Ring Road, Bilaspur, Chhattisgarh",
    city: "Bilaspur",
    state: "Chhattisgarh",
    vehicleInfo: "Pickup / Mini Truck",
    orders: 28,
    status: "ACTIVE",
    createdAt: "02 Feb 2026",
  },
  {
    id: 5,
    code: "TRN-005",
    name: "City Transport",
    contactPerson: "Rajesh Jain",
    phone: "+91 98930 55555",
    alternatePhone: "",
    address: "MP Nagar, Bhopal, Madhya Pradesh",
    city: "Bhopal",
    state: "Madhya Pradesh",
    vehicleInfo: "Local Delivery",
    orders: 14,
    status: "INACTIVE",
    createdAt: "10 Feb 2026",
  },
];

const emptyForm = {
  name: "",
  contactPerson: "",
  phone: "",
  alternatePhone: "",
  address: "",
  city: "",
  state: "",
  vehicleInfo: "",
  status: "ACTIVE",
};

const Transports = () => {
  const [transports, setTransports] =
    useState(initialTransports);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedTransport, setSelectedTransport] =
    useState(null);

  const [editingTransport, setEditingTransport] =
    useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const filteredTransports = useMemo(() => {
    return transports.filter((transport) => {
      const text = search.toLowerCase();

      const matchesSearch =
        transport.name.toLowerCase().includes(text) ||
        transport.code.toLowerCase().includes(text) ||
        transport.contactPerson
          .toLowerCase()
          .includes(text) ||
        transport.phone.toLowerCase().includes(text) ||
        transport.city.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "ALL" ||
        transport.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transports, search, statusFilter]);

  const activeCount = transports.filter(
    (transport) => transport.status === "ACTIVE"
  ).length;

  const inactiveCount = transports.filter(
    (transport) => transport.status === "INACTIVE"
  ).length;

  const totalOrders = transports.reduce(
    (sum, transport) => sum + transport.orders,
    0
  );

  const openAddForm = () => {
    setEditingTransport(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (transport) => {
    setEditingTransport(transport);

    setFormData({
      name: transport.name,
      contactPerson: transport.contactPerson,
      phone: transport.phone,
      alternatePhone: transport.alternatePhone,
      address: transport.address,
      city: transport.city,
      state: transport.state,
      vehicleInfo: transport.vehicleInfo,
      status: transport.status,
    });

    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.contactPerson ||
      !formData.phone
    ) {
      alert(
        "Please fill Transport Name, Contact Person and Phone."
      );
      return;
    }

    if (editingTransport) {
      setTransports((prev) =>
        prev.map((transport) =>
          transport.id === editingTransport.id
            ? {
                ...transport,
                ...formData,
              }
            : transport
        )
      );
    } else {
      const newTransport = {
        id: Date.now(),
        code: `TRN-${String(
          transports.length + 1
        ).padStart(3, "0")}`,
        ...formData,
        orders: 0,
        createdAt: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setTransports((prev) => [
        newTransport,
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingTransport(null);
    setFormData(emptyForm);
  };

  const toggleStatus = (id) => {
    setTransports((prev) =>
      prev.map((transport) =>
        transport.id === id
          ? {
              ...transport,
              status:
                transport.status === "ACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
            }
          : transport
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Transports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage transport partners used for order delivery.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Transport
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Transports"
          value={transports.length}
          icon={<Truck size={22} />}
        />

        <StatCard
          label="Active"
          value={activeCount}
          icon={<CheckCircle2 size={22} />}
          valueClass="text-emerald-600"
        />

        <StatCard
          label="Inactive"
          value={inactiveCount}
          icon={<XCircle size={22} />}
          valueClass="text-slate-500"
        />

        <StatCard
          label="Transport Orders"
          value={totalOrders}
          icon={<Truck size={22} />}
          valueClass="text-blue-600"
        />
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transport, contact person, phone, city..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHead>Transport</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTransports.map((transport) => (
                <tr
                  key={transport.id}
                  className="transition hover:bg-slate-50"
                >
                  {/* Transport */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Truck
                          size={19}
                          className="text-slate-600"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {transport.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {transport.code}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <p className="flex items-center gap-2 text-sm text-slate-700">
                      <UserRound size={14} />
                      {transport.contactPerson}
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={14} />
                      {transport.phone}
                    </p>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    <p className="flex items-center gap-2 text-sm text-slate-700">
                      <MapPin size={14} />
                      {transport.city}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {transport.state}
                    </p>
                  </td>

                  {/* Vehicle */}
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {transport.vehicleInfo ||
                        "Not specified"}
                    </span>
                  </td>

                  {/* Orders */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {transport.orders}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        transport.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {transport.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedTransport(
                            transport
                          );
                          setShowDetails(true);
                        }}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() =>
                          openEditForm(transport)
                        }
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        onClick={() =>
                          toggleStatus(transport.id)
                        }
                        className={`rounded-lg border p-2 ${
                          transport.status === "ACTIVE"
                            ? "border-red-200 text-red-500 hover:bg-red-50"
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={
                          transport.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        {transport.status === "ACTIVE" ? (
                          <XCircle size={17} />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransports.length === 0 && (
            <div className="py-16 text-center">
              <Truck
                size={40}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-3 font-semibold text-slate-700">
                No transports found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedTransport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Transport Details
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedTransport.code}
                </p>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Truck
                    size={25}
                    className="text-slate-600"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedTransport.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {selectedTransport.vehicleInfo ||
                      "Transport Partner"}
                  </p>
                </div>

                <span
                  className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedTransport.status ===
                    "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {selectedTransport.status}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Contact Person"
                  value={selectedTransport.contactPerson}
                  icon={<UserRound size={16} />}
                />

                <InfoItem
                  label="Phone"
                  value={selectedTransport.phone}
                  icon={<Phone size={16} />}
                />

                <InfoItem
                  label="Alternate Phone"
                  value={
                    selectedTransport.alternatePhone ||
                    "Not provided"
                  }
                  icon={<Phone size={16} />}
                />

                <InfoItem
                  label="City"
                  value={selectedTransport.city}
                  icon={<MapPin size={16} />}
                />

                <InfoItem
                  label="State"
                  value={selectedTransport.state}
                  icon={<MapPin size={16} />}
                />

                <InfoItem
                  label="Orders"
                  value={selectedTransport.orders}
                  icon={<Truck size={16} />}
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Address
                </p>

                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  {selectedTransport.address ||
                    "Address not provided."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingTransport
                    ? "Edit Transport"
                    : "Add Transport"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add transport partner information.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <FormInput
                  label="Transport Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Shree Balaji Transport"
                />

                <FormInput
                  label="Contact Person *"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter contact person"
                />

                <FormInput
                  label="Phone *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />

                <FormInput
                  label="Alternate Phone"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />

                <FormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />

                <FormInput
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                />

                <FormInput
                  label="Vehicle Information"
                  name="vehicleInfo"
                  value={formData.vehicleInfo}
                  onChange={handleInputChange}
                  placeholder="e.g. Truck / Pickup"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter complete address"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {editingTransport
                    ? "Update Transport"
                    : "Create Transport"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TableHead = ({ children, align }) => (
  <th
    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
      align === "right" ? "text-right" : ""
    }`}
  >
    {children}
  </th>
);

const StatCard = ({
  label,
  value,
  icon,
  valueClass = "text-slate-900",
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>

        <h3
          className={`mt-2 text-2xl font-bold ${valueClass}`}
        >
          {value}
        </h3>
      </div>

      <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
        {icon}
      </div>
    </div>
  </div>
);

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {label}
    </label>

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
    />
  </div>
);

const InfoItem = ({ label, value, icon }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
      {icon}
      <span className="break-all">{value}</span>
    </div>
  </div>
);

export default Transports;