import { isMobile } from 'react-device-detect';
import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import GameManage from '@pages/GameManage';
import GameRoom from '@pages/GameRoom';
import GameBet from '@pages/GameBet';
import GameBetRecord from '@pages/GameBetRecord';
import GameDonate from '@pages/GameDonate';
// mobile;
import MGameManage from '@mpages/GameManage';
import MGameRoom from '@mpages/GameRoom';
import MGameBetRecord from '@mpages/GameBetRecord';
import MGameDonate from '@mpages/GameDonate';
import MGameBet from '@mpages/GameBet';

const GameRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'game',
          children: [
            {
              path: 'manage',
              element: (
                <KeepAlive name="/game/manage" cacheKey="/game/manage">
                  <PageProvider>{isMobile ? <MGameManage /> : <GameManage />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'room',
              element: (
                <KeepAlive name="/game/room" cacheKey="/game/room">
                  <PageProvider>{isMobile ? <MGameRoom /> : <GameRoom />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'bet',
              element: (
                <KeepAlive name="/game/bet" cacheKey="/game/bet">
                  <PageProvider>
                    <PageProvider>{isMobile ? <MGameBet /> : <GameBet />}</PageProvider>
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'betrecord',
              element: (
                <KeepAlive name="/game/betrecord" cacheKey="/game/betrecord">
                  <PageProvider>
                    <PageProvider>{isMobile ? <MGameBetRecord /> : <GameBetRecord />}</PageProvider>
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'donate',
              element: (
                <KeepAlive name="/game/donate" cacheKey="/game/donate">
                  <PageProvider>{isMobile ? <MGameDonate /> : <GameDonate />}</PageProvider>
                </KeepAlive>
              ),
            },
          ],
        },
      ],
    },
  ],
};

export default GameRoutes;
