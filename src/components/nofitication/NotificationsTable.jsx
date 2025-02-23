import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import EditNotificationModal from "./EditNotificationModal";

const notificationsData = [
	{ id: 1, content: "New feature update available!", type: "System", navigation: "/updates", sentAt: "2024-03-01" },
	{ id: 2, content: "50% off on premium plans!", type: "Promotion", navigation: "/offers", sentAt: "2024-02-25" },
	{ id: 3, content: "Scheduled maintenance on March 5", type: "System", navigation: "/status", sentAt: "2024-02-28" },
];

const NotificationsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [notifications, setNotifications] = useState(notificationsData);
	const [editNotificationId, setEditNotificationId] = useState(null);

	const handleSearch1 = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
	  };

	const handleEdit = (notificationId) => {
		setEditNotificationId(notificationId);
	}

	const handleSave = (updatedNotification) => {
		const updatedNotifications = notifications.map(noti =>
			noti.id === updatedNotification.id ? updatedNotification : noti
		);
		setNotifications(updatedNotifications);
		setEditNotificationId(null);
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 min-h-screen'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Notifications</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search notifications...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch1}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Content</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Type</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Navigation</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Sent At</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{notifications
						.filter(
							(noti) => noti.content.toLowerCase().includes(searchTerm) || noti.type.toLowerCase().includes(searchTerm)
						).map((noti) => (
							<motion.tr
								key={noti.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm font-medium text-gray-100'>{noti.content}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{noti.type}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='text-sm text-gray-300'>{noti.navigation}</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='text-sm text-gray-300'>{noti.sentAt}</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEdit(noti.id)}>Edit</button>
									<button className='text-red-400 hover:text-red-300'>Delete</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{editNotificationId && <EditNotificationModal notificationId={editNotificationId} onClose={() => setEditNotificationId(null)} onSave={handleSave}/>}
		</motion.div>
	);
};

export default NotificationsTable;
