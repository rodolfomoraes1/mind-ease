import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Container, Skeleton } from '@mui/material';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/shared/AppLayout';
import { BackgroundAnimation } from '@/components/dashboard/BackgroundAnimation';
import { FocusModeWrapper, HideInFocusMode } from '@/components/dashboard/FocusModeWrapper';
import { SummaryModeWrapper } from '@/components/dashboard/SummaryModeWrapper';
import { CognitiveAlert } from '@/components/shared/CognitiveAlert';
import { TasksProvider } from '@/context/TasksContext';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useCognitiveFeatures } from '@/hooks/useCognitiveFeatures';

const UserInfoCard = dynamic(
  () => import('@/components/dashboard/UserInfoCard').then((m) => ({ default: m.UserInfoCard })),
  { loading: () => <Skeleton variant="rounded" height={120} sx={{ mb: 2, borderRadius: 3 }} /> },
);

const RoutineCharts = dynamic(
  () => import('@/components/dashboard/RoutineCharts').then((m) => ({ default: m.RoutineCharts })),
  { loading: () => <Skeleton variant="rounded" height={200} sx={{ mb: 2, borderRadius: 3 }} /> },
);

const TaskOrganizer = dynamic(
  () => import('@/components/dashboard/TaskOrganizer').then((m) => ({ default: m.TaskOrganizer })),
  { loading: () => <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} /> },
);

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