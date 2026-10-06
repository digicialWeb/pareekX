import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Palette,
  CheckCircle2,
  XCircle,
  X,
  Package,
} from "lucide-react";

const initialShades = [
  {
    id: 1,
    code: "SHD-001",
    name: "Ivory White",
    shadeCode: "IW-101",
    products: ["Interior Premium", "Exterior Weather Shield"],
    orders: 72,
    status: "ACTIVE",
    createdAt: "05 Jan 2026",
  },
  {
    id: 2,
    code: "SHD-002",
    name: "Pastel Blue",
    shadeCode: "PB-205",
    products: ["Interior Premium"],
    orders: 46,
    status: "ACTIVE",
    createdAt: "08 Jan 2026",
  },
  {
    id: 3,
    code: "SHD-003",
    name: "Warm Beige",
    shadeCode: "WB-310",
    products: ["Interior Premium", "Wood Finish"],
    orders: 38,
    status: "ACTIVE",
    createdAt: "12 Jan 2026",
  },
  {
    id: 4,
    code: "SHD-004",
    name: "Pure White",
    shadeCode: "PW-001",
    products: [
      "Interior Premium",
      "Exterior Primer",
      "Exterior Weather Shield",
    ],
    orders: 91,
    status: "ACTIVE",
    createdAt: "15 Jan 2026",
  },
  {
    id: 5,
    code: "SHD-005",
    name: "Terracotta",
    shadeCode: "TC-415",
    products: ["Exterior Weather Shield"],
    orders: 22,
    status: "ACTIVE",
    createdAt: "20 Jan 2026",
  },
  {
    id: 6,
    code: "SHD-006",
    name: "Ocean Green",
    shadeCode: "OG-520",
    products: ["Interior Premium"],
    orders: 14,
    status: "INACTIVE",
    createdAt: "28 Jan 2026",
  },
];

const productOptions = [
  "Interior Premium",
  "Exterior Weather Shield",
  "Exterior Primer",
  "Wood Finish",
  "Metal Guard",
];

const emptyForm = {
  name: "",
  shadeCode: "",
  products: [],
  status: "ACTIVE",
};

const Shades = () => {
  const [shades, setShades] = useState(initialShades);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedShade, setSelectedShade] = useState(null);
  const [editingShade, setEditingShade] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const filteredShades = useMemo(() => {
    return shades.filter((shade) => {
      const text = search.toLowerCase();

      const matchesSearch =
        shade.name.toLowerCase().includes(text) ||
        shade.code.toLowerCase().includes(text) ||
        shade.shadeCode.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "ALL" ||
        shade.status === statusFilter;

      const matchesProduct =
        productFilter === "ALL" ||
        shade.products.includes(productFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProduct
      );
    });
  }, [shades, search, statusFilter, productFilter]);

  const activeCount = shades.filter(
    (shade) => shade.status === "ACTIVE"
  ).length;

  const inactiveCount = shades.filter(
    (shade) => shade.status === "INACTIVE"
  ).length;

  const totalOrders = shades.reduce(
    (sum, shade) => sum + shade.orders,
    0
  );

  const openAddForm = () => {
    setEditingShade(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (shade) => {
    setEditingShade(shade);

    setFormData({
      name: shade.name,
      shadeCode: shade.shadeCode,
      products: [...shade.products],
      status: shade.status,
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

  const toggleProduct = (product) => {
    setFormData((prev) => {
      const exists = prev.products.includes(product);

      return {
        ...prev,
        products: exists
          ? prev.products.filter((item) => item !== product)
          : [...prev.products, product],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.shadeCode) {
      alert("Please enter Shade Name and Shade Code.");
      return;
    }

    if (formData.products.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    if (editingShade) {
      setShades((prev) =>
        prev.map((shade) =>
          shade.id === editingShade.id
            ? {
                ...shade,
                ...formData,
              }
            : shade
        )
      );
    } else {
      const newShade = {
        id: Date.now(),
        code: `SHD-${String(shades.length + 1).padStart(
          3,
          "0"
        )}`,
        ...formData,
        orders: 0,
        createdAt: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setShades((prev) => [newShade, ...prev]);
    }

    setShowForm(false);
    setEditingShade(null);
    setFormData(emptyForm);
  };

  const toggleStatus = (id) => {
    setShades((prev) =>
      prev.map((shade) =>
        shade.id === id
          ? {
              ...shade,
              status:
                shade.status === "ACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
            }
          : shade
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Shades
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage master shades and their product mapping.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Shade
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Shades"
          value={shades.length}
          icon={<Palette size={22} />}
        />

        <StatCard
          label="Active Shades"
          value={activeCount}
          icon={<CheckCircle2 size={22} />}
          valueClass="text-emerald-600"
        />

        <StatCard
          label="Inactive Shades"
          value={inactiveCount}
          icon={<XCircle size={22} />}
          valueClass="text-slate-500"
        />

        <StatCard
          label="Shade Orders"
          value={totalOrders}
          icon={<Package size={22} />}
          valueClass="text-blue-600"
        />
      </div>

      {/* Filters */}
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
              placeholder="Search shade name or shade code..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <select
            value={productFilter}
            onChange={(e) =>
              setProductFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="ALL">All Products</option>

            {productOptions.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>

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
          <table className="w-full min-w-[1050px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHead>Shade</TableHead>
                <TableHead>Shade Code</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead align="right">
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredShades.map((shade) => (
                <tr
                  key={shade.id}
                  className="transition hover:bg-slate-50"
                >
                  {/* Shade */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Palette
                          size={19}
                          className="text-slate-600"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {shade.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {shade.code}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Shade Code */}
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {shade.shadeCode}
                    </span>
                  </td>

                  {/* Products */}
                  <td className="px-6 py-4">
                    <div className="flex max-w-[350px] flex-wrap gap-1.5">
                      {shade.products.map((product) => (
                        <span
                          key={product}
                          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Orders */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {shade.orders}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        shade.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {shade.status}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">
                      {shade.createdAt}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedShade(shade);
                          setShowDetails(true);
                        }}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() =>
                          openEditForm(shade)
                        }
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        onClick={() =>
                          toggleStatus(shade.id)
                        }
                        className={`rounded-lg border p-2 ${
                          shade.status === "ACTIVE"
                            ? "border-red-200 text-red-500 hover:bg-red-50"
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={
                          shade.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        {shade.status === "ACTIVE" ? (
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

          {filteredShades.length === 0 && (
            <div className="py-16 text-center">
              <Palette
                size={40}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-3 font-semibold text-slate-700">
                No shades found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedShade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Shade Details
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedShade.code}
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
                  <Palette
                    size={25}
                    className="text-slate-600"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedShade.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {selectedShade.shadeCode}
                  </p>
                </div>

                <span
                  className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedShade.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {selectedShade.status}
                </span>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Available For Products
                </p>

                <div className="space-y-2">
                  {selectedShade.products.map(
                    (product) => (
                      <div
                        key={product}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                      >
                        <Package
                          size={17}
                          className="text-slate-500"
                        />

                        <span className="text-sm font-medium text-slate-700">
                          {product}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatBox
                  label="Orders"
                  value={selectedShade.orders}
                />

                <StatBox
                  label="Created"
                  value={selectedShade.createdAt}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingShade
                    ? "Edit Shade"
                    : "Add Shade"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create and map a master shade to products.
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
                  label="Shade Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ivory White"
                />

                <FormInput
                  label="Shade Code *"
                  name="shadeCode"
                  value={formData.shadeCode}
                  onChange={handleInputChange}
                  placeholder="e.g. IW-101"
                />
              </div>

              {/* Product Mapping */}
              <div className="mt-6">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Product Mapping *
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Select the products where this shade can be
                    ordered.
                  </p>
                </div>

                <div className="space-y-2">
                  {productOptions.map((product) => {
                    const selected =
                      formData.products.includes(product);

                    return (
                      <button
                        type="button"
                        key={product}
                        onClick={() =>
                          toggleProduct(product)
                        }
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Package
                            size={18}
                            className={
                              selected
                                ? "text-slate-900"
                                : "text-slate-400"
                            }
                          />

                          <span className="text-sm font-medium text-slate-700">
                            {product}
                          </span>
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            selected
                              ? "border-slate-900 bg-slate-900"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <CheckIcon />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="mt-6">
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
                  <option value="INACTIVE">Inactive</option>
                </select>
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
                  {editingShade
                    ? "Update Shade"
                    : "Create Shade"}
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

const StatBox = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 p-4">
    <p className="text-xs text-slate-400">{label}</p>

    <p className="mt-1 text-lg font-bold text-slate-900">
      {value}
    </p>
  </div>
);

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
  >
    <path d="M5 12l4 4L19 6" />
  </svg>
);

export default Shades;