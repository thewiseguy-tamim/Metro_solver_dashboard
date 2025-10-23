import React, { useMemo, useState } from 'react';
import eventsJson from '../data/calendar/events.json';
import peopleJson from '../data/calendar/people.json';
import Toolbar from '../components/calendar/Toolbar';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ModalSchedule from '../components/calendar/ModalSchedule';
import ModalCreateTask from '../components/calendar/ModalCreateTask';
import { dateKey, getWeekDays } from '../components/calendar/utils';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(() => new Date('2024-11-06T00:00:00'));
  const [events, setEvents] = useState(eventsJson);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const peopleMap = useMemo(() => {
    const m = new Map();
    peopleJson.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  // Counts for the selected day
  const todayEvents = events.filter((e) => e.date === dateKey(selectedDate));
  const meetingsCount = todayEvents.filter((e) => e.type === 'meeting').length;
  const eventCount = todayEvents.filter((e) => e.type === 'event').length;

  const addEvent = (newEvent) => setEvents((prev) => [...prev, newEvent]);

  return (
    <div className="w-full">
      {/* Title + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0A0D14]">
            {selectedDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            })}
          </h1>
          <p className="text-[#6B7280]">
            You have {meetingsCount} meetings and {eventCount} events today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-[#0A0D14]"
            onClick={() => setOpenSchedule(true)}
          >
            Schedule
          </button>
          <button
            className="px-3 py-2 rounded-lg text-white bg-[#6C5DD3] hover:bg-[#5a4bc7]"
            onClick={() => setOpenCreate(true)}
          >
            + Create Task
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <Toolbar
          selectedDate={selectedDate}
          onToday={() => setSelectedDate(new Date())}
          onPrevWeek={() =>
            setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))
          }
          onNextWeek={() =>
            setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))
          }
        />

        {/* Grid */}
        <CalendarGrid selectedDate={selectedDate} events={events} peopleMap={peopleMap} />
      </div>

      {/* Modals */}
      {openSchedule && (
        <ModalSchedule
          onClose={() => setOpenSchedule(false)}
          people={peopleJson}
          onCreate={(payload) => {
            const id = `e_${Date.now()}`;
            const event = {
              id,
              type: 'meeting',
              title: payload.title || 'Meeting',
              subtitle: payload.subtitle || '',
              date: dateKey(payload.date),
              start: payload.timeStart || '09:00',
              end: payload.timeEnd || '09:30',
              organizerId: payload.organizerId,
              participants: payload.members.map((m) => m.id),
              platform: payload.platform || 'on Zoom',
              theme: payload.theme || 'purple',
            };
            addEvent(event);
            setOpenSchedule(false);
          }}
        />
      )}

      {openCreate && (
        <ModalCreateTask
          onClose={() => setOpenCreate(false)}
          people={peopleJson}
          onCreate={(payload) => {
            const id = `e_${Date.now()}`;
            const event = {
              id,
              type: 'event',
              title: payload.title || 'New Task',
              subtitle: payload.description || '',
              date: dateKey(payload.date),
              start: payload.timeStart || '10:00',
              end: payload.timeEnd || '10:30',
              organizerId: payload.assigneeId,
              participants: payload.members.map((m) => m.id),
              platform: payload.platform || '',
              theme: payload.theme || 'indigo',
            };
            addEvent(event);
            setOpenCreate(false);
          }}
        />
      )}
    </div>
  );
}