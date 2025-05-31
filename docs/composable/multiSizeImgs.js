export function imgURL(url){
    return url.replace(/\.(jpg|png|jpeg)$/i, '_md.$1')
}