import { useState } from "react";
import Header from "../components/common/Header";
import UsersTable from "../components/users/UsersTable";
import { UserStatsProvider } from "../components/context/UserStatsContext";

const UsersPage = () => {
  const [stats] = useState(null);
  const [loading] = useState(false);
  const [error] = useState(null);

  return (
    <UserStatsProvider stats={stats} loading={loading} error={error}>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Users" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <UsersTable />
        </main>
      </div>
    </UserStatsProvider>
  );
};

export default UsersPage;