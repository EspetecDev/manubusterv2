const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({error: 'Missing Authoritation Header'});
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({error: 'Malformed Authoritation Header'});
        }

        const { data: {user}, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(403).json({error: 'Invalid or Expired token'});
        }

        req.user = user;

        // proceed to the next middleware
        next();
    } catch(e) {
        console.error('Auth Middleware error: ', e);
        res.status(500).json({error: 'Interval Server Error'});
    }
};

module.exports = requireAuth;
