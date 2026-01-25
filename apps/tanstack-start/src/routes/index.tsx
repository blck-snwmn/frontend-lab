import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutGrid, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
        <p className="text-gray-400 mb-10">Select an app to get started.</p>

        <div className="space-y-4">
          <Link
            to="/kanban"
            className="group flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <LayoutGrid className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                Kanban
              </h2>
              <p className="text-sm text-gray-500">Manage tasks with columns</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/notes"
            className="group flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                Notes
              </h2>
              <p className="text-sm text-gray-500">Create and organize notes</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
