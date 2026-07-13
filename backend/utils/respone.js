const respone = (method, req, res) => {
    if (req.method === method) {
        return req.body
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
module.exports = respone