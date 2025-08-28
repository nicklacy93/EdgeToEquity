import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserMetrics {
    conceptsLearned: number;
    strategiesBuilt: number;
    journalEntries: number;
    learningStreak: number;
    todayTimeSpent: string;
    weeklyGoal: string;
    completionRate: number;
    lastActiveDate: string;
    totalFocusTime: number; // in minutes
    strategiesCompleted: number;
    strategiesDraft: number;
    strategiesActive: number;
}

interface UserProfile {
    tradingExperience: string;
    primaryGoal: string;
    marketFocus: string;
    name: string;
}

interface UserStore {
    // User Profile
    userProfile: UserProfile;
    setUserProfile: (profile: Partial<UserProfile>) => void;

    // Metrics
    metrics: UserMetrics;

    // Actions
    incrementConceptsLearned: () => void;
    incrementStrategiesBuilt: () => void;
    incrementJournalEntries: () => void;
    updateLearningStreak: () => void;
    addFocusTime: (minutes: number) => void;
    updateCompletionRate: () => void;
    markStrategyComplete: () => void;
    markStrategyDraft: () => void;
    markStrategyActive: () => void;

    // Reset for new users
    initializeNewUser: (profile: UserProfile) => void;
}

const defaultMetrics: UserMetrics = {
    conceptsLearned: 0,
    strategiesBuilt: 0,
    journalEntries: 0,
    learningStreak: 0,
    todayTimeSpent: "0m",
    weeklyGoal: "5 hours",
    completionRate: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalFocusTime: 0,
    strategiesCompleted: 0,
    strategiesDraft: 0,
    strategiesActive: 0,
};

const defaultProfile: UserProfile = {
    tradingExperience: "",
    primaryGoal: "",
    marketFocus: "",
    name: "",
};

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            userProfile: defaultProfile,
            metrics: defaultMetrics,

            setUserProfile: (profile) => {
                set((state) => ({
                    userProfile: { ...state.userProfile, ...profile }
                }));
            },

            incrementConceptsLearned: () => {
                set((state) => ({
                    metrics: {
                        ...state.metrics,
                        conceptsLearned: state.metrics.conceptsLearned + 1
                    }
                }));
            },

            incrementStrategiesBuilt: () => {
                set((state) => ({
                    metrics: {
                        ...state.metrics,
                        strategiesBuilt: state.metrics.strategiesBuilt + 1
                    }
                }));
            },

            incrementJournalEntries: () => {
                set((state) => ({
                    metrics: {
                        ...state.metrics,
                        journalEntries: state.metrics.journalEntries + 1
                    }
                }));
            },

            updateLearningStreak: () => {
                const today = new Date().toISOString().split('T')[0];
                const { metrics } = get();

                if (metrics.lastActiveDate === today) {
                    return; // Already updated today
                }

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (metrics.lastActiveDate === yesterdayStr) {
                    // Consecutive day
                    set((state) => ({
                        metrics: {
                            ...state.metrics,
                            learningStreak: state.metrics.learningStreak + 1,
                            lastActiveDate: today
                        }
                    }));
                } else {
                    // Break in streak, reset to 1
                    set((state) => ({
                        metrics: {
                            ...state.metrics,
                            learningStreak: 1,
                            lastActiveDate: today
                        }
                    }));
                }
            },

            addFocusTime: (minutes: number) => {
                set((state) => {
                    const newTotalTime = state.metrics.totalFocusTime + minutes;
                    const hours = Math.floor(newTotalTime / 60);
                    const mins = newTotalTime % 60;
                    const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

                    return {
                        metrics: {
                            ...state.metrics,
                            totalFocusTime: newTotalTime,
                            todayTimeSpent: timeString
                        }
                    };
                });
            },

            updateCompletionRate: () => {
                const { metrics } = get();
                const totalStrategies = metrics.strategiesBuilt;
                const completedStrategies = metrics.strategiesCompleted;

                if (totalStrategies === 0) {
                    set((state) => ({
                        metrics: { ...state.metrics, completionRate: 0 }
                    }));
                } else {
                    const rate = Math.round((completedStrategies / totalStrategies) * 100);
                    set((state) => ({
                        metrics: { ...state.metrics, completionRate: rate }
                    }));
                }
            },

            markStrategyComplete: () => {
                set((state) => ({
                    metrics: {
                        ...state.metrics,
                        strategiesCompleted: state.metrics.strategiesCompleted + 1
                    }
                }));
                get().updateCompletionRate();
            },

            markStrategyDraft: () => {
                set((state) => ({
                    metrics: {
                        ...state.metrics,
                        strategiesDraft: state.metrics.strategiesDraft + 1
                    }
                }));
            },

            markStrategyActive: () => {
                set((state) => ({
                    metrics: {
                        ...state.metrics,
                        strategiesActive: state.metrics.strategiesActive + 1
                    }
                }));
            },

            initializeNewUser: (profile: UserProfile) => {
                set({
                    userProfile: profile,
                    metrics: defaultMetrics
                });
            },
        }),
        {
            name: 'edge-to-equity-user-data',
            partialize: (state) => ({
                userProfile: state.userProfile,
                metrics: state.metrics,
            }),
        }
    )
);
