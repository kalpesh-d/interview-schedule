import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInterview, updateInterview } from "../feature/interviewSlice";

const InterviewModal = ({ isOpen, onClose, selectedDate, editInterview = null, onSave }) => {
  const dispatch = useDispatch();
  const interviewers = useSelector((state) => state.interviews.interviewers);
  const interviews = useSelector((state) => state.interviews.interviews);

  const formatDate = (date) => {
    if (!date) return '';
    // Ensure we're working with the local date
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    candidateName: editInterview?.candidateName || '',
    interviewerId: editInterview?.interviewerId || '',
    type: editInterview?.type || 'Technical',
    time: editInterview?.time || '09:00',
    date: formatDate(selectedDate || editInterview?.date || new Date()),
  });

  const [error, setError] = useState('');

  // Update date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        date: formattedDate
      }));
    }
  }, [selectedDate]);

  const checkOverlappingInterviews = (newInterview) => {
    const selectedDateTime = new Date(`${newInterview.date}T${newInterview.time}`);
    const selectedEndTime = new Date(selectedDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    return interviews.some(interview => {
      if (editInterview && interview.id === editInterview.id) return false;

      const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
      const interviewEndTime = new Date(interviewDateTime.getTime() + 60 * 60 * 1000);

      const isOverlapping = (
        (selectedDateTime >= interviewDateTime && selectedDateTime < interviewEndTime) ||
        (selectedEndTime > interviewDateTime && selectedEndTime <= interviewEndTime)
      );

      return isOverlapping && (
        interview.interviewerId === newInterview.interviewerId ||
        interview.candidateName === newInterview.candidateName
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.date || !formData.time) {
      setError('Please select both date and time');
      return;
    }

    try {
      // Create a date object in local timezone
      const [hours, minutes] = formData.time.split(':');
      const localDate = new Date(formData.date);
      localDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      // Validate the date
      if (isNaN(localDate.getTime())) {
        throw new Error('Invalid date or time');
      }

      const interviewData = {
        id: editInterview?.id || Date.now(),
        ...formData,
        interviewerId: parseInt(formData.interviewerId),
        date: localDate.toISOString(),
        time: formData.time
      };

      if (checkOverlappingInterviews(interviewData)) {
        setError('This time slot conflicts with an existing interview for the selected interviewer or candidate.');
        return;
      }

      if (editInterview) {
        dispatch(updateInterview(interviewData));
      } else {
        dispatch(addInterview(interviewData));
      }

      onSave?.(!!editInterview);
      onClose();
    } catch (err) {
      console.error('Date error:', err);
      setError('Please select a valid date and time');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"></div>
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">
                {editInterview ? 'Edit Interview' : 'Schedule Interview'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-lg border-gray-200 bg-gray-50/50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    placeholder="Enter candidate name"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Interviewer
                  </label>
                  <select
                    required
                    className="block w-full rounded-lg border-gray-200 bg-gray-50/50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.interviewerId}
                    onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
                  >
                    <option value="">Select Interviewer</option>
                    {interviewers.map((interviewer) => (
                      <option key={interviewer.id} value={interviewer.id}>
                        {interviewer.name} ({interviewer.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Interview Type
                  </label>
                  <select
                    required
                    className="block w-full rounded-lg border-gray-200 bg-gray-50/50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Behavioral">Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    className="block w-full rounded-lg border-gray-200 bg-gray-50/50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editInterview ? 'Update' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewModal; 