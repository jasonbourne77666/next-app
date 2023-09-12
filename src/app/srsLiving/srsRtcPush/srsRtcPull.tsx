import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Card } from 'antd';
import {} from 'react';
import axios from 'axios';
import {
  $serverSocketUrl,
  $srsServerAPIURL,
  $srsServerRTCURL,
  $srsServerFlvURL,
} from '@/config';

type Props = {
  scanvideodomId: string;
  title: string;
};

const SrsRtcPull = forwardRef((props: Props, ref: any) => {
  const { scanvideodomId, title } = props;
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  useImperativeHandle(ref, () => ({
    getPullSdp,
  }));

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

  const setDomVideoTrick = (trick: MediaStreamTrack) => {
    const video = document.getElementById(scanvideodomId) as HTMLVideoElement;
    let stream: MediaStream = video!.srcObject as MediaStream;
    if (stream) {
      stream.addTrack(trick);
    } else {
      stream = new MediaStream();
      stream.addTrack(trick);
      video.srcObject = stream;
      video.controls = true;
      video.autoplay = true;
      video.style.width = '100%';
      video.style.height = '100%';
      video.muted = true;
    }
  };

  const getPullSdp = async (streamId: string) => {
    if (pc) {
      pc.close();
    }
    const pci = await new PeerConnection(null);
    setPc(pci);
    pci.addTransceiver('audio', { direction: 'recvonly' });
    pci.addTransceiver('video', { direction: 'recvonly' });
    pci.ontrack = function (e) {
      setDomVideoTrick(e.track);
    };
    let offer = await pci.createOffer();
    await pci.setLocalDescription(offer);
    let data = {
      api: $srsServerAPIURL + 'rtc/v1/play/',
      streamurl: $srsServerRTCURL + streamId,
      sdp: offer.sdp,
    };
    axios
      .post($srsServerAPIURL + 'rtc/v1/play/', data)
      .then(async (res: any) => {
        res = res.data;
        console.log(res);
        if (res.code === 0) {
          // 得到流媒体服务器应答的信令，添加到本地核心关联实例化对象的种
          await pci.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: res.sdp }),
          );
        }
      })
      .catch((err) => {
        console.error('SRS 拉流异常', err);
      });
  };

  return (
    <div ref={ref} className=''>
      <Card title={title} style={{ width: 300 }}>
        <video
          id={scanvideodomId}
          controls
          width='100%'
          height='100%'
          autoPlay
          muted
        />
      </Card>
    </div>
  );
});

SrsRtcPull.displayName = 'SrsRtcPull';
export default SrsRtcPull;
