// const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
// const host = window.location.host;
// const server = protocol + host;

export const $serverSocketUrl =
  process.env.NODE_ENV === 'development'
    ? 'ws://127.0.0.1:18080'
    : 'ws://127.0.0.1:18080';

export const $srsServerAPIURL = 'http://192.168.253.128:1985/';

export const $srsServerRTCURL = 'webrtc://192.168.253.128:8085/live/';

export const $srsServerFlvURL = 'http://192.168.253.128:8085/live/';
