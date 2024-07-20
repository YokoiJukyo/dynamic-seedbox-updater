import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
import cookie from "cookie";

const DYNAMIC_SEEDBOX_UPDATE_URL =
  "https://t.myanonamouse.net/json/dynamicSeedbox.php";

const defaultConfig = {
  headers: {},
  proxy: process.env.PROXY,
  socks_proxy: process.env.SOCKS_PROXY,
  mam_hostname:
    process.env.MMA_DYNAMIC_SEEDBOX_UPDATE_URL || DYNAMIC_SEEDBOX_UPDATE_URL,
  mam_id: process.env.MAM_ID,
};

class MyAnonaMouseService {
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };

    if (this.isEmpty(this.config.mam_id)) {
      throw new Error(
        "mam_id session cookie is required. See how to get it: https://www.myanonamouse.net/preferences/index.php?view=security",
      );
    }

    if (this.config.proxy != null && this.config.socks_proxy != null) {
      throw new Error(
        "You can't use both proxy and socks proxy at the same time",
      );
    }
  }

  async update() {
    const axiosInstance = this.getAxiosInstance();
    const response = await axiosInstance.get(this.config.mam_hostname, {
      headers: {
        Cookie: cookie.serialize("mam_id", this.config.mam_id),
        ...this.config.headers,
      },
    });

    let result = {
      status_code: response.status,
      status_text: response.statusText,
      mam: response.data,
    };
    return result;
  }

  getAxiosInstance() {
    let instaceConfig = {};

    if (this.config.proxy) {
      const proxyAgent = new HttpsProxyAgent(this.config.proxy);
      instaceConfig = {
        httpsAgent: proxyAgent,
        httpAgent: proxyAgent,
      };
    }

    if (this.config.socks_proxy) {
      const proxyAgent = new SocksProxyAgent(this.config.socks_proxy);
      instaceConfig = {
        httpsAgent: proxyAgent,
        httpAgent: proxyAgent,
      };
    }

    return axios.create(instaceConfig);
  }

  isEmpty(str) {
    return str === null || str === undefined || str.trim() === "";
  }
}

export default MyAnonaMouseService;
