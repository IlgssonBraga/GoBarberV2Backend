import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
        name,
        email,
        password,
    });

    delete user.password;
    return res.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (req, res) => {
        const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

        const user = await updateUserAvatar.execute({
            user_id: req.user.id,
            avatarFilename: req.file.filename,
        });

        delete user.password;
        return res.json(user);
    },
);

export default usersRouter;
