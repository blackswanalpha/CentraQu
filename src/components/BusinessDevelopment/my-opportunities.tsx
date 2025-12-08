"use client";

import { motion } from "framer-motion";
import { User, Eye, TrendingUp } from "lucide-react";

interface TeamMember {
  name: string;
  count: number;
  value: number;
}

interface MyOpportunitiesProps {
  teamMembers: TeamMember[];
  onViewPipeline: (member: string) => void;
  loading?: boolean;
}

export function MyOpportunities({
  teamMembers,
  onViewPipeline,
  loading = false,
}: MyOpportunitiesProps) {
  const totalOpportunities = teamMembers.reduce((sum, member) => sum + member.count, 0);
  const totalValue = teamMembers.reduce((sum, member) => sum + member.value, 0);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          MY OPPORTUNITIES
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
    >
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg font-semibold text-dark dark:text-white mb-4"
      >
        MY OPPORTUNITIES
      </motion.h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center"
        >
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Ops</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{totalOpportunities}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center"
        >
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Total Value</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">
            ${(totalValue / 1000).toFixed(0)}K
          </p>
        </motion.div>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member, index) => (
          <motion.div
            key={`${member.name}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (index * 0.1) }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 5 }}
                className="p-2 bg-primary/10 rounded-full"
              >
                <User className="h-4 w-4 text-primary" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-dark dark:text-white">
                  {member.name}
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-gray-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {member.count} opportunities
                  </p>
                </div>
              </div>
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              className="text-sm font-bold text-primary"
            >
              ${(member.value / 1000).toFixed(0)}K
            </motion.span>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewPipeline("")}
        className="mt-4 w-full px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="h-4 w-4" />
        VIEW MY PIPELINE
      </motion.button>
    </motion.div>
  );
}

