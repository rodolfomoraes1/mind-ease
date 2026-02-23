import React from 'react';
import Head from 'next/head';
import { Container } from '@mui/material';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/shared/AppLayout';
import { UserInfoCard } from '@/components/dashboard/UserInfoCard';
import { BackgroundAnimation } from '@/components/dashboard/BackgroundAnimation';
import { FocusModeWrapper, HideInFocusMode } from '@/components/dashboard/FocusModeWrapper';
import { SummaryModeWrapper } from '@/components/dashboard/SummaryModeWrapper';
import { CognitiveAlert } from '@/components/shared/CognitiveAlert';
import { RoutineCharts } from '@/components/dashboard/RoutineCharts';
import { TaskOrganizer } from '@/components/dashboard/TaskOrganizer';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useCognitiveFeatures } from '@/hooks/useCognitiveFeatures';
import { TasksProvider } from '@/context/TasksContext';

function DashboardContent() {
  const { loading } = useUserInfo();
  const { preferences } = useCognitiveFeatures();

  const showCharts = preferences?.complexityLevel !== 'simple';

  return (
    <>
      <Head>
        <title>Mind Ease - Dashboard</title>
        <meta name="description" content="Dashboard personalizado com preferências cognitivas" />
      </Head>

      <BackgroundAnimation disabled={!preferences?.animationsEnabled} />

      <FocusModeWrapper>
        <SummaryModeWrapper>
          <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>

            <UserInfoCard loading={loading} />

            {showCharts && (
              <HideInFocusMode>
                <RoutineCharts loading={loading} />
              </HideInFocusMode>
            )}

            <TasksProvider>
              <TaskOrganizer loading={loading} />
            </TasksProvider>

          </Container>
        </SummaryModeWrapper>
      </FocusModeWrapper>

      <CognitiveAlert />
    </>
  );
}

function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

Dashboard.getLayout = (page: React.ReactElement) => (
  <AppLayout>{page}</AppLayout>
);

export default Dashboard;