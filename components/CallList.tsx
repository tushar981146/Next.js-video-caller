'use client'
import { useGetCalls } from '@/hooks/useGetCalls'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import { Call } from '@stream-io/video-react-sdk';
import Loader from './Loader';
import { toast } from 'sonner';

type Recording = {
  end_time: Date | string;
  filename: string;
  session_id: string;
  start_time: Date | string;
  url: string;
}

type CallOrRecording = Call | Recording;

function CallList({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) {

  const { endedCalls, upComingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();

  const [recordings, setRecordings] = useState<Recording[]>([])

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'upcoming':
        return upComingCalls;
      case 'recordings':
        return recordings;

      default:
        return [];
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No previous calls';
      case 'upcoming':
        return 'No upcomming calls';
      case 'recordings':
        return 'No recordings';

      default:
        return '';
    }
  }

  useEffect(() => {
    
    const fetchRecordings = async () => {
      try {
         const callData = await Promise.all(callRecordings.map(meeting => meeting.queryRecordings()))
      const recordings = callData
        .filter(call => call.recordings.length > 0)
        .flatMap(call => call.recordings as Recording[])
      setRecordings(recordings)
      } catch (error) {
        console.error(error)
        toast('Failed to fetch recordings')
      }
    };

    if(type === 'recordings') fetchRecordings();
  }, [type, callRecordings])
  

  const calls = getCalls() as CallOrRecording[];
  const noCallsMessage = getNoCallsMessage();

  if(isLoading) return <Loader />

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? calls.map((meeting) => {
        const isRecording = type === 'recordings';
        const title = !isRecording
          ? (meeting as Call).state?.custom?.description?.substring(0, 26)
          : (meeting as Recording).filename?.substring(0, 20);
        const date = !isRecording
          ? (meeting as Call).state?.startsAt?.toLocaleString()
          : (meeting as Recording).start_time?.toString();

        return (
          <MeetingCard
            key={isRecording ? (meeting as Recording).session_id : (meeting as Call).id}
            icon={
              type === 'ended' 
              ? '/icons/previous.svg'
              : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recording.svg'
            }
            title={title || 'No description'}
            date={date || ''}
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'start'}
            handleClick={isRecording ? () => router.push(`${(meeting as Recording).url}`) : () => router.push(`/meeting/${(meeting as Call).id}`)}
            link={isRecording ? (meeting as Recording).url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`}
          />
        )
      }) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  )
}

export default CallList