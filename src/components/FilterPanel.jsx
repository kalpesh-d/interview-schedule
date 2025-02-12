import { useDispatch, useSelector } from 'react-redux';
import {
  setInterviewerFilter,
  setCandidateFilter,
  setDateRangeFilter,
  clearFilters,
} from '../feature/interviewSlice';

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { filters, interviewers, interviews } = useSelector((state) => state.interviews);

  // Get unique candidate names from interviews
  const candidates = [...new Set(interviews.map(interview => interview.candidateName))];

  const handleInterviewerChange = (e) => {
    dispatch(setInterviewerFilter(e.target.value));
  };

  const handleCandidateChange = (e) => {
    dispatch(setCandidateFilter(e.target.value));
  };

  const handleDateRangeChange = (startDate, endDate) => {
    dispatch(setDateRangeFilter({ start: startDate, end: endDate }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-medium text-gray-900">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Interviewer
          </label>
          <select
            value={filters.interviewer}
            onChange={handleInterviewerChange}
            className="block w-full rounded-lg border-gray-200 bg-gray-50/50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Interviewers</option>
            {interviewers.map((interviewer) => (
              <option key={interviewer.id} value={interviewer.id}>
                {interviewer.name} ({interviewer.role})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Candidate
          </label>
          <select
            value={filters.candidate}
            onChange={handleCandidateChange}
            className="block w-full rounded-lg border-gray-200 bg-gray-50/50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Candidates</option>
            {candidates.map((candidate) => (
              <option key={candidate} value={candidate}>
                {candidate}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <div className="flex gap-3">
            <input
              type="date"
              value={filters.dateRange.start || ''}
              onChange={(e) => handleDateRangeChange(e.target.value, filters.dateRange.end)}
              className="block w-full rounded-lg border-gray-200 bg-gray-50/50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Start date"
            />
            <input
              type="date"
              value={filters.dateRange.end || ''}
              onChange={(e) => handleDateRangeChange(filters.dateRange.start, e.target.value)}
              className="block w-full rounded-lg border-gray-200 bg-gray-50/50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="End date"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 