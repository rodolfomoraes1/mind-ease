import React from 'react';
import Head from 'next/head';
import { Container } from '@mui/material';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/shared/AppLayout';
import { UserInfoCard } from '@/components/dashboard/UserInfoCard';
import { BackgroundAnimation } from '@/components/dashboard/BackgroundAnimation';
import { RoutineCharts } from '@/components/dashboard/RoutineCharts';
import { TaskOrganizer } from '@/components/dashboard/TaskOrganizer';
import { useUserInfo } from '@/hooks/useUserInfo';

function DashboardContent() {
  const { loading } = useUserInfo();

  return (
    <>
      <Head>
        <title>Mind Ease - Dashboard</title>
        <meta name="description" content="Dashboard personalizado com preferências cognitivas" />
      </Head>

      <BackgroundAnimation />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <UserInfoCard loading={loading} />

        <RoutineCharts loading={loading} />

        <TaskOrganizer loading={loading} />
      </Container>
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