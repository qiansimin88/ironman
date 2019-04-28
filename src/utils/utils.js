import DayJs from 'dayjs';

export default {
    install(Vue) {
        Vue.prototype.$utils = {
            toDoubleDecimal(price) {
                return Number(`${Math.round(`${price}e2`)}e-2`).toFixed(2)
                // num = Number(num);
                // if (isNaN(num)) return '0.00';
                // //保留两位小数，第三位四舍五入
                // return accMul(Math.round(accMul(num , 100)),0.01).toFixed(2);
            },
            getConsListValue(list = [], val, pl = '--') {
                const cur = list.find(o => o.v === String(val));
                return (cur && cur.k) || pl;
            },
            add(arg1, arg2) {
                let r1; let r2; let m = null;
                try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
                try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
                m = Math.pow(10, Math.max(r1, r2))
                return (parseFloat(arg1 * m) + parseFloat(arg2 * m)) / m
            },
            tranDateTime(timeStamp) {
                if (timeStamp === '') return '';
                const date = new Date(timeStamp);
                const Month = parseInt(date.getMonth(), 10) + 1;
                return `${date.getFullYear()}-${
                    Month < 10 ? `0${Month}` : Month}-${
                    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}  ${
                    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${
                    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${
                    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`;
            },
            genDownloadUrl(dfsId) {
                const { $localStore, $globalConfig } = Vue.prototype;
                return `${$globalConfig.API_URL}sys/download?token=${$localStore.get('token')}&dfsId=${dfsId}`;
            },
            getDateTime(ts) {
                if (!ts) return '';
                return DayJs(ts).format('YYYY-MM-DD HH:mm:ss');
            },
            genDownloadUrlZIP(dfsIds) {
                const { $localStore, $globalConfig } = Vue.prototype;
                return `${$globalConfig.API_URL}/sys/batchDownload?token=${$localStore.get('token')}&dfsIds=${dfsIds}`;
            },
            viewsBops(redirectUrl) { // 跳转后台
                if (!redirectUrl) return;
                const { $localStore, $globalConfig } = Vue.prototype;
                const token = $localStore.get('token');
                const userId = $localStore.get('user_id');
                const url = `${$globalConfig.BOPSPATH}/oAuth?token=${token}&userId=${userId}&redirectUrl=${redirectUrl}`;
                window.open(url);
            }
        }
    }
}
