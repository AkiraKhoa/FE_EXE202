import { BarChart2, Bell, BookOpen, Users, LogOut, Menu, Contact } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = {
  Admin: [
    { name: "Dashboard", icon: BarChart2, color: "#616", href: "/" },
    { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
    { name: "Profile", icon: Contact, color: "#EC4899", href: "/profile" },
  ],
  Staff: [
    { name: "Recipes", icon: BookOpen, color: "#8B5CF6", href: "/recipes" },
    { name: "Notification", icon: Bell, color: "#10B981", href: "/notifications" },
    { name: "Profile", icon: Contact, color: "#EC4899", href: "/profile" },
  ],
};

const Sidebar = ({ role, setUser }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = SIDEBAR_ITEMS[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");  // ✅ Xóa role
    setUser(null);
    navigate("/login");
  };

  return (
    <motion.div
      className={`relative z-50 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-3 flex flex-col border-r border-gray-700">
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="pt-4 pb-3 pl-3 pr-3 hover:bg-gray-700 rounded-lg transition-colors self-start mb-2"
        >
          <Menu size={25} className="text-gray-400" />
        </button>

        <nav className="mt-8 flex-grow relative">
          {/* Active Background Indicator */}
          {menuItems.map((item, index) => (
            location.pathname === item.href && (
              <motion.div
                key="active-bg"
                layoutId="active-bg"
                className="absolute inset-x-0 h-12 rounded-lg bg-gray-700/50"
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30 
                }}
                initial={false}
                style={{ 
                  top: `${index * (48 + 8)}px`,  // 48px height + 8px margin
                }}
              />
            )
          ))}

          {menuItems.map((item, index) => (
            <Link 
              key={item.href} 
              to={item.href}
              className={`relative z-10 block mb-2 ${
                location.pathname === item.href ? 'text-white' : 'text-gray-400'
              }`}
            >
              <motion.div
                className="flex items-center h-12 px-4 text-sm font-medium rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon 
                  size={24} 
                  style={{ 
                    color: location.pathname === item.href ? '#fff' : item.color,
                    minWidth: "20px" 
                  }} 
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}

          {/* Logout Button */}
          <motion.div
            onClick={handleLogout}
            className="relative z-10 flex items-center h-12 px-4 mt-auto text-sm font-medium rounded-lg hover:bg-red-600/20 transition-colors cursor-pointer"
          >
            <LogOut size={24} style={{ color: "#F87171", minWidth: "20px" }} />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className="ml-4 whitespace-nowrap text-red-400"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
