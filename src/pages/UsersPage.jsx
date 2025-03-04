import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import UsersTable from "../components/users/UsersTable";
import UsersStat from "../components/common/UsersStat";
import { UserStatsProvider } from "../components/context/UserStatsContext";

const UsersPage = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Simulating fetching user stats (replace with actual API call)
		fetch(`${import.meta.env.VITE_API_URL}/user-stats`)
			.then((res) => res.json())
			.then((data) => {
				setStats(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err);
				setLoading(false);
			});
	}, []);

	return (
		<UserStatsProvider stats={stats} loading={loading} error={error}>
			<div className='flex-1 overflow-auto relative z-10'>
				<Header title='Users' />
				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					{/* STATS */}
					{/* <UsersStat /> */}
					{/* CRUD USERS */}
					<UsersTable />
				</main>
			</div>
		</UserStatsProvider>
	);
};

export default UsersPage;
