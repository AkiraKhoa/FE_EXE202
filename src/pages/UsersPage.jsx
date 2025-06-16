import Header from "../components/common/Header";
import UsersTable from "../components/users/UsersTable";
import { UserStatsProvider } from "../components/context/UserStatsContext";

const UsersPage = () => {
  return (
    <UserStatsProvider>
      <div className="h-screen flex flex-col">
        <Header title="Users" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto p-6">
            <UsersTable />
          </div>
        </div>
      </div>
    </UserStatsProvider>
  );
};

export default UsersPage;