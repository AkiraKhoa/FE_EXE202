import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const GenericTable = ({ tableName, columns, data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter(
      (item) =>
        columns.some((col) => item[col.accessor]?.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
  };

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>{tableName}</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-700'>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'
                >
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-700'>
          {filteredData.length === 0 ? (
            <tr>
                <td colSpan={columns.length} className="text-center text-gray-400 py-4">
                No data found
                </td>
            </tr>
            ) : (
            filteredData.map((item) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {columns.map((column) => (
                    <td key={column.accessor} className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                    {column.accessor === "actions" ? (
                    <td key={column.accessor} className="px-6 py-4 whitespace-nowrap">
                        <button className="text-indigo-400 hover:text-indigo-300 mr-2">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                    ) : (
                    <td key={column.accessor} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{item[column.accessor]}</div>
                    </td>
                    )}
                    </div>
                    </td>
                ))}
                </motion.tr>
            ))
            )}

          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default GenericTable;
