import { faker } from '@faker-js/faker'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

export default defineFakeRoute([
  {
    url: '/mock/anyTenant/login',
    method: 'post',
    response: (option: any) => {
      return {
        msg: '',
        code: 0,
        data: {
          username: option.body.username,
          token: faker.string.uuid(),
          // avatar: `@image("600x600/000/fff&text=${option.body.username}")`,
          avatar: faker.image.avatar(),
          expiration: `${Math.ceil(new Date().getTime()) + (24 * 60 * 60 * 1000)}`,
        },
      }
    },
  },
  {
    url: '/mock/auth/refresh',
    method: 'post',
    response: (option: any) => {
      return {
        msg: '',
        code: 0,
        data: {
          withCredentials: option.body.withCredentials,
          token: faker.string.uuid(),
        },
      }
    },
  },
  {
    url: '/mock/anyone/visible/resource',
    method: 'get',
    response: (option: any) => {
      let permissions: string[] = []
      if (option.query.account === 'admin') {
        permissions = [
          'permission.browse',
          'permission.create',
          'permission.edit',
          'permission.remove',
        ]
      }
      else if (option.query.account === 'test') {
        permissions = [
          'permission.browse',
        ]
      }
      return {
        msg: '',
        code: 0,
        data: {
          resourceList: permissions,
          roleList: [],
        },
      }
    },
  },
  {
    url: '/mock/member/edit/password',
    method: 'post',
    response: () => ({
      msg: '',
      code: 0,
      data: {
        isSuccess: true,
      },
    }),
  },
])
