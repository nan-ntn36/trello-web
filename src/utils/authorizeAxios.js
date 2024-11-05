import axios from 'axios';
import { toast } from 'react-toastify';
import { interceptorLoadingElements } from './formats';
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
