// src/config.js
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_BASE_URL, // .env 값 사용
    ENDPOINTS: {
      START: '/start',
      INFO: '/info',
      PREVIEW: '/preview',
      UPLOAD: '/upload',
      TRANSACTION: '/transaction'
    }
  };