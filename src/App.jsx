import { Provider } from 'react-redux';
import store from './store';
import InterviewScheduler from './components/InterviewScheduler';

function App() {
  return (
    <Provider store={store}>
      <InterviewScheduler />
    </Provider>
  );
}

export default App;
