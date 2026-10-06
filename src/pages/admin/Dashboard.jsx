import {
  ShoppingCart,
  Clock3,
  Factory,
  CheckCircle2,
  Truck,
  Users,
  UserRound,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

const stats = [
  {
    title: "Total Orders",
    value: "248",
    change: "+12.5%",
    icon: ShoppingCart,
    description: "vs last month",
  },
  {
    title: "Pending",
    value: "24",
    change: "+4",
    icon: Clock3,
    description: "needs attention",
  },
  {
    title: "In Production",
    value: "38",
    change: "+8",
    icon: Factory,
    description: "currently active",
  },
  {
    title: "Ready",
    value: "16",
    change: "+3",
    icon: CheckCircle2,
    description: "ready for dispatch",
  },
  {
    title: "Dispatched",
    value: "170",
    change: "+18",
    icon: Truck,
    description: "this month",
  },
  {
    title: "Dealers",
    value: "86",
    change: "+6",
    icon: Users,
    description: "active dealers",
  },
  {
    title: "Salespersons",
    value: "14",
    change: "+2",
    icon: UserRound,
    description: "active members",
  },
];

const recentOrders = [
  {
    id: "ORD-2026-148",
    dealer: "Raipur Paint Centre",
    salesperson: "Rahul Sharma",
    quantity: "40 Units",
    status: "Pending",
    date: "02 Oct 2026",
  },
  {
    id: "ORD-2026-147",
    dealer: "Sharma Hardware",
    salesperson: "Priya Gupta",
    quantity: "33 Units",
    status: "In Production",
    date: "02 Oct 2026",
  },
  {
    id: "ORD-2026-146",
    dealer: "New Look Interiors",
    salesperson: "Amit Verma",
    quantity: "15 Units",
    status: "Ready",
    date: "01 Oct 2026",
  },
  {
    id: "ORD-2026-145",
    dealer: "Bhopal Building Depot",
    salesperson: "Sneha Joshi",
    quantity: "70 Units",
    status: "Dispatched",
    date: "01 Oct 2026",
  },
];

const productionSummary = [
  {
    product: "Interior Premium",
    shade: "Ivory White",
    packSize: "1 L",
    quantity: 35,
  },
  {
    product: "Interior Premium",
    shade: "Ivory White",
    packSize: "4 L",
    quantity: 52,
  },
  {
    product: "Interior Premium",
    shade: "Pastel Blue",
    packSize: "20 L",
    quantity: 18,
  },
  {
    product: "Exterior Primer",
    shade: "White Base",
    packSize: "20 L",
    quantity: 35,
  },
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  "In Production": "bg-blue-50 text-blue-700",
  Ready: "bg-emerald-50 text-emerald-700",
  Dispatched: "bg-purple-50 text-purple-700",
};

const Dashboard = () => {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Thursday, 02 October 2026
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your orders today.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          View All Orders
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-7">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon size={18} />
                </div>

                <span className="text-xs font-semibold text-emerald-600">
                  {stat.change}
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-700">
                {stat.title}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent Orders */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="font-bold text-slate-900">Recent Orders</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Latest orders received
              </p>
            </div>

            <button className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400">
                    Order
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400">
                    Dealer
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400">
                    Salesperson
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400">
                    Quantity
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400">
                    Date
                  </th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">
                        {order.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {order.dealer}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {order.salesperson}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {order.quantity}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500">
                      {order.date}
                    </td>

                    <td className="px-5 py-4">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Production Summary */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="font-bold text-slate-900">
                Production Summary
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Consolidated production requirement
              </p>
            </div>

            <button className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {productionSummary.map((item, index) => (
              <div
                key={`${item.product}-${item.shade}-${item.packSize}-${index}`}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {item.product}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{item.shade}</span>
                    <span>•</span>
                    <span>{item.packSize}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold text-slate-900">
                    {item.quantity}
                  </p>
                  <p className="text-[11px] text-slate-400">units</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
            <p className="text-xs text-slate-500">
              Quantities are consolidated across all active dealer orders.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;