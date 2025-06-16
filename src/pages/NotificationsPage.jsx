import Header from "../components/common/Header";
import NotificationsTable from "../components/nofitication/NotificationsTable";

const NotificationsPage = () => {
    return (
        <div className='h-screen flex flex-col'>
            <Header title='Notifications' />
            <div className='flex-1 overflow-y-auto'>
                <div className='max-w-7xl mx-auto p-6'>
                    <NotificationsTable />
                </div>
            </div>
        </div>
    );
}

export default NotificationsPage;