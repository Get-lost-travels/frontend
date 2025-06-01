import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Link } from 'preact-router';
import { useAuth } from '../context/AuthContext';
import { fetchServices, getServiceCategories } from '../api/services';

const Explore = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '0',
    maxPrice: '',
    location: '',
    duration: '',
    categoryId: '',
  });
  const [sortOption, setSortOption] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 8,
    total: 0
  });
  
  const initialLoadDone = useRef(false);
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getServiceCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    
    loadCategories();
  }, []);
  
  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { 
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
      
      if (searchTerm.trim()) {
        params.location = searchTerm;
      }

      if (sortOption) {
        const [sortBy, sortDir] = sortOption.split('-');
        params.sortBy = sortBy;
        params.sortDir = sortDir;
      }

      const data = await fetchServices(params);
      setServices(data.services || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
      
    } catch (err) {
      console.error("Error loading services:", err);
      setError("Failed to load destinations. Please try again later.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadServices();
      initialLoadDone.current = true;
    }
  }, []);
  
  useEffect(() => {
    if (initialLoadDone.current) {
      loadServices();
    }
  }, [pagination.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadServices();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadServices();
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => loadServices(), 0);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getCategoryById = (categoryId) => {
    if (!categoryId) return null;
    return categories.find(cat => cat.id === categoryId);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize) || 1;
    const currentPage = pagination.page;
    
    if (totalPages <= 1) return null;
    
    const pages = [];
    
    pages.push(
      <button 
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        class={`mx-1 px-3 py-1 cursor-pointer rounded ${
          currentPage === 1 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-[#16325B] text-white hover:bg-blue-700'
        }`}
        aria-label="Go to first page"
      >
        &laquo;
      </button>
    );
    
    pages.push(
      <button 
        key="prev"
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        class={`mx-1 px-3 py-1 cursor-pointer rounded ${
          currentPage === 1 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-[#16325B] text-white hover:bg-blue-700'
        }`}
        aria-label="Go to previous page"
      >
        &lsaquo;
      </button>
    );
    
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 2) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
        endPage = totalPages;
      }
    }
    
    if (startPage > 1) {
      pages.push(
        <span key="ellipsis1" class="mx-1 px-2 py-1">...</span>
      );
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          class={`mx-1 px-3 py-1 cursor-pointer rounded ${
            currentPage === i 
              ? 'bg-[#FFDC7F] text-[#16325B] font-bold' 
              : 'bg-[#16325B] text-white hover:bg-blue-700'
          }`}
          aria-label={`Go to page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      pages.push(
        <span key="ellipsis2" class="mx-1 px-2 py-1">...</span>
      );
    }
    
    pages.push(
      <button 
        key="next"
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        class={`mx-1 px-3 py-1 rounded ${
          currentPage === totalPages 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-[#16325B] text-white hover:bg-blue-700'
        }`}
        aria-label="Go to next page"
      >
        &rsaquo;
      </button>
    );
    
    pages.push(
      <button 
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        class={`mx-1 px-3 py-1 rounded ${
          currentPage === totalPages 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-[#16325B] text-white hover:bg-blue-700'
        }`}
        aria-label="Go to last page"
      >
        &raquo;
      </button>
    );

    return (
      <div class="flex justify-center mt-8">
        {pages}
      </div>
    );
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price on request';
    return `$${price}`;
  };
  
  const getPicsumUrl = (service) => {
    const seed = service.id || Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${seed}/400/300`;
  };

  return (
    <div class="min-h-screen w-4/5 mx-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-[#16325B]">Explore Destinations</h1>
          {user && (
            <div class="bg-[#16325B] text-white px-4 py-2 rounded-lg">
              Welcome, {user.username || 'Traveler'}!
            </div>
          )}
        </div>
        
        <div class="mb-8">
          {/* Search */}
          <form onSubmit={handleSearch}>
            <div class="flex mb-4">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.target.value)}
                class="w-full px-4 py-3 rounded-l-lg border-2 border-[#16325B] focus:outline-none focus:border-[#FFDC7F]"
              />
              <button
                type="submit"
                class="bg-[#16325B] text-white px-6 py-3 rounded-r-lg hover:bg-blue-800"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Modern Filters */}
          <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-[#16325B]">Filters</h2>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    minPrice: '0',
                    maxPrice: '',
                    location: '',
                    duration: '',
                    categoryId: '',
                  });
                  setSortOption('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                  loadServices();
                }}
                class="text-sm text-[#227B94] hover:underline"
              >
                Reset All
              </button>
            </div>
            
            <form onSubmit={applyFilters} class="space-y-0">
              <div class="flex flex-col md:flex-row gap-6 mb-4">
                <div class="w-full md:w-1/3">
                  <label class="block text-sm font-medium mb-2 text-gray-700">Category</label>
                  <select
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterChange}
                    class="w-full p-2 rounded border-2 border-gray-200 focus:border-[#227B94] focus:outline-none transition"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div class="w-full md:w-2/3">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-2 text-gray-700">Price Range ($)</label>
                      <div class="flex items-center gap-2">
                        <input 
                          type="number" 
                          name="minPrice" 
                          value={filters.minPrice} 
                          onChange={handleFilterChange}
                          min="0" 
                          placeholder="Min" 
                          class="w-full p-2 rounded border-2 border-gray-200 focus:border-[#227B94] focus:outline-none transition" 
                        />
                        <span class="text-gray-500">to</span>
                        <input 
                          type="number" 
                          name="maxPrice" 
                          value={filters.maxPrice} 
                          onChange={handleFilterChange}
                          min="0" 
                          placeholder="Max" 
                          class="w-full p-2 rounded border-2 border-gray-200 focus:border-[#227B94] focus:outline-none transition" 
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium mb-2 text-gray-700">Duration (days)</label>
                      <input 
                        type="number" 
                        name="duration" 
                        value={filters.duration} 
                        onChange={handleFilterChange}
                        min="1" 
                        placeholder="Any duration" 
                        class="w-full p-2 rounded border-2 border-gray-200 focus:border-[#227B94] focus:outline-none transition" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button 
                  type="submit" 
                  class="bg-[#16325B] hover:bg-blue-800 text-white py-2 px-6 rounded transition duration-300 ease-in-out"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
          
          {/* Main content */}
          <div class="w-full">
            {loading ? (
              <div class="flex justify-center items-center h-64">
                <div class="w-12 h-12 border-4 border-[#FFDC7F] border-t-[#16325B] rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : (
              <>
                <div class="grid grid-cols-2 gap-6">
                  {services.length > 0 ? services.map(service => (
                    <div key={service.id} class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <Link href={`/service/${service.id}`} class="block">
                        <div class="h-48 overflow-hidden relative">
                          <img 
                            src={service.imageUrl || getPicsumUrl(service)} 
                            alt={service.title} 
                            class="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://picsum.photos/seed/${service.id || 'travel'}-fallback/400/300`;
                            }}
                          />
                          {service.category && (
                            <div class="absolute top-3 right-3">
                              <span class="bg-[#FFDC7F] text-[#16325B] text-xs font-bold px-3 py-1 rounded-full">
                                {service.category.name || getCategoryById(service.categoryId)?.name || "Uncategorized"}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div class="p-6">
                        <div class="flex justify-between items-center mb-3">
                          <Link href={`/service/${service.id}`} class="text-xl font-bold text-[#16325B] hover:text-blue-800">
                            {service.title}
                          </Link>
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span class="ml-1 text-sm font-medium text-gray-600">
                              {service.averageRating ? service.averageRating : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div class="flex justify-between mb-3 text-sm text-gray-600">
                          <span>{service.location || 'Worldwide'}</span>
                          <span>{service.duration ? `${service.duration} days` : 'Flexible'}</span>
                        </div>
                        <p class="text-gray-600 mb-4">{service.description}</p>
                        <div class="flex justify-between items-center">
                          <span class="font-bold text-[#16325B]">{formatPrice(service.price)}</span>
                          <Link href={`/service/${service.id}`} class="bg-[#16325B] hover:bg-[#0F2A52] text-white font-medium py-2 px-4 rounded transition-colors duration-300">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div class="col-span-2 py-16 text-center">
                      <h3 class="text-xl text-gray-500">No destinations found</h3>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setFilters({
                            minPrice: '0',
                            maxPrice: '',
                            location: '',
                            duration: '',
                            categoryId: '',
                          });
                          setSortOption('');
                          setPagination(prev => ({ ...prev, page: 1 }));
                          loadServices();
                        }}
                        class="mt-4 bg-[#FFDC7F] hover:bg-yellow-400 text-[#16325B] font-medium py-2 px-4 rounded transition-colors duration-300"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
                
                {services.length > 0 && renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore; 