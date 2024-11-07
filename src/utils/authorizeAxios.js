import axios from 'axios';
import { toast } from 'react-toastify';
import { interceptorLoadingElements } from './formats';
import { refreshTokenApi } from '~/apis';
import { logoutUserApi } from '~/redux/user/userSlice';

/**
 * Không thể import {store} from '~/redux/store/' bình thường ở đây
 * Giải pháp:Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
 * Hiểu đơn giản : khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào trong main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức gán biến mainStore vào axiosReduxStore
 * cục bộ trong file này
 */
let axiosReduxStore;
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
};

// Khởi tạo đối tượng axios (authorizeAxiosInstance) mục đích custom và cấu hình chung cho dự án.
let authorizeAxiosInstance = axios.create();
// Thời gian chờ tối đa của 1 request là 10p
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE(phục vụ chúng ta sẽ lưu JWT token (refresh & access) vào trong httpOnly cookie của trình duyệt)
authorizeAxiosInstance.defaults.withCredentials = true;

// Cấu hình Interceptors (bộ đánh chặn vào giữa mọi request & respone )

//Interceptor request can thiệp vào giữa những cái request API
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(true);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// khởi tạo một cái promise cho việc gọi api refresh_token
let refreshTokenPromise = null;

//Interceptor request can thiệp vào giữa những cái response API
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    // xữ lý lỗi status code ngoài 200-299
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false);

    /**
     * Quan trọng: xữ lý Refresh token tự động
     */
    //Trường hợp 1: nếu nhận mã lỗi 401 thì gọi api đăng xuất luôn
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserApi(false));
    }
    // Trường hợp 2: Nếu nhận mã lỗi 410, thì sẽ gọi api refeshToken để làm mới lại accesstoken
    // Đầu tiến lấy được các request API bị lỗi thông qua error.config
    const originalRequests = error.config;
    if (error.response?.status === 410 && !originalRequests._retry) {
      //gán giá trị _retry luôn = true trong khoản thời gian chờ đảm bảo việc refresh token này luôn gọi 1 lần tại 1 thời điểm
      originalRequests._retry = true;
      // Kiểm tra nếu chưa có refreshToken promise thì thực hiện gán việc gọi api refresh_token đồng thời gán vào cho thằng refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenApi()
          .then((data) => {
            //đồng thời accessToken đã nằm trong httpOnly cookie
            return data?.accessToken;
          })
          .catch((_error) => {
            // nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserApi(false));
            return Promise.reject(_error); // tranh việc gọi api logout 2 lần
          })
          .finally(() => {
            // dù api có ok hay lỗi thì vẫn án cái refreshTokenPromise về null nhu ban đầu
            refreshTokenPromise = null;
          });
      }
      // cần return refreshTokenPromise chạy thành công và xử lý thêm ở đây
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        // bước 1: đối với trường hợp nếu dự án cần lưu accessToken hoặc localstorage hoặc đâu đó thì sẽ viết code thêm bước xữ lý ở đây

        // Hiện tại không cần bước 1 vì chúng ta đưa accessToken vào cookie sau khi api refreshToken được gọi thành công

        //bước 2:Quan trọng. Return lại axios instance của chúng ta kết hợp các originalRequests để gọi Api ban đầu bị lỗi
        return authorizeAxiosInstance(originalRequests);
      });
    }
    // xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API
    let errorMessage = error?.message;
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }
    // dùng toastify để hiển thị bất kể mọi mã lỗi - phục vụ việc refresh lai token - trừ lỗi 410
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default authorizeAxiosInstance;
