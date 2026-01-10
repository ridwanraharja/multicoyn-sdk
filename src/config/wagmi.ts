import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { liskSepolia } from './chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'MultiCoyn Payment SDK',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [liskSepolia],
  ssr: false,
});
