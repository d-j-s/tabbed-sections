const METHOD = 'GET';

export default function get(url) {

  return new Promise((resolve, reject) => {

    const finish = (req) => {
      try {
        req.data = JSON.parse(req.responseText);
      } catch(e) {}
      resolve(req);
    };

    if (window.XDomainRequest) {

      let req = new XDomainRequest();
      req.open(METHOD, url);

      req.onerror = err => reject(err);
      req.onload = () => finish(req);

      req.send();

    } else {

      let req = new XMLHttpRequest();
      req.open(METHOD, url, true);

      req.onerror = err => reject(err);
      req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status >= 200 && req.status < 400) {
          finish(req);
        } else {
          reject(req);
        }
      };

      req.send();

    }

  });

};
