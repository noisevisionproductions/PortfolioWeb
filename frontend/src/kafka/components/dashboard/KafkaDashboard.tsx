import React from "react";
import {useTranslation} from "react-i18next";
import {useRegistrationStats} from "@/kafka/hooks/useRegistrationStats";
import {Loader2} from "lucide-react";
import {ErrorMessage} from "@/components/shared/ErrorMessage";
import {useNavigate} from "react-router-dom";
import {StatsOverview} from "@/kafka/components/dashboard/StatsOverview";
import {RegistrationsChart} from "@/kafka/components/dashboard/RegistrationsChart";
import {RecentRegistrations} from "@/kafka/components/dashboard/RecentRegistrations";
import {Header} from "@/components/shared/Header";

export const KafkaDashboard: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {stats, recentEvents, loading, error} = useRegistrationStats();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorMessage
                error={error}
                onBack={() => navigate('/')}
                t={t}
            />
        )
    }

    return (
        <div>
            <Header
                title={t('header.title')}
                navigation={{
                    login: t('header.navigation.login'),
                    logout: t('header.navigation.logout'),
                }}
            />
            <div className="container mx-auto p-4 space-y-6 mt-20">
                <h1 className="text-2xl font-bold mb-6">
                    {t('kafka.dashboard.title')}
                </h1>

                {stats && (
                    <div className="space-y-6">
                        <StatsOverview stats={stats}/>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    {t('kafka.dashboard.chart.title')}
                                </h2>
                                <RegistrationsChart events={recentEvents}/>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    {t('kafka.dashboard.recent.title')}
                                </h2>
                                <RecentRegistrations events={recentEvents}/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};