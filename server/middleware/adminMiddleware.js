const adminMiddleware = async (req, res, next) => {

    try {

        if (!req.user) {

            return res.status(401).json({
                message: "Authentication required."
            });

        }

        if (req.user.role !== "admin") {

            return res.status(403).json({
                message: "Access denied. Admins only."
            });

        }

        next();

    } catch (error) {

        console.log("Admin Middleware Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

module.exports = adminMiddleware;