const logReqs = (req, res, next) => {
    console.log(`Request from Client: ${req.method} ${req.path}`);
    next();
}

export {logReqs};
