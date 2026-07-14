'use client'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { toast } from "sonner"
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker'


function MeetingTypeList() {
    const route = useRouter();
    const [meeting, setMeeting] = useState<"isSchedulemeeting" | "isJoiningMeeting" | 'isInstantmeeting' | undefined>()

    const { user } = useUser();

    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        discription: '',
        link: '',

    });

    const [callDetails, setCalldetails] = useState<Call>()

    const createMeeting = async () => {
        if(!user || !client) return;

        try {
            if(!values.dateTime) {
                toast("please select date and time");
                return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if(!call) throw new Error("failed to create call");

            const startAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.discription || 'Instant meeting';

            await call.getOrCreate({
                data: {
                    starts_at: startAt,
                    custom: {
                        description
                    }
                }
            });

            setCalldetails(call);

            if(!values.discription) {
                route.push(`/meeting/${call.id}`)
            };

            toast("meeting created");
            
        } catch (error) {
            console.error(error);
            toast("failed to create meeting")

            
        }
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCard
                img='/icons/add-meeting.svg'
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeeting('isInstantmeeting')}
                className="bg-orange-1"
            />
            <HomeCard
                img='/icons/schedule.svg'
                title="schedule Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeeting('isSchedulemeeting')}
                className="bg-blue-1"
            />
            <HomeCard
                img='/icons/recordings.svg'
                title="view recorings"
                description="check out your recordings"
                handleClick={() => route.push('/recordings')}
                className="bg-purple-1"
            />
            <HomeCard
                img='/icons/join-meeting.svg'
                title="Join Meeting"
                description="via invitation link"
                handleClick={() => setMeeting('isJoiningMeeting')}
                className="bg-yellow-1"
            />

            {!callDetails ? (
                <MeetingModel
                isOpen={meeting === 'isSchedulemeeting'}
                onClose={() => setMeeting(undefined)}
                title='create Meeting'
                handleClick={createMeeting}
            >
                <div className="flex flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">Add a description</label>
                    <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                        onChange={(e) => {
                            setValues({...values, discription: e.target.value})
                        }}
                         />
                </div>
                <div className="flex w-full flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">Select date and time</label>
                    <ReactDatePicker
                    selected={values.dateTime} 
                    onChange={(date) => setValues({...values, dateTime: date!})}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    timeCaption='time'
                    dateFormat='MMM d, yyyy h:mm aa'
                    className='w-full rounderd bg-dark-3 p-2 focus:outline-none'
                    />
                </div>
            </MeetingModel>
            ) : (
                 <MeetingModel
                isOpen={meeting === 'isSchedulemeeting'}
                onClose={() => setMeeting(undefined)}
                title='Meeting Created'
                className="text-center"
                handleClick={() => {
                    navigator.clipboard.writeText(meetingLink)
                    toast("meeting link copied to clipboard")
                }}

                image='/icons/checked.svg'
                buttonIcon = '/icons/copy.svg'
                buttonText = 'copy Meeting Link'
            />
            )}

            <MeetingModel
                isOpen={meeting === 'isInstantmeeting'}
                onClose={() => setMeeting(undefined)}
                title='start an Instant Meeting'
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />

            <MeetingModel
                isOpen={meeting === 'isJoiningMeeting'}
                onClose={() => setMeeting(undefined)}
                title='join Meeting'
                className="text-center"
                buttonText="Start Meeting"
                handleClick={() => route.push(values.link)}
            >
                <Input 
                    placeholder="Meeting Link"
                    className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                    onChange={(e) => setValues({...values, link: e.target.value})}
                />
            </MeetingModel>
        </section>
    )
}

export default MeetingTypeList