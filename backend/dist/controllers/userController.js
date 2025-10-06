import userService from '../services/userService.js';
export class UserController {
    async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            res.json(user);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.updateUser(id, req.body);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await userService.deleteUser(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default new UserController();
//# sourceMappingURL=userController.js.map