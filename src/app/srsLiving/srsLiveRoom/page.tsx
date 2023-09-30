'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Card, message, Button } from 'antd';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import SrsRtcPull from '../srsRtcPush/srsRtcPull';

import style from './index.module.scss';

import {
  $serverSocketUrl,
  $srsServerAPIURL,
  $srsServerRTCURL,
  $srsServerFlvURL,
} from '@/config';

const SrsRtcPush = (props) => {
  const {
    userId = '',
    roomId = '',
    liveroomid = '',
    tid = '',
  } = props?.searchParams ?? {};
  const srsRtcPullLiveRoom = useRef<any>(null);
  const [linkSocket, setLinkSocket] = useState<Socket | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [streamId] = useState<string>('localStream-' + Date.now());
  const [userInfo, setUserInfo] = useState<Record<string, any>>({});
  const [localstream, setLocalstream] = useState<MediaStream | null>(null);
  const [roomUserList, setRoomUserList] = useState<
    Array<Record<string, string>>
  >([]);

  const PeerConnection =
    typeof window !== 'undefined'
      ? (window as any).RTCPeerConnection ||
        (window as any).mozRTCPeerConnection ||
        (window as any).webkitRTCPeerConnection
      : null;

  if (typeof window !== 'undefined') {
    (navigator as any).getUserMedia =
      (navigator as any).getUserMedia ||
      (navigator as any).webkitGetUserMedia ||
      (navigator as any).mozGetUserMedia;
  }

  // 初始化 直播视频流
  const initRoom = () => {
    if (liveroomid && srsRtcPullLiveRoom.current) {
      srsRtcPullLiveRoom.current.getPullSdp(liveroomid);
    }
  };

  const init = (userId: string, roomId: string, nickname?: string) => {
    const userInfo = {
      userId: userId,
      roomId: roomId,
      nickname: nickname,
    };

    const linkSocket = io($serverSocketUrl, {
      reconnectionDelayMax: 10000,
      transports: ['websocket'],
      query: {
        userId: userId,
        roomId: roomId,
        nickname: nickname,
      },
    });
    setLinkSocket(linkSocket);
    setUserInfo(userInfo);

    linkSocket.on('connect', () => {
      console.log('server init connect success');
    });
    linkSocket.on('roomUserList', (e) => {
      console.log('roomUserList', e);
      setRoomUserList(e);
    });
    linkSocket.on('msg', async (e) => {
      // 对方同意连麦后 本地接入自己视频流
      if (e['type'] === 'acceptApplyMic') {
        play();
      }
    });
    linkSocket.on('error', (e) => {
      console.log('error', e);
    });
  };

  const applyMic = () => {
    const params = { userId: userId, targetUid: tid, streamId: streamId };
    if (linkSocket) {
      linkSocket.emit('applyMic', params);
    }
  };

  const play = async () => {
    let newLocalstream: any = null;
    if (!localstream) {
      newLocalstream = await getLocalUserMedia('', '');
    }
    if (newLocalstream) {
      setLocalstream(newLocalstream);
      await setDomVideoStream('videoElement', newLocalstream);
      await getPushSdp(streamId, newLocalstream);
    }
  };

  // 推流至SRS
  const getPushSdp = async (streamId: string, stream: MediaStream) => {
    const pci = await new PeerConnection(null);
    setPc(pci);
    pci.addTransceiver('audio', { direction: 'sendonly' });
    pci.addTransceiver('video', { direction: 'sendonly' });
    // send
    stream.getTracks().forEach(function (track) {
      pci.addTrack(track);
    });
    const offer = await pci.createOffer();
    await pci.setLocalDescription(offer);
    const data = {
      api: $srsServerAPIURL + 'rtc/v1/publish/',
      streamurl: $srsServerRTCURL + streamId,
      sdp: offer.sdp,
    };
    axios
      .post($srsServerAPIURL + 'rtc/v1/publish/', data)
      .then(async (res: any) => {
        res = res.data;
        console.log(res);
        if (res.code === 0) {
          await pci.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: res.sdp }),
          );
        } else {
          message.error('推流失败请重试');
        }
      })
      .catch((err) => {
        console.error('SRS 推流异常', err);
        message.error('推流异常，请检查流媒体服务器');
      });
  };

  // 设置视频播放
  const setDomVideoStream = async (domId: string, newStream: MediaStream) => {
    const video = document.getElementById(domId) as HTMLVideoElement;
    const stream: any = video?.srcObject;
    if (stream) {
      stream.getTracks().forEach((e) => e.stop());
    }
    video.srcObject = newStream;
    video.muted = true;
    video.autoplay = true;
  };

  // 获取本地视频流 音频流
  const getLocalUserMedia = async (audioId: string, videoId: string) => {
    const constraints = {
      audio: { deviceId: audioId ? { exact: audioId } : undefined },
      video: {
        deviceId: videoId ? { exact: videoId } : undefined,
        width: 1920,
        height: 1080,
        frameRate: { ideal: 15, max: 24 },
      },
    };
    // console.log('window.stream', window.stream)
    // if (window.stream) {
    //   window.stream.getTracks().forEach(track => {
    //     track.stop();
    //   });
    // }
    return await navigator.mediaDevices
      .getUserMedia(constraints)
      .catch(handleError);
  };

  const handleError = (error) => {
    console.log(
      'navigator.MediaDevices.getUserMedia error: ',
      error.message,
      error.name,
    );
  };

  useEffect(() => {
    init(userId, roomId, userId);
    initRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, roomId]);

  return (
    <div className={style.wrapper}>
      <SrsRtcPull
        ref={srsRtcPullLiveRoom}
        scanvideodomId='srsRtcPullLiveRoom'
        title=''
      />
      <Card title='申请连麦'>
        <video id='videoElement' width='300px' height='200px' autoPlay muted />
        <Button onClick={applyMic} type={'primary'}>
          申请连麦
        </Button>
      </Card>
    </div>
  );
};

export default SrsRtcPush;
