// Admin-only middleware - protects backend routes
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

function requireAdmin(req, res, next) {
    // Check for API key in header
    const apiKey = req.headers['x-admin-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!ADMIN_API_KEY) {
        // No admin key set - allow in development, block in production
        if (process.env.NODE_ENV === 'production') {
            return res.status(401).json({ error: 'Admin authentication not configured' });
        }
        console.warn('⚠️ No ADMIN_API_KEY set - allowing request in dev mode');
        return next();
    }
    
    if (!apiKey || apiKey !== ADMIN_API_KEY) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
}

// Optional: IP whitelist for extra security
function requireWhitelistedIP(whitelist = []) {
    return (req, res, next) => {
        if (whitelist.length === 0) return next();
        
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!whitelist.includes(clientIP)) {
            return res.status(403).json({ error: 'IP not whitelisted' });
        }
        next();
    };
}

module.exports = { requireAdmin, requireWhitelistedIP };
