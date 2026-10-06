import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  X,
  Package,
  Truck,
  CheckCircle2,
  Factory,
  Clock3,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

const INITIAL_ORDERS = [
  {
    id: "PRK-104821",
    dealer: {
      name: "Shree Balaji Traders",
      phone: "+91 98765 43210",
      email: "balaji@example.com",
      city: "Raipur",
      state: "Chhattisgarh",
    },
    createdBy: "Rahul Sharma",
    createdByRole: "Salesperson",
    createdAt: "02 Oct 2026, 10:30 AM",
    status: "PENDING",
    deliveryType: "TRANSPORT",
    transport: "Shree Ganesh Transport",
    coupon: "WELCOME10",
    remark: "Urgent dispatch required.",
    items: [
      { product: "Premium Interior Paint", shade: "Pearl White", packSize: "20 L", quantity: 12 },
      { product: "Premium Interior Paint", shade: "Sky Blue", packSize: "10 L", quantity: 8 },
      { product: "Weather Shield", shade: "Snow White", packSize: "20 L", quantity: 6 },
    ],
  },
  {
    id: "PRK-104822",
    dealer: {
      name: "Arihant Enterprises",
      phone: "+91 99887 66554",
      email: "arihant@example.com",
      city: "Bhilai",
      state: "Chhattisgarh",
    },
    createdBy: "Amit Verma",
    createdByRole: "Salesperson",
    createdAt: "02 Oct 2026, 11:15 AM",
    status: "IN_PRODUCTION",
    deliveryType: "DIRECT",
    transport: "",
    coupon: "No Coupon",
    remark: "Deliver after 5 PM.",
    items: [
      { product: "Luxury Emulsion", shade: "Royal Cream", packSize: "20 L", quantity: 15 },
      { product: "Luxury Emulsion", shade: "Royal Cream", packSize: "4 L", quantity: 10 },
    ],
  },
  {
    id: "PRK-104823",
    dealer: {
      name: "Om Sai Distributors",
      phone: "+91 91234 56789",
      email: "omsai@example.com",
      city: "Durg",
      state: "Chhattisgarh",
    },
    createdBy: "Dealer",
    createdByRole: "Dealer",
    createdAt: "02 Oct 2026, 12:05 PM",
    status: "READY",
    deliveryType: "TRANSPORT",
    transport: "Agarwal Logistics",
    coupon: "DEALER5",
    remark: "",
    items: [
      { product: "Exterior Guard", shade: "Brick Red", packSize: "20 L", quantity: 20 },
      { product: "Exterior Guard", shade: "Brick Red", packSize: "10 L", quantity: 10 },
    ],
  },
  {
    id: "PRK-104824",
    dealer: {
      name: "New Bharat Agency",
      phone: "+91 90000 11122",
      email: "bharat@example.com",
      city: "Bilaspur",
      state: "Chhattisgarh",
    },
    createdBy: "Rohit Singh",
    createdByRole: "Salesperson",
    createdAt: "01 Oct 2026, 04:20 PM",
    status: "DISPATCHED",
    deliveryType: "TRANSPORT",
    transport: "Shree Ganesh Transport",
    coupon: "No Coupon",
    remark: "Call before delivery.",
    items: [
      { product: "Premium Interior Paint", shade: "Ivory", packSize: "20 L", quantity: 8 },
      { product: "Primer", shade: "White", packSize: "10 L", quantity: 12 },
    ],
  },
  {
    id: "PRK-104825",
    dealer: {
      name: "Maa Durga Traders",
      phone: "+91 91111 22233",
      email: "maadurga@example.com",
      city: "Korba",
      state: "Chhattisgarh",
    },
    createdBy: "Rahul Sharma",
    createdByRole: "Salesperson",
    createdAt: "30 Sep 2026, 02:10 PM",
    status: "DELIVERED",
    deliveryType: "DIRECT",
    transport: "",
    coupon: "FESTIVE10",
    remark: "Delivered successfully.",
    items: [
      { product: "Luxury Emulsion", shade: "Magnolia", packSize: "20 L", quantity: 10 },
    ],
  },
];

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  },
  IN_PRODUCTION: {
    label: "In Production",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Factory,
  },
  READY: {
    label: "Ready",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  DISPATCHED: {
    label: "Dispatched",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: Package,
  },
};

const STATUS_FLOW = ["PENDING", "IN_PRODUCTION", "READY", "DISPATCHED", "DELIVERED"];

function getNextStatus(status) {
  const index = STATUS_FLOW.indexOf(status);
  return index >= 0 && index < STATUS_FLOW.length - 1
    ? STATUS_FLOW[index + 1]
    : null;
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deliveryFilter, setDeliveryFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      production: orders.filter((o) => o.status === "IN_PRODUCTION").length,
      ready: orders.filter((o) => o.status === "READY").length,
      dispatched: orders.filter((o) => o.status === "DISPATCHED").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.dealer.name.toLowerCase().includes(query) ||
        order.dealer.phone.toLowerCase().includes(query) ||
        order.dealer.city.toLowerCase().includes(query) ||
        order.items.some(
          (item) =>
            item.product.toLowerCase().includes(query) ||
            item.shade.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      const matchesDelivery =
        deliveryFilter === "ALL" || order.deliveryType === deliveryFilter;

      return matchesSearch && matchesStatus && matchesDelivery;
    });
  }, [orders, search, statusFilter, deliveryFilter]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    setSelectedOrder((current) =>
      current && current.id === orderId
        ? { ...current, status: newStatus }
        : current
    );
  };

  const handleNextStatus = (order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;
    updateOrderStatus(order.id, nextStatus);
  };

  const totalQuantity = (order) =>
    order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDeliveryFilter("ALL");
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
              Orders Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage orders and move them through the production and delivery workflow.
            </p>
          </div>

          <button
            onClick={() => setOrders(INITIAL_ORDERS)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Reset Demo Data
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {[
            ["Total Orders", stats.total, "text-gray-900"],
            ["Pending", stats.pending, "text-amber-600"],
            ["In Production", stats.production, "text-blue-600"],
            ["Ready", stats.ready, "text-emerald-600"],
            ["Dispatched", stats.dispatched, "text-purple-600"],
            ["Delivered", stats.delivered, "text-green-600"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium text-gray-500">{label}</p>
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order, dealer, phone, city, product..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B5220E] focus:bg-white focus:ring-2 focus:ring-[#B5220E]/10"
              />
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-10 text-sm font-medium outline-none focus:border-[#B5220E] md:w-48"
              >
                <option value="ALL">All Status</option>
                {STATUS_FLOW.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_CONFIG[status].label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <select
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 pr-10 text-sm font-medium outline-none focus:border-[#B5220E] md:w-48"
              >
                <option value="ALL">All Delivery</option>
                <option value="DIRECT">Direct Delivery</option>
                <option value="TRANSPORT">Transport Delivery</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <button
              onClick={resetFilters}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Orders table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-gray-900">All Orders</h2>
              <p className="text-xs text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-4 font-semibold">Order</th>
                  <th className="px-5 py-4 font-semibold">Dealer</th>
                  <th className="px-5 py-4 font-semibold">Created By</th>
                  <th className="px-5 py-4 font-semibold">Items</th>
                  <th className="px-5 py-4 font-semibold">Qty</th>
                  <th className="px-5 py-4 font-semibold">Delivery</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const nextStatus = getNextStatus(order.status);

                  return (
                    <tr key={order.id} className="transition hover:bg-gray-50/70">
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-900">{order.id}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {order.createdAt}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {order.dealer.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.dealer.city}, {order.dealer.state}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {order.createdBy}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.createdByRole}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                          {order.items.length} lines
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-gray-900">
                        {totalQuantity(order)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {order.deliveryType === "DIRECT" ? "Direct" : "Transport"}
                        </p>
                        {order.transport && (
                          <p className="mt-1 text-xs text-gray-400">
                            {order.transport}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          {nextStatus && (
                            <button
                              onClick={() => handleNextStatus(order)}
                              className="rounded-lg bg-[#B5220E] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#981d0c]"
                            >
                              {nextStatus === "IN_PRODUCTION" && "Start Production"}
                              {nextStatus === "READY" && "Mark as Ready"}
                              {nextStatus === "DISPATCHED" && "Mark Dispatched"}
                              {nextStatus === "DELIVERED" && "Mark Delivered"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Package className="mx-auto text-gray-300" size={42} />
              <h3 className="mt-3 font-bold text-gray-800">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5 md:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B5220E]">
                  Order Details
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedOrder.id}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedOrder.createdAt}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={21} />
              </button>
            </div>

            <div className="max-h-[calc(92vh-90px)] overflow-y-auto p-5 md:p-6">
              {/* Status progression */}
              <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-bold text-gray-900">Order Progress</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>

                <div className="grid grid-cols-5 gap-1">
                  {STATUS_FLOW.map((status, index) => {
                    const currentIndex = STATUS_FLOW.indexOf(selectedOrder.status);
                    const active = index <= currentIndex;

                    return (
                      <div key={status} className="text-center">
                        <div
                          className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                            active
                              ? "bg-[#B5220E] text-white"
                              : "bg-white text-gray-400 border border-gray-200"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <p
                          className={`mt-2 text-[10px] font-semibold md:text-xs ${
                            active ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {STATUS_CONFIG[status].label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Dealer */}
                <div className="rounded-2xl border border-gray-100 p-5">
                  <h3 className="mb-4 font-bold text-gray-900">
                    Dealer Details
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <InfoRow label="Name" value={selectedOrder.dealer.name} />
                    <InfoRow label="Phone" value={selectedOrder.dealer.phone} />
                    <InfoRow label="Email" value={selectedOrder.dealer.email} />
                    <InfoRow
                      label="Location"
                      value={`${selectedOrder.dealer.city}, ${selectedOrder.dealer.state}`}
                    />
                  </div>
                </div>

                {/* Delivery */}
                <div className="rounded-2xl border border-gray-100 p-5">
                  <h3 className="mb-4 font-bold text-gray-900">
                    Delivery Details
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <InfoRow
                      label="Type"
                      value={
                        selectedOrder.deliveryType === "DIRECT"
                          ? "Direct Delivery"
                          : "Transport Delivery"
                      }
                    />
                    <InfoRow
                      label="Transport"
                      value={selectedOrder.transport || "—"}
                    />
                    <InfoRow label="Coupon" value={selectedOrder.coupon} />
                    <InfoRow label="Created By" value={selectedOrder.createdBy} />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mt-5 rounded-2xl border border-gray-100">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h3 className="font-bold text-gray-900">Order Items</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-3">Product</th>
                        <th className="px-5 py-3">Shade</th>
                        <th className="px-5 py-3">Pack Size</th>
                        <th className="px-5 py-3 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={`${item.product}-${item.shade}-${index}`}>
                          <td className="px-5 py-3 font-medium text-gray-800">
                            {item.product}
                          </td>
                          <td className="px-5 py-3 text-gray-600">
                            {item.shade}
                          </td>
                          <td className="px-5 py-3 text-gray-600">
                            {item.packSize}
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-gray-900">
                            {item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan="3"
                          className="px-5 py-3 text-right font-bold text-gray-700"
                        >
                          Total Quantity
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-[#B5220E]">
                          {totalQuantity(selectedOrder)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Remark */}
              <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                <h3 className="mb-2 font-bold text-gray-900">Remark</h3>
                <p className="text-sm text-gray-600">
                  {selectedOrder.remark || "No remark added."}
                </p>
              </div>

              {/* Actions */}
              {getNextStatus(selectedOrder.status) && (
                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#B5220E]/10 bg-[#B5220E]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-gray-900">
                      Next Action
                    </p>
                    <p className="text-sm text-gray-500">
                      Move this order to{" "}
                      <strong>
                        {STATUS_CONFIG[getNextStatus(selectedOrder.status)].label}
                      </strong>
                      .
                    </p>
                  </div>

                  <button
                    onClick={() => handleNextStatus(selectedOrder)}
                    className="rounded-xl bg-[#B5220E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#981d0c]"
                  >
                    {getNextStatus(selectedOrder.status) === "IN_PRODUCTION" &&
                      "Start Production"}
                    {getNextStatus(selectedOrder.status) === "READY" &&
                      "Mark as Ready"}
                    {getNextStatus(selectedOrder.status) === "DISPATCHED" &&
                      "Mark as Dispatched"}
                    {getNextStatus(selectedOrder.status) === "DELIVERED" &&
                      "Mark as Delivered"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-right font-medium text-gray-800">{value}</span>
    </div>
  );
}
