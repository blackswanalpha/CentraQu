"use client";

import {
  Building2,
  ClipboardList,
  Clock,
  Users,
  Lightbulb,
  Briefcase,
  Calendar,
  Headphones,
  ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { workspaceService, type WorkspaceStats } from "@/services/workspace.service";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

export default function WorkspacePage() {
  const router = useRouter();
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await workspaceService.getWorkspaceStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch workspace stats:", err);
        setError(err.message || "Failed to load workspace data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
          <motion.div
            className="flex flex-col w-full max-w-4xl flex-1"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              className="flex flex-col items-center justify-start gap-3 p-4 text-center"
              variants={itemVariants}
            >
              <h1 className="text-slate-900 dark:text-slate-50 text-4xl font-black leading-tight tracking-[-0.033em]">
                Switch Organization
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                Select an organization to view its dashboard.
              </p>
            </motion.div>

            {error && (
              <motion.div
                className="col-span-full p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
              </motion.div>
            )}

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4"
              variants={containerVariants}
            >
              {/* Card 1: AceQu International */}
              <motion.div
                className="flex flex-col items-stretch justify-start rounded-xl border border-primary dark:border-primary/80 bg-white dark:bg-background-dark shadow-sm transition-all"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                    <img
                      src="https://www.acequ.com/wp-content/uploads/2021/03/AceQu-LOGO_2021-PDF.png"
                      alt="AceQu International"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <p className="text-slate-900 dark:text-slate-50 text-lg font-bold leading-tight tracking-[-0.015em]">
                      AceQu International
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                      Audit Practice
                    </p>
                  </div>
                  <motion.a
                    href="https://www.acequ.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
                    aria-label="Visit AceQu International website"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </motion.a>
                </div>
                <div className="flex flex-col gap-4 p-6">
                  {loading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      ))}
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="flex items-center gap-3"
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={statVariants}
                      >
                        <ClipboardList className="text-slate-500 dark:text-slate-400 w-6 h-6" />
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          Active Audits:
                        </p>
                        <p className="ml-auto text-slate-900 dark:text-slate-50 text-base font-semibold leading-normal">
                          {stats?.audit.active_audits ?? 0}
                        </p>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-3"
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={statVariants}
                      >
                        <Clock className="text-slate-500 dark:text-slate-400 w-6 h-6" />
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          Pending Reviews:
                        </p>
                        <p className="ml-auto text-slate-900 dark:text-slate-50 text-base font-semibold leading-normal">
                          {stats?.audit.pending_reviews ?? 0}
                        </p>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-3"
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={statVariants}
                      >
                        <Users className="text-slate-500 dark:text-slate-400 w-6 h-6" />
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          Team Members Online:
                        </p>
                        <p className="ml-auto text-slate-900 dark:text-slate-50 text-base font-semibold leading-normal">
                          {stats?.audit.team_members_online ?? 0}
                        </p>
                      </motion.div>
                    </>
                  )}
                </div>
                <div className="mt-auto p-6">
                  <motion.button
                    onClick={() => router.push("/auth/login")}
                    disabled={loading}
                    className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary text-white text-base font-medium leading-normal shadow-sm transition-all hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="truncate">Switch to this Org</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Card 2: Consulting Co */}
              <motion.div
                className="flex flex-col items-stretch justify-start rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Lightbulb className="text-primary w-8 h-8" />
                  </div>
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <p className="text-slate-900 dark:text-slate-50 text-lg font-bold leading-tight tracking-[-0.015em]">
                      Consulting Co
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                      Consulting Practice
                    </p>
                  </div>
                  <motion.a
                    href="https://www.acequ.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
                    aria-label="Visit Consulting Co website"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </motion.a>
                </div>
                <div className="flex flex-col gap-4 p-6">
                  {loading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      ))}
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="flex items-center gap-3"
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={statVariants}
                      >
                        <Briefcase className="text-slate-500 dark:text-slate-400 w-6 h-6" />
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          Active Projects:
                        </p>
                        <p className="ml-auto text-slate-900 dark:text-slate-50 text-base font-semibold leading-normal">
                          {stats?.consulting.active_projects ?? 0}
                        </p>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-3"
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={statVariants}
                      >
                        <Calendar className="text-slate-500 dark:text-slate-400 w-6 h-6" />
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          Upcoming Deadlines:
                        </p>
                        <p className="ml-auto text-slate-900 dark:text-slate-50 text-base font-semibold leading-normal">
                          {stats?.consulting.upcoming_deadlines ?? 0}
                        </p>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-3"
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={statVariants}
                      >
                        <Headphones className="text-slate-500 dark:text-slate-400 w-6 h-6" />
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal">
                          Client Engagements:
                        </p>
                        <p className="ml-auto text-slate-900 dark:text-slate-50 text-base font-semibold leading-normal">
                          {stats?.consulting.client_engagements ?? 0}
                        </p>
                      </motion.div>
                    </>
                  )}
                </div>
                <div className="mt-auto p-6">
                  <motion.button
                    onClick={() => router.push("/consulting/login")}
                    disabled={loading}
                    className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary text-white text-base font-medium leading-normal shadow-sm transition-all hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="truncate">Switch to this Org</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div >
  );
}
