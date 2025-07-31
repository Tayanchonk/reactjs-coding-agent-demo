import { NavLink } from "react-router-dom";

type TabNavigationProps = {
  names: string[];
  links: string[];
};

const TabNavigation = ({ names, links }: TabNavigationProps) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {names.map((name, i) => (
          <NavLink
            key={i}
            to={links[i]}
            className={({ isActive }) =>
              `py-3 px-6 transition-colors duration-200 ${isActive
                ? "border-b border-solid border-[#3758F9] text-[#3758F9] font-semibold"
                : "text-gray-500"
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
