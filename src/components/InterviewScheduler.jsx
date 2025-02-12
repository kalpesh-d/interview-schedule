import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import InterviewModal from './InterviewModal';
import FilterPanel from './FilterPanel';
import Notification from './Notification';
import {
  deleteInterview,
  setNotification,
  clearNotification,
  setSelectedDate,
  setShowScheduleModal,
  setEditInterview
} from '../feature/interviewSlice';

function InterviewScheduler() {
  const dispatch = useDispatch();
  const interviews = useSelector((state) => state.interviews.interviews);
  const filters = useSelector((state) => state.interviews.filters);
  const selectedDate = useSelector((state) => state.interviews.ui.selectedDate ? new Date(state.interviews.ui.selectedDate) : null);
  const showScheduleModal = useSelector((state) => state.interviews.ui.showScheduleModal);
  const editInterview = useSelector((state) => state.interviews.ui.editInterview);
  const notification = useSelector((state) => state.interviews.ui.notification);

  const showNotification = (message, type) => {
    dispatch(setNotification({ message, type }));
    // Auto clear notification after 3 seconds
    setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);
  };

  const handleDateClick = (arg) => {
    dispatch(setSelectedDate(arg.date.toISOString()));
    dispatch(setEditInterview(null));
    dispatch(setShowScheduleModal(true));
  };

  const handleEventClick = (arg) => {
    const interview = interviews.find(i => i.id === parseInt(arg.event.id));
    if (interview) {
      dispatch(setEditInterview(interview));
      dispatch(setShowScheduleModal(true));
    }
  };

  const handleDeleteInterview = (interviewId) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      dispatch(deleteInterview(interviewId));
      showNotification('Interview deleted successfully', 'success');
    }
  };

  const handleInterviewSave = (isEdit) => {
    dispatch(setShowScheduleModal(false));
    dispatch(setEditInterview(null));
    showNotification(
      `Interview ${isEdit ? 'updated' : 'scheduled'} successfully`,
      'success'
    );
  };

  const handleCloseModal = () => {
    dispatch(setShowScheduleModal(false));
    dispatch(setEditInterview(null));
  };

  const filteredInterviews = interviews.filter(interview => {
    // Convert interviewer filter to number for correct comparison
    const selectedInterviewer = filters.interviewer ? parseInt(filters.interviewer, 10) : null;
    const matchesInterviewer = !selectedInterviewer || interview.interviewerId === selectedInterviewer;
    const matchesCandidate = !filters.candidate || interview.candidateName === filters.candidate;
    const interviewDate = new Date(interview.date);

    const matchesDateRange = (
      !filters.dateRange.start || !filters.dateRange.end ||
      (interviewDate >= new Date(filters.dateRange.start) &&
        interviewDate <= new Date(filters.dateRange.end))
    );

    return matchesInterviewer && matchesCandidate && matchesDateRange;
  });

  const formatEventDate = (dateStr) => {
    // Parse the ISO string into a local date
    const date = new Date(dateStr);
    // Keep the local time
    return date;
  };

  const calendarEvents = filteredInterviews.map(interview => {
    const eventDate = formatEventDate(interview.date);
    const [hours, minutes] = interview.time.split(':');
    eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    return {
      id: interview.id,
      title: `${interview.candidateName}`,
      start: eventDate,
      allDay: false,
      backgroundColor: interview.type === 'Technical' ? '#EEF2FF' :
        interview.type === 'HR' ? '#ECFDF5' : '#F5F3FF',
      borderColor: interview.type === 'Technical' ? '#818CF8' :
        interview.type === 'HR' ? '#34D399' : '#A78BFA',
      textColor: interview.type === 'Technical' ? '#4F46E5' :
        interview.type === 'HR' ? '#059669' : '#7C3AED',
      extendedProps: {
        type: interview.type,
        interviewerId: interview.interviewerId,
        candidateName: interview.candidateName,
        time: interview.time
      }
    };
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Interview Scheduler</h1>
            <div className="text-sm font-medium text-gray-500">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Filter Panel */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5">
            <FilterPanel />
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              events={calendarEvents}
              height="auto"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              eventClassNames="group rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              eventContent={(arg) => (
                <div className="flex items-center justify-between w-full p-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate text-sm">{arg.event.title}</span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="font-medium">{arg.event.extendedProps.type}</span>
                      <span className="text-gray-300">•</span>
                      <span>
                        {new Date(arg.event.start).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteInterview(parseInt(arg.event.id));
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-500 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              dayMaxEvents={4}
              moreLinkContent={(args) => (
                <div className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  +{args.num} more
                </div>
              )}
              slotMinTime="09:00:00"
              slotMaxTime="18:00:00"
              timeZone="local"
              nowIndicator={true}
              dayCellClassNames="hover:bg-gray-50 transition-colors"
              dayHeaderClassNames="text-sm font-medium text-gray-600"
              buttonIcons={{
                prev: 'chevron-left',
                next: 'chevron-right'
              }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week'
              }}
            />
          </div>
        </div>
      </main>

      <InterviewModal
        isOpen={showScheduleModal}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        editInterview={editInterview}
        onSave={handleInterviewSave}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => dispatch(clearNotification())}
        />
      )}
    </div>
  );
}

export default InterviewScheduler;