/*eslint-disable*/
/**
 * id(必填): cdnkey
 * w(高度有的情况下选填): 宽 ,  只设置宽,高度等比例缩放
 * h(宽度有的情况下选填): 高 ,  只设置高, 宽等比例饿缩放
 * e(选填)[0-4]:  0-1: 都表示等比例缩放, 0:表示按长边为基准,短边等比例 1:表示以短边为基准,长边等比例饿, 默认是1e,   2:表示强制的,就是你宽高设置多少那么现实的就是多少,  4: 特为填充色指定,长边填色,短边按指定值设置
 * l(选填): 设置的尺寸大于原图是否强制设置     1l: 保持原图尺寸  0l: 保持设置的尺寸, 默认设置成0L
 * bgc(选填):  rgb的色彩 - 分割, 默认 238-238-238
 * r(选填)[0-360]: 顺时针旋转
 * o(选填)[0-2]: 手机拍照额 exif 会导致图片 旋转的不对, 1: 先缩略在旋转  2: 先旋转在缩略 ,  一般需要的情况下 设置为 2即可
 * q(选填)[1-100]: 展示图片相对于原图的百分比质量
 * pr(选填)[0,1]: 图片展示的扫描方式, 移动端图片可设置1效果为先模糊后清晰
 * end(选填)[jpg,png,gif,src]: src 的意思是原图是啥就是啥
 * watermark(选填)[boolean]: 目前用得上的也就图片的3dker 的 logo 水印了- -
 * c: 1 自动裁剪
 */


// "https://cdnimg.3dker.cn/statics/img/default_avatar.png"

const defaultAvatar = 'https://cdnimg.3dker.cn/statics/img/default_avatar.png';

function watermarkHandle(w, h) {
    let wtStr = '';
    const contrast = w || h;
    if (contrast < 600) return '';
    wtStr += '|watermark=1&object=';
    if (contrast >= 900) {
    // watermark.png
        wtStr += 'd2F0ZXJtYXJrLnBuZw==';
    } else if (contrast >= 720 && contrast < 900) {
    // watermark.png@80p
        wtStr += 'd2F0ZXJtYXJrLnBuZ0A4MHA=';
    } else if (contrast >= 600 && contrast < 720) {
    // watermark.png@66p
        wtStr += 'd2F0ZXJtYXJrLnBuZ0A2NnA=';
    }
    wtStr += '&t=95&x=10&y=10';
    return wtStr;
}

function oss({
    id,
    w,
    h,
    l = 0,
    e = 1,
    bgc = '238-238-238',
    c,
    r,
    o,
    q = 90,
    watermark = false,
    end = '',
    pr,
    a, // 是否avatar的oss图片，方便统一默认头像
} = {}) {
    if (!id) {
        return a ? defaultAvatar : 'https://cdnimg.3dker.cn/7b7cb625f87d85216de9f25c18846e63';
    }

    const OSS_BASE_URL = process.env.VUE_APP_OSS_URL;


  var rst = (
      OSS_BASE_URL + "/" + id + "@" +
      ( w ? w + "w_" : "" ) +
      ( h ? h + "h_" : "" ) +
      ( (e || e === 0) ? e + "e_" : "" ) +
      ( (e === 4) ? bgc + "bgc_" : "" ) +
      ( c ? "1c_" : "" ) +
      ( r ? r + "r_" : "" ) +
      ( l ? l + "l_" : "" ) +
      ( o ? o + "o_" : "" ) +
      ( q ? q + "q_" : "" ) +
      ( pr ? pr + "pr_" : "" )
    ).replace(/[_|@]$/, "" ) +
    ( end ? '.' + end : '' ) +
    (watermark ? watermarkHandle( w, h ) : "")

    return rst;
}


const plugin = {
    install(Vue) {
        const vue = Vue;
        vue.prototype.$Oss = oss;
    }
};

export default plugin;
/* eslint-enable */
