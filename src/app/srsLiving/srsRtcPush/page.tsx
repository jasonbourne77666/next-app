'use client';

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { message, Button, Space } from 'antd';

import SrsRtcPull from './srsRtcPull';

import { getParams } from '@/utils/utils';
import {
  $serverSocketUrl,
  $srsServerAPIURL,
  $srsServerRTCURL,
  $srsServerFlvURL,
} from '@/config';
import style from './index.module.scss';

const Page = (props) => {
  const srsRtcPullPreview = useRef<any>(null);
  const srsRtcPullApplyMic = useRef<any>(null);
  const { userId = '', roomId = '' } = props?.searchParams ?? {};
  const [streamId] = useState<string>('localStream-' + Date.now());
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  const [shareStream, setShareStream] = useState<MediaStream | null>(null);
  const [shareStatus, setShareStatus] = useState<boolean>(false);

  const [scanUrlFlv, setScanUrlFlv] = useState<string>('');
  const [scanUrlHls, setScanUrlHls] = useState<string>('');
  const [videoStatus, setVideoStatus] = useState<boolean>(true);
  const [audioStatus, setAudioStatus] = useState<boolean>(true);
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

  // 本地视频流音频流渲染 并 推流至SRS
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
          //按照给是组装flv和hls点播地址 （SRS官网指定格式）
          setScanUrlFlv($srsServerFlvURL + streamId + '.flv');
          setScanUrlHls($srsServerFlvURL + streamId + '.m3u8');
          //推流成功后直接webrtc拉流预览 如果拉流这个步骤还没学的话等学完下节课再看这里
          preLive();
        } else {
          message.error('推流失败请重试');
        }
      })
      .catch((err) => {
        console.error('SRS 推流异常', err);
        message.error('推流异常，请检查流媒体服务器');
      });
  };

  const init = (userId: string, roomId: string, nickname?: string) => {
    const userInfo = {
      userId: userId,
      roomId: roomId,
      nickname: nickname,
    };

    setUserInfo(userInfo);

    const linkSocket = io($serverSocketUrl, {
      reconnectionDelayMax: 10000,
      transports: ['websocket'],
      query: {
        userId: userId,
        roomId: roomId,
        nickname: nickname,
      },
    });

    linkSocket.on('connect', () => {
      console.log('server init connect success');
    });

    linkSocket.on('roomUserList', (e) => {
      console.log('roomUserList', e);
      setRoomUserList(e);
    });

    linkSocket.on('msg', async (e) => {
      console.log('msg', e);
      if (e['type'] === 'applyMic') {
        //自动同意
        const params = {
          userId: getParams('userId'),
          targetUid: e.data.userId,
        };
        // 自动发起 acceptApplyMic 消息表示同意
        linkSocket.emit('acceptApplyMic', params);
        const remoteStreamId = e.data.streamId;
        // 请求连麦方的视频流
        srsRtcPullApplyMic.current.getPullSdp(remoteStreamId);
      } else if (e['type'] === 'join' || e['type'] === 'leave') {
        setTimeout(() => {
          const params = { roomId };
          linkSocket.emit('roomUserList', params);
        }, 1000);
      }
    });

    linkSocket.on('error', (e) => {
      console.log('error', e);
    });
  };

  const handleError = (error) => {
    console.log(
      'navigator.MediaDevices.getUserMedia error: ',
      error.message,
      error.name,
    );
  };

  // 预览
  const preLive = () => {
    srsRtcPullPreview.current.getPullSdp(streamId);
  };

  // 屏幕共享
  const getShareMedia = async () => {
    const constraints = {
      video: { width: 1920, height: 1080 },
      audio: false,
    };
    return await navigator.mediaDevices
      .getDisplayMedia(constraints)
      .catch(handleError);
  };

  // 切换视频流
  const changeVideo = async () => {
    if (!pc) {
      message.error('请先点击推流');
      return;
    }
    const stream = await getShareMedia();
    if (stream) {
      setShareStream(stream);
      const [videoTrack] = stream!.getVideoTracks();
      const senders = pc.getSenders();
      const send = senders.find((s) => s?.track?.kind === 'video');
      send!.replaceTrack(videoTrack);
      setShareStatus(true);
    }
  };

  // 停止共享
  const stopShare = () => {
    if (shareStream) {
      shareStream.getTracks().forEach((e) => e.stop());
      setShareStream(null);
      setShareStatus(false);
      const [videoTrack] = localstream!.getVideoTracks();
      const senders = pc!.getSenders();
      const send = senders.find((s) => s?.track?.kind === 'video');
      send!.replaceTrack(videoTrack);
    }
  };

  // 操作摄像头
  const videoControl = () => {
    if (pc) {
      setVideoStatus(!videoStatus);
      const senders = pc.getSenders();
      const send = senders.find((s) => s?.track?.kind === 'video');
      if (send) {
        send!.track!.enabled = !videoStatus;
      }
    } else {
      message.error('请先点击推流');
    }
  };

  // 操作麦克风
  const audioControl = () => {
    if (pc) {
      setAudioStatus(!audioStatus);
      const senders = pc.getSenders();
      const send = senders.find((s) => s?.track?.kind === 'audio');
      send!.track!.enabled = !audioStatus;
    } else {
      message.error('请先点击推流');
    }
  };

  useEffect(() => {
    init(userId, roomId, userId);
  }, [userId, roomId]);

  return (
    <div className={style.wrapper}>
      <div className={style.local}>
        <video
          controls
          width='700px'
          height='450px'
          id='videoElement'
          style={{ objectFit: 'fill' }}
        />
        <div className={style.url}>
          {scanUrlFlv && <p> FLV地址：{scanUrlFlv}</p>}
          {scanUrlHls && <p>HLS地址：{scanUrlHls}</p>}
        </div>
        <div className={style.btns}>
          <Button type={'primary'} onClick={() => play()}>
            推流
          </Button>
          <Button onClick={() => audioControl()}>
            {audioStatus ? '关闭' : '打开'}
            {'麦克风'}
          </Button>
          <Button onClick={() => videoControl()}>
            {videoStatus ? '关闭' : '打开'}
            {'摄像头'}
          </Button>
          <Button
            onClick={() => {
              shareStatus ? stopShare() : changeVideo();
            }}
            type={'primary'}>
            {shareStatus ? '停止' : '屏幕'}分享
          </Button>
        </div>
      </div>
      <div className={style.remote}>
        <Space direction='vertical' size={16}>
          <SrsRtcPull
            ref={srsRtcPullPreview}
            scanvideodomId='srsRtcPullPreview'
            title='直播预览'
          />
          <SrsRtcPull
            ref={srsRtcPullApplyMic}
            scanvideodomId='srsRtcPullApplyMic'
            title='连麦客户端'
          />
        </Space>
      </div>
    </div>
  );
};

export default Page;
