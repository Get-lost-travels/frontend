import { fetchServices } from '../../api/services.js';

export function initializeExplore() {
    function setup() {
        const filtersForm = document.getElementById('exploreFilters');
        const resultsContainer = document.getElementById('exploreResults');
        const paginationContainer = document.getElementById('explorePagination');
        let currentPage = 1;
        let pageSize = 10;

        async function loadServices(page = 1) {
            const formData = new FormData(filtersForm);
            const params = Object.fromEntries(formData.entries());
            params.page = page;
            params.pageSize = pageSize;
            try {
                const data = await fetchServices(params);
                renderResults(data.services, data.total, data.page, data.pageSize);
            } catch (error) {
                resultsContainer.innerHTML = '<div class="text-red-500">Failed to load services.</div>';
            }
        }

        function renderResults(services, total, page, pageSize) {
            if (!services || services.length === 0) {
                resultsContainer.innerHTML = '<div class="text-gray-500">No services found matching your criteria.</div>';
                paginationContainer.innerHTML = '';
                return;
            }
            resultsContainer.innerHTML = services.map(service => `
                <div class="service-card border rounded p-4 mb-4">
                    <h3 class="text-lg font-bold">${service.title}</h3>
                    <div>Price: $${service.price}</div>
                    <div>Location: ${service.location}</div>
                    <div>Duration: ${service.duration} days</div>
                    <div>${service.description || ''}</div>
                    <div>Rating: ${service.averageRating ? service.averageRating.toFixed(1) : 'N/A'} (${service.reviewCount} reviews)</div>
                </div>
            `).join('');
            // Pagination
            const totalPages = Math.ceil(total / pageSize);
            paginationContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.className = 'mx-1 px-2 py-1 border rounded' + (i === page ? ' bg-blue-500 text-white' : '');
                btn.onclick = () => {
                    currentPage = i;
                    loadServices(currentPage);
                };
                paginationContainer.appendChild(btn);
            }
        }

        filtersForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentPage = 1;
            loadServices(currentPage);
        });

        // Initial load
        loadServices(currentPage);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
} 