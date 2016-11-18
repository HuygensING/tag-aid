export const fetchJson = (url, options = {}) => {
  const requestHeaders = {
    Accept: 'application/json',
  };
  if (!(options && options.body && options.body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (options.auth) {
    requestHeaders.Authorization = options.auth;
  }

  let status, statusText, headers = {}, body, json;

  return fetch(url, { ...options, headers: requestHeaders, credentials: 'include' })
    .then(response => {
      for (var pair of response.headers.entries()) {
        headers[pair[0]] = pair[1];
      }
      status = response.status;
      statusText = response.statusText;
      return response;
    })
    .then(response => response.text())
    .then(text => {
      body = text;
      try {
        json = JSON.parse(text);
      } catch (e) {
        // not json, no big deal
      }
      if (status < 200 || status >= 300) {
        return Promise.reject({
          // Error details for more specific logic actions
          status, statusText, headers, body, json,
       });
      }
      return { status, headers, body, json };
    });
};

export const queryParameters = (data) => Object.keys(data)
  .map(key => [key, data[key]].map(encodeURIComponent).join('='))
  .join('&');
