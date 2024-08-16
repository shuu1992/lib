// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const game: NavItemType = {
  title: 'menu.gameFeature',
  name: '',
  type: 'collapse',
  icon: 'CustomerServiceOutlined',
  url: '/game',
  breadcrumbs: true,
  children: [
    {
      title: 'menu.gameManage',
      name: '',
      type: 'item',
      url: '/game/manage',
    },
    {
      title: 'menu.gameRoom',
      name: '',
      type: 'item',
      url: '/game/room',
    },
    {
      title: 'menu.gameBet',
      name: '',
      type: 'item',
      url: '/game/bet',
    },
    {
      title: 'menu.gameBetRecord',
      name: '',
      type: 'item',
      url: '/game/betrecord',
    },
    {
      title: 'menu.gameDonate',
      name: '',
      type: 'item',
      url: '/game/donate',
    },
  ],
};

export default game;
