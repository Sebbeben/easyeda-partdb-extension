/**
 * Part-DB API Client for EasyEDA Pro extension.
 * Uses the Part-DB REST API (API Platform) with Bearer token auth.
 */
class PartDBClient {
    constructor() {
        this.baseUrl = '';
        this.token = '';
    }

    /**
     * Load connection settings from EasyEDA extension storage.
     */
    async loadSettings() {
        try {
            this.baseUrl = (await eda.sys_Storage.getExtensionUserConfig('PARTDB_URL')) || '';
            this.token = (await eda.sys_Storage.getExtensionUserConfig('PARTDB_TOKEN')) || '';
        } catch (e) {
            // Fallback: settings not yet configured
        }
        // Remove trailing slash
        this.baseUrl = this.baseUrl.replace(/\/+$/, '');
    }

    /**
     * Check if the client is configured.
     */
    isConfigured() {
        return this.baseUrl && this.token;
    }

    /**
     * Make an authenticated API request.
     * @param {string} endpoint - API endpoint path (e.g., '/api/parts')
     * @param {object} options - Additional fetch options
     * @returns {Promise<object>} Parsed JSON response
     */
    async request(endpoint, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('Part-DB connection not configured. Go to Part-DB > Settings.');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Check your API token.');
            }
            if (response.status === 403) {
                throw new Error('Access denied. Token may lack required permissions.');
            }
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Test the connection to Part-DB.
     * @returns {Promise<object>} Token info
     */
    async testConnection() {
        return this.request('/api/tokens/current');
    }

    /**
     * Search parts by name.
     * @param {string} query - Search term
     * @param {number} page - Page number (1-based)
     * @param {number} itemsPerPage - Items per page
     * @returns {Promise<object>} JSON-LD collection response
     */
    async searchParts(query, page = 1, itemsPerPage = 30) {
        const params = new URLSearchParams({
            'name': query,
            'page': page.toString(),
            'itemsPerPage': itemsPerPage.toString(),
        });
        return this.request(`/api/parts?${params}`);
    }

    /**
     * Get a single part by ID with full details.
     * @param {number|string} id - Part ID
     * @returns {Promise<object>} Part object
     */
    async getPart(id) {
        return this.request(`/api/parts/${id}`);
    }

    /**
     * Get all categories.
     * @param {number} page - Page number
     * @param {number} itemsPerPage - Items per page
     * @returns {Promise<object>} Categories collection
     */
    async getCategories(page = 1, itemsPerPage = 200) {
        const params = new URLSearchParams({
            'page': page.toString(),
            'itemsPerPage': itemsPerPage.toString(),
            'order[name]': 'asc',
        });
        return this.request(`/api/categories?${params}`);
    }

    /**
     * Get parts in a specific category.
     * @param {number|string} categoryId - Category ID
     * @param {number} page - Page number
     * @param {number} itemsPerPage - Items per page
     * @returns {Promise<object>} Parts collection
     */
    async getPartsByCategory(categoryId, page = 1, itemsPerPage = 30) {
        const params = new URLSearchParams({
            'category': `/api/categories/${categoryId}`,
            'page': page.toString(),
            'itemsPerPage': itemsPerPage.toString(),
        });
        return this.request(`/api/parts?${params}`);
    }

    /**
     * Get children of a category.
     * @param {number|string} categoryId - Parent category ID
     * @returns {Promise<object>} Category children collection
     */
    async getCategoryChildren(categoryId) {
        return this.request(`/api/categories/${categoryId}/children`);
    }

    /**
     * Get order details for a specific part.
     * @param {number|string} partId - Part ID
     * @returns {Promise<object>} Order details collection
     */
    async getPartOrderDetails(partId) {
        return this.request(`/api/parts/${partId}/orderdetails`);
    }

    /**
     * Extract Part ID from an API IRI string (e.g., '/api/parts/42' -> 42).
     * @param {string} iri - IRI string
     * @returns {number|null} Extracted ID
     */
    static extractId(iri) {
        if (!iri) return null;
        if (typeof iri === 'number') return iri;
        const match = String(iri).match(/\/(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
    }

    /**
     * Calculate total stock from part lots.
     * @param {Array} partLots - Array of part lot objects
     * @returns {number|string} Total stock amount or '?' if unknown
     */
    static calculateStock(partLots) {
        if (!partLots || partLots.length === 0) return 0;
        let total = 0;
        let hasUnknown = false;
        for (const lot of partLots) {
            if (lot.instock_unknown) {
                hasUnknown = true;
                continue;
            }
            // Skip expired lots
            if (lot.expiration_date) {
                const expiry = new Date(lot.expiration_date);
                if (expiry < new Date()) continue;
            }
            total += lot.amount || 0;
        }
        if (total === 0 && hasUnknown) return '?';
        return total;
    }

    /**
     * Get stock CSS class based on amount.
     * @param {number|string} stock - Stock amount
     * @param {number} minAmount - Minimum required amount
     * @returns {string} CSS class name
     */
    static stockClass(stock, minAmount = 0) {
        if (stock === '?') return 'stock-low';
        if (stock <= 0) return 'stock-zero';
        if (minAmount > 0 && stock < minAmount) return 'stock-low';
        return 'stock-ok';
    }
}

// Shared toast notification helper
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Shared escape HTML helper
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
