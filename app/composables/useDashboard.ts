import type {
    DashboardStatsResponse,
    DashboardActivityResponse,
    DashboardStat,
    ActivityItem,
} from "~/types";

export const useDashboard = () => {
    const { get } = useApi();

    // Stats
    const stats = ref<DashboardStat[]>([]);
    const loadingStats = ref(false);

    const fetchStats = async (): Promise<DashboardStat[]> => {
        loadingStats.value = true;
        try {
            const response = await get<DashboardStatsResponse>("/dashboard/stats/");
            if (response.success && response.data) {
                stats.value = response.data.stats;
                return response.data.stats;
            }
            return [];
        }
        finally {
            loadingStats.value = false;
        }
    };

    // Activity
    const activities = ref<ActivityItem[]>([]);
    const loadingActivity = ref(false);

    const fetchActivity = async (limit = 5): Promise<ActivityItem[]> => {
        loadingActivity.value = true;
        try {
            const response = await get<DashboardActivityResponse>("/dashboard/activity/", {
                limit,
            });
            if (response.success && response.data) {
                activities.value = response.data.activities;
                return response.data.activities;
            }
            return [];
        }
        finally {
            loadingActivity.value = false;
        }
    };

    return {
        stats,
        loadingStats,
        fetchStats,
        activities,
        loadingActivity,
        fetchActivity,
    };
};
