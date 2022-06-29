
import moment from "moment";
function nowtimeformat(last=0, current=(new Date())) {
    let now = parseInt(current.getTime() / 1000)
    let diff = now - last;
    let timestr = `${diff} secs ago`;
    if (diff >= 60 && diff < 60*60) {
        let mins = parseInt(diff / 60);
        timestr = `${mins} mins ago`;
    }else if(diff >= 60*60 && diff < 60*60*24) {
        let hr = parseInt(diff / (60 * 60));
        let mins = parseInt((diff / 60) % 60);
        timestr = `${hr} hr ${mins} min ago`;
    }else if (diff >= 60*60*24){
        timestr = current.toLocaleString('en-US', {
            weekday: 'short',
            month:'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          });
    }
    return timestr;
}


function timeformat(current=(new Date())) {
    return moment(current).format('YYYY-MM-DD HH:mm:ss');
}
export {
    nowtimeformat,
    timeformat
}