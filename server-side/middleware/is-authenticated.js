import jwt from 'jsonwebtoken'
import config from 'config'

const isAuthenticated = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        try {
            jwt.verify(bearerToken, config.get('PrivateKey'));
            req.user = jwt.decode(bearerToken, config.get('PrivateKey')).user
            next();
        }
        catch (error) {
            res.sendStatus(403);
        }

    } else {
        res.sendStatus(403);
    }
}
export default isAuthenticated