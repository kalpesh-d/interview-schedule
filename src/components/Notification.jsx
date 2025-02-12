import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearNotification } from '../feature/interviewSlice';


const Notification = ({ message, type }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg ring-1 ring-black/5 transform transition-all duration-300 hover:shadow-xl min-w-[320px] max-w-[calc(100vw-2rem)]">
        {type === 'success' ? (
          <div className="flex-shrink-0 rounded-full bg-emerald-50 p-2">
            <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="flex-shrink-0 rounded-full bg-red-50 p-2">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={() => dispatch(clearNotification())}
          className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification; 