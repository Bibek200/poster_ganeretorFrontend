import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-green-800 w-64 p-4 min-h-screen">
      <h2 className="text-xl font-semibold text-white mb-4">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${
              isActive
                ? 'bg-green-700 text-white'
                : 'text-gray-300 hover:bg-green-600 hover:text-white'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${
              isActive
                ? 'bg-green-700 text-white'
                : 'text-gray-300 hover:bg-green-600 hover:text-white'
            }`
          }
        >
          Upload Poster
        </NavLink>
        <NavLink
          to="/customer"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${
              isActive
                ? 'bg-green-700 text-white'
                : 'text-gray-300 hover:bg-green-600 hover:text-white'
            }`
          }
        >
          Add Customer
        </NavLink>
        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${
              isActive
                ? 'bg-green-700 text-white'
                : 'text-gray-300 hover:bg-green-600 hover:text-white'
            }`
          }
        >
          Create Schedule
        </NavLink>
        <NavLink
          to="/schedule-list"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${
              isActive
                ? 'bg-green-700 text-white'
                : 'text-gray-300 hover:bg-green-600 hover:text-white'
            }`
          }
        >
          Schedule List
        </NavLink>
        <NavLink
          to="/login"
          className="block px-4 py-2 rounded text-red-400 hover:bg-red-100 hover:text-red-700 transition"
        >
          Logout
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
