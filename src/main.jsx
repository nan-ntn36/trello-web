import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import theme from './theme.js';

// cấu hình toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// cấu hình mui dialog
import { ConfirmProvider } from 'material-ui-confirm';
//cấu hình redux
import { store } from '~/redux/store.js';
import { Provider } from 'react-redux';

//Cấu hình react-router-dom với browserRouter
import { BrowserRouter } from 'react-router-dom';

// Cấu hình redux-persist
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const persistor = persistStore(store);

// Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from '~/utils/authorizeAxios.js';
injectStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename="/">
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            // set giá trị cho tất cả dialog
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              cancellationButtonProps: { color: 'inherit' },
              confirmationButtonProps: {
                color: 'secondary',
                variant: 'outlined',
              },
            }}
          >
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-left" theme="colored" />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
