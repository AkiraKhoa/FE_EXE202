import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import EditNewModal from "./EditNewModal";

const newsData = [
	{ id: 1, title: "Breaking News", content: "Important update on global policies.", type: "Politics", url: "news/breaking-news", createdDate: "2024-01-10", lastEdited: "" },
	{ id: 2, title: "Tech Innovations", content: "New AI technology is emerging.", type: "Technology", url: "news/tech-innovations", createdDate: "2024-01-08", lastEdited: "2024-01-12" },
	{ id: 3, title: "Sports Update", content: "Team A won the championship.", type: "Sports", url: "news/sports-update", createdDate: "2024-02-05", lastEdited: "" },
	];

const NewsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [news, setNews] = useState(newsData);
	const [editNewsId, setEditNewId] = useState(null);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = newsData.filter(
			(news) => news.title.toLowerCase().includes(term) || news.content.toLowerCase().includes(term)
		);
		setFilteredNews(filtered);
	};

	const handleSearch1 = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
	  };

	const handleEdit = (newsId) => {
		setEditNewId(newsId);
	}

	const handleSave = (updatedNews) => {
		const updatedNewsData = news.map(news =>
			news.id === updatedNews.id ? updatedNews : news
		);
		setNews(updatedNewsData);
		setEditNewId(null);
	}


	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 min-h-screen'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Manage News</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search news...'
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
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Title</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Content</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Type</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Published</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>URL</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{news
						.filter(
							(news) => news.title.toLowerCase().includes(searchTerm) || 
							news.content.toLowerCase().includes(searchTerm) ||
							news.type.toLowerCase().includes(searchTerm) 
						).map((news) => (
							<motion.tr
								key={news.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm font-medium text-gray-100'>{news.title}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300 truncate w-64'>{news.content}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{news.type}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='text-sm text-gray-300'>
										{news.lastEdited ? news.lastEdited : news.createdDate}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='text-sm text-gray-300'>{news.url}</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEdit(news.id)}>Edit</button>
									<button className='text-red-400 hover:text-red-300'>Delete</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{editNewsId && <EditNewModal newsId={editNewsId} onClose={() => setEditNewId(null)} onSave={handleSave}/>}
		</motion.div>
	);
};

export default NewsTable;
