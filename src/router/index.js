import Vue from 'vue';
import Router from 'vue-router';
import Calendar from 'components/Calendar';

Vue.use(Router);

export default new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/',
      component: Calendar,
    },
  ],
});
