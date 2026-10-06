import { useMemo, useState } from "react";
import {
  Search,
  Factory,
  Package,
  Layers3,
  Users,
  Eye,
  X,
  ChevronDown,
} from "lucide-react";

const mockOrders = [
  {
    id: "ORD-2026-148",
    dealer: "Raipur Paint Centre",
    salesperson: "Rahul Sharma",
    status: "PENDING",
    createdAt: "2026-09-28",
    items: [
      {
        product: "Interior Premium",
        shade: "Ivory White",
        packSize: "1 L",
        quantity: 30,
      },
      {
        product: "Interior Premium",
        shade: "Ivory White",
        packSize: "4 L",
        quantity: 20,
      },
      {
        product: "Exterior Weather Shield",
        shade: "Pearl Grey",
        packSize: "20 L",
        quantity: 10,
      },
    ],
  },
  {
    id: "ORD-2026-147",
    dealer: "Sharma Hardware & Paints",
    salesperson: "Priya Gupta",
    status: "IN_PRODUCTION",
    createdAt: "2026-09-27",
    items: [
      {
        product: "Interior Premium",
        shade: "Ivory White",
        packSize: "1 L",
        quantity: 20,
      },
      {
        product: "Interior Premium",
        shade: "Sky Blue",
        packSize: "4 L",
        quantity: 15,
      },
      {
        product: "Exterior Weather Shield",
        shade: "Pearl Grey",
        packSize: "20 L",
        quantity: 15,
      },
    ],
  },
  {
    id: "ORD-2026-146",
    dealer: "New Look Interiors",
    salesperson: "Amit Verma",
    status: "READY",
    createdAt: "2026-09-26",
    items: [
      {
        product: "Interior Premium",
        shade: "Ivory White",
        packSize: "1 L",
        quantity: 25,
      },
      {
        product: "Interior Premium",
        shade: "Sky Blue",
        packSize: "4 L",
        quantity: 10,
      },
    ],
  },
  {
    id: "ORD-2026-145",
    dealer: "Bhopal Building Depot",
    salesperson: "Sneha Joshi",
    status: "DISPATCHED",
    createdAt: "2026-09-25",
    items: [
      {
        product: "Exterior Weather Shield",
        shade: "Pearl Grey",
        packSize: "20 L",
        quantity: 20,
      },
      {
        product: "Interior Premium",
        shade: "Ivory White",
        packSize: "1 L",
        quantity: 15,
      },
    ],
  },
  {
    id: "ORD-2026-144",
    dealer: "Indore Decor House",
    salesperson: "Raj Patel",
    status: "DELIVERED",
    createdAt: "2026-09-24",
    items: [
      {
        product: "Interior Premium",
        shade: "Ivory White",
        packSize: "1 L",
        quantity: 10,
      },
      {
        product: "Wood Finish",
        shade: "Walnut Brown",
        packSize: "4 L",
        quantity: 8,
      },
    ],
  },
];

const statusConfig = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
  },
  IN_PRODUCTION: {
    label: "In Production",
    className: "bg-blue-50 text-blue-700",
  },
  READY: {
    label: "Ready",
    className: "bg-emerald-50 text-emerald-700",
  },
  DISPATCHED: {
    label: "Dispatched",
    className: "bg-purple-50 text-purple-700",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-slate-100 text-slate-700",
  },
};

const ProductionSummary = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);

  /*
   * Important:
   * We do NOT merge/delete the original orders.
   *
   * We only create a separate aggregation for production.
   *
   * Unique production key:
   * Product + Shade + Pack Size
   */
  const productionData = useMemo(() => {
    const map = {};

    mockOrders.forEach((order) => {
      order.items.forEach((item) => {
        const key = [
          item.product,
          item.shade,
          item.packSize,
        ].join("___");

        if (!map[key]) {
          map[key] = {
            id: key,
            product: item.product,
            shade: item.shade,
            packSize: item.packSize,
            totalQuantity: 0,
            orderCount: 0,
            dealers: [],
            orders: [],
            statuses: [],
          };
        }

        map[key].totalQuantity += item.quantity;

        if (!map[key].orders.includes(order.id)) {
          map[key].orders.push(order.id);
          map[key].orderCount += 1;
        }

        if (!map[key].dealers.includes(order.dealer)) {
          map[key].dealers.push(order.dealer);
        }

        if (!map[key].statuses.includes(order.status)) {
          map[key].statuses.push(order.status);
        }
      });
    });

    return Object.values(map);
  }, []);

  const products = useMemo(() => {
    return [...new Set(productionData.map((item) => item.product))];
  }, [productionData]);

  const filteredData = useMemo(() => {
    return productionData.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.product.toLowerCase().includes(searchText) ||
        item.shade.toLowerCase().includes(searchText) ||
        item.packSize.toLowerCase().includes(searchText) ||
        item.dealers.some((dealer) =>
          dealer.toLowerCase().includes(searchText)
        );

      const matchesProduct =
        productFilter === "ALL" ||
        item.product === productFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        item.statuses.includes(statusFilter);

      return matchesSearch && matchesProduct && matchesStatus;
    });
  }, [productionData, search, productFilter, statusFilter]);

  const totalProductionQty = productionData.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );

  const totalProductionLines = productionData.length;

  const totalDealers = new Set(
    productionData.flatMap((item) => item.dealers)
  ).size;

  const inProductionQty = productionData
    .filter((item) => item.statuses.includes("IN_PRODUCTION"))
    .reduce((sum, item) => sum + item.totalQuantity, 0);

  const getProductionStatus = (statuses) => {
    if (statuses.includes("IN_PRODUCTION")) {
      return "IN_PRODUCTION";
    }

    if (statuses.includes("PENDING")) {
      return "PENDING";
    }

    if (statuses.includes("READY")) {
      return "READY";
    }

    if (statuses.includes("DISPATCHED")) {
      return "DISPATCHED";
    }

    return "DELIVERED";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Production Summary
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consolidated production requirement by product, shade and pack size.
        </p>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Factory className="mt-0.5 h-5 w-5 text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-blue-900">
              Production aggregation
            </p>

            <p className="mt-1 text-sm text-blue-700">
              Dealer-wise orders remain separate. This screen only consolidates
              quantities for production planning.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Production Qty"
          value={totalProductionQty}
          suffix="Units"
          icon={Package}
        />

        <StatCard
          title="Production Lines"
          value={totalProductionLines}
          suffix="Lines"
          icon={Layers3}
        />

        <StatCard
          title="Dealers"
          value={totalDealers}
          suffix="Dealers"
          icon={Users}
        />

        <StatCard
          title="In Production"
          value={inProductionQty}
          suffix="Units"
          icon={Factory}
        />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search product, shade, pack size or dealer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Product */}
          <div className="relative">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">All Products</option>

              {products.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PRODUCTION">
                In Production
              </option>
              <option value="READY">Ready</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="DELIVERED">Delivered</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Production Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Consolidated Production
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredData.length} production line
              {filteredData.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {filteredData.reduce(
              (sum, item) => sum + item.totalQuantity,
              0
            )}{" "}
            Units
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Shade
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pack Size
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Qty
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Orders
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Dealers
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => {
                const productionStatus = getProductionStatus(
                  item.statuses
                );

                const status =
                  statusConfig[productionStatus] ||
                  statusConfig.PENDING;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">
                        {item.product}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        Production SKU
                      </div>
                    </td>

                    {/* Shade */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full border border-slate-300 bg-slate-100" />

                        <span className="text-sm font-medium text-slate-700">
                          {item.shade}
                        </span>
                      </div>
                    </td>

                    {/* Pack */}
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700">
                        {item.packSize}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-5 py-4 text-center">
                      <span className="text-lg font-bold text-slate-900">
                        {item.totalQuantity}
                      </span>
                    </td>

                    {/* Orders */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                        {item.orderCount}
                      </span>
                    </td>

                    {/* Dealers */}
                    <td className="px-5 py-4">
                      <div className="max-w-[220px]">
                        <p className="text-sm text-slate-700">
                          {item.dealers[0]}
                        </p>

                        {item.dealers.length > 1 && (
                          <p className="mt-1 text-xs font-medium text-blue-600">
                            +{item.dealers.length - 1} more dealer
                            {item.dealers.length - 1 !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="px-5 py-16 text-center">
            <Factory className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-3 font-semibold text-slate-900">
              No production data found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <ProductionDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  suffix,
  icon: Icon,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {value}
            </h3>

            <span className="text-xs text-slate-400">
              {suffix}
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-2.5">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

const ProductionDetailsModal = ({
  item,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Production Details
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {item.product}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Summary */}
        <div className="grid grid-cols-3 gap-4 border-b border-slate-200 p-6">
          <InfoBox
            label="Shade"
            value={item.shade}
          />

          <InfoBox
            label="Pack Size"
            value={item.packSize}
          />

          <InfoBox
            label="Total Quantity"
            value={`${item.totalQuantity} Units`}
          />
        </div>

        {/* Dealers */}
        <div className="p-6">
          <h3 className="mb-4 font-semibold text-slate-900">
            Contributing Orders
          </h3>

          <div className="space-y-3">
            {item.orders.map((orderId, index) => (
              <div
                key={orderId}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {orderId}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.dealers[index] || item.dealers[0]}
                  </p>
                </div>

                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Order Included
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default ProductionSummary;