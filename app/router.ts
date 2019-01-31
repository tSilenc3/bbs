import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/signup', controller.user.signup);
  router.get('/login', controller.user.login);
};
