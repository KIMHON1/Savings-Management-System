export default function validate(schema, property = 'body') {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property]);
        if (error) {
            return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
        }
        req.validated = value;
        next();
    };
};
