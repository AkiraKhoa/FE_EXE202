import Header from "../components/common/Header";
import UsersTable from "../components/users/UsersTable";
import UsersStat from "../components/common/UsersStat";
import NewsTable from "../components/news/NewsTable";

const NewsPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='News' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* CRUD USERS */}
                <NewsTable />

            </main>
        </div>
    );
}

export default NewsPage