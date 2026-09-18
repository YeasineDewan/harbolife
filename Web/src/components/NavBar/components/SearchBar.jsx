import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { setSearchTerm } from "../../../features/uiSlice/uiSlice";
import { useDebounce } from "../../../hooks/useDebounce";
import Input from "../../../components/ui/Input";

export default function SearchBar({ id = "search-input" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearchTerm = useSelector((state) => state.ui.searchTerm);

  const [localSearch, setLocalSearch] = useState(initialSearchTerm);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      dispatch(setSearchTerm(localSearch));

      if (
        !location.pathname.includes("/category") &&
        !location.pathname.includes("/products")
      ) {
        navigate("/products");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Input
        id={id}
        type="text"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder="Search medicine, medical products..."
        icon={<Search className="w-5 h-5 text-gray-400" aria-hidden="true" />}
        className="bg-white dark:bg-(--color-surface-card) border-none shadow-inner focus:ring-2 focus:ring-(--color-primary-400)"
      />
    </form>
  );
}
